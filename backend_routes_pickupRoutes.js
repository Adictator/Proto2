const express = require('express');
const router = express.Router();
const path = require('path');
const multer = require('multer');
const authMiddleware = require('../middleware/authMiddleware');
const Pickup = require('../models/Pickup');
const Transaction = require('../models/Transaction');
const User = require('../models/User');
const { analyzeFoodItems } = require('../services/foodAnalyzer');
const { verifyImageNotDuplicate, saveImageRecord } = require('../services/imageVerifier');
const { sendVerificationEmail } = require('../services/emailService');

// Multer setup
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, '../uploads'));
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  }
});

const upload = multer({ storage });

// CREATE PICKUP (Restaurant)
router.post('/', authMiddleware, upload.single('foodImage'), async (req, res) => {
  try {
    if (req.userRole !== 'restaurant') {
      return res.status(403).json({ message: 'Only restaurants can create pickups' });
    }

    const { foodItems, pickupLocation, timeSlot } = req.body;
    let parsedFoodItems = foodItems;
    
    if (typeof foodItems === 'string') {
      parsedFoodItems = JSON.parse(foodItems);
    }

    // Analyze food items
    const analyzedItems = analyzeFoodItems(parsedFoodItems);

    const pickup = new Pickup({
      restaurantId: req.userId,
      foodItems: analyzedItems,
      foodImageUrl: req.file ? `/uploads/${req.file.filename}` : null,
      pickupLocation: JSON.parse(pickupLocation),
      timeSlot: JSON.parse(timeSlot),
      status: 'available'
    });

    await pickup.save();
    await pickup.populate('restaurantId', 'restaurantName phoneNumber email');

    res.status(201).json({
      message: 'Pickup request created successfully',
      pickup
    });
  } catch (error) {
    console.error('Create pickup error:', error);
    res.status(500).json({ message: 'Failed to create pickup' });
  }
});

// GET AVAILABLE PICKUPS
router.get('/available', authMiddleware, async (req, res) => {
  try {
    const { latitude, longitude } = req.query;

    let query = { status: 'available' };

    // Location-based filtering (within 10km)
    if (latitude && longitude) {
      query.pickupLocation = {
        $near: {
          $geometry: {
            type: 'Point',
            coordinates: [parseFloat(longitude), parseFloat(latitude)]
          },
          $maxDistance: 10000 // 10km
        }
      };
    }

    const pickups = await Pickup.find(query)
      .populate('restaurantId', 'restaurantName phoneNumber email pickupLocation')
      .sort({ createdAt: -1 });

    res.json(pickups);
  } catch (error) {
    console.error('Get pickups error:', error);
    res.status(500).json({ message: 'Failed to fetch pickups' });
  }
});

// ACCEPT PICKUP (Volunteer/Partner)
router.post('/:pickupId/accept', authMiddleware, async (req, res) => {
  try {
    if (!['volunteer', 'partner'].includes(req.userRole)) {
      return res.status(403).json({ message: 'Only volunteers and partners can accept pickups' });
    }

    const pickup = await Pickup.findById(req.params.pickupId);
    if (!pickup) {
      return res.status(404).json({ message: 'Pickup not found' });
    }

    if (pickup.status !== 'available') {
      return res.status(400).json({ message: 'Pickup is no longer available' });
    }

    pickup.assignedVolunteer = req.userId;
    pickup.status = 'accepted';
    await pickup.save();

    // Notify restaurant
    const restaurant = await User.findById(pickup.restaurantId);
    const volunteer = await User.findById(req.userId);
    
    await sendVerificationEmail(
      restaurant.email,
      `Your pickup has been accepted by ${volunteer.firstName} ${volunteer.lastName}`,
      'notification'
    );

    res.json({
      message: 'Pickup accepted successfully',
      pickup
    });
  } catch (error) {
    console.error('Accept pickup error:', error);
    res.status(500).json({ message: 'Failed to accept pickup' });
  }
});

// UPLOAD DELIVERY PROOF
router.post('/:pickupId/delivery-proof', authMiddleware, upload.single('deliveryProof'), async (req, res) => {
  try {
    const pickup = await Pickup.findById(req.params.pickupId);
    if (!pickup) {
      return res.status(404).json({ message: 'Pickup not found' });
    }

    if (!req.file) {
      return res.status(400).json({ message: 'Image file required' });
    }

    const filePath = path.join(__dirname, '../uploads', req.file.filename);

    // Verify image is not a duplicate
    const verificationResult = await verifyImageNotDuplicate(filePath, req.userId);
    
    if (verificationResult.isDuplicate) {
      return res.status(409).json({
        message: verificationResult.message,
        isDuplicate: true
      });
    }

    // Save image record
    await saveImageRecord(req.userId, pickup._id, verificationResult.imageHash, `/uploads/${req.file.filename}`);

    // Update pickup status
    pickup.deliveryProof = {
      imageUrl: `/uploads/${req.file.filename}`,
      imageHash: verificationResult.imageHash,
      uploadedAt: new Date(),
      verifiedBy: req.userRole
    };
    pickup.status = 'completed';
    await pickup.save();

    // Create transaction
    let transactionData = {
      userId: req.userId,
      pickupId: pickup._id,
      status: 'completed'
    };

    if (req.userRole === 'partner') {
      transactionData.type = 'payment';
      transactionData.amount = 50; // ₹50 per pickup
      
      // Update partner's balance
      await User.findByIdAndUpdate(req.userId, {
        $inc: { virtualBankBalance: 50 }
      });
    } else {
      transactionData.type = 'points';
      transactionData.pointsEarned = 10;
      
      // Update volunteer's points
      await User.findByIdAndUpdate(req.userId, {
        $inc: { totalPointsEarned: 10, totalPickupsCompleted: 1 }
      });
    }

    await Transaction.create(transactionData);

    res.json({
      message: 'Delivery proof uploaded - pickup completed!',
      congratulations: req.userRole === 'volunteer' 
        ? '🎉 Great job! You earned 10 points!'
        : '💰 Payment of ₹50 added to your account!',
      pickup
    });
  } catch (error) {
    console.error('Upload delivery proof error:', error);
    res.status(500).json({ message: 'Failed to upload delivery proof' });
  }
});

// GET TRANSACTIONS
router.get('/transactions', authMiddleware, async (req, res) => {
  try {
    const transactions = await Transaction.find({ userId: req.userId })
      .populate('pickupId', 'foodItems timeSlot pickupLocation')
      .sort({ createdAt: -1 });

    res.json(transactions);
  } catch (error) {
    console.error('Get transactions error:', error);
    res.status(500).json({ message: 'Failed to fetch transactions' });
  }
});

// GET BALANCE
router.get('/balance', authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.userId);

    if (user.role === 'partner') {
      res.json({
        role: 'partner',
        balance: user.virtualBankBalance,
        label: 'Virtual Bank Balance',
        currency: '₹'
      });
    } else {
      res.json({
        role: 'volunteer',
        balance: user.totalPointsEarned,
        label: 'Volunteer Points',
        pickupsCompleted: user.totalPickupsCompleted
      });
    }
  } catch (error) {
    console.error('Get balance error:', error);
    res.status(500).json({ message: 'Failed to fetch balance' });
  }
});

module.exports = router;