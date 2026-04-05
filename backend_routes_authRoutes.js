const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const VerificationCode = require('../models/VerificationCode');
const { sendVerificationEmail } = require('../services/emailService');

// Helper function to generate verification code
const generateCode = () => Math.random().toString().slice(2, 8);

// Helper function to create JWT
const createToken = (userId, role) => {
  return jwt.sign(
    { id: userId, role },
    process.env.JWT_SECRET || 'your-secret-key',
    { expiresIn: '7d' }
  );
};

// SIGN UP - Step 1: Send verification code
router.post('/signup', async (req, res) => {
  try {
    const { email, role } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(409).json({ message: 'Email already registered' });
    }

    // Generate and save verification code
    const code = generateCode();
    await VerificationCode.deleteMany({ email, type: 'signup' }); // Remove old codes
    
    const verificationCode = new VerificationCode({
      email,
      code,
      type: 'signup'
    });
    await verificationCode.save();

    // Send email
    await sendVerificationEmail(email, code, 'signup');

    res.json({
      message: 'Verification code sent to email',
      email,
      role
    });
  } catch (error) {
    console.error('Signup error:', error);
    res.status(500).json({ message: 'Signup failed' });
  }
});

// SIGN UP - Step 2: Verify code and create account
router.post('/verify-code', async (req, res) => {
  try {
    const { email, code, password, role, firstName, lastName, phoneNumber, restaurantName } = req.body;

    // Verify code
    const verification = await VerificationCode.findOne({ email, code, type: 'signup' });
    if (!verification) {
      return res.status(400).json({ message: 'Invalid or expired verification code' });
    }

    // Create user
    const user = new User({
      email,
      password,
      role,
      firstName,
      lastName,
      phoneNumber,
      restaurantName: role === 'restaurant' ? restaurantName : undefined,
      isVerified: true
    });

    await user.save();
    await VerificationCode.deleteOne({ _id: verification._id });

    const token = createToken(user._id, user.role);

    res.status(201).json({
      message: 'Account created successfully',
      token,
      user: {
        id: user._id,
        email: user.email,
        role: user.role,
        firstName: user.firstName
      }
    });
  } catch (error) {
    console.error('Verification error:', error);
    res.status(500).json({ message: 'Verification failed' });
  }
});

// LOGIN - Step 1: Send verification code
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    // Find user
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    // Verify password
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    // Generate and send verification code
    const code = generateCode();
    await VerificationCode.deleteMany({ email, type: 'login' });
    
    const verificationCode = new VerificationCode({
      email,
      code,
      type: 'login'
    });
    await verificationCode.save();

    await sendVerificationEmail(email, code, 'login');

    res.json({
      message: 'Verification code sent to email',
      email
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Login failed' });
  }
});

// LOGIN - Step 2: Verify code
router.post('/verify-login', async (req, res) => {
  try {
    const { email, code } = req.body;

    // Verify code
    const verification = await VerificationCode.findOne({ email, code, type: 'login' });
    if (!verification) {
      return res.status(400).json({ message: 'Invalid or expired verification code' });
    }

    // Get user
    const user = await User.findOne({ email });

    await VerificationCode.deleteOne({ _id: verification._id });

    const token = createToken(user._id, user.role);

    res.json({
      message: 'Login successful',
      token,
      user: {
        id: user._id,
        email: user.email,
        role: user.role,
        firstName: user.firstName
      }
    });
  } catch (error) {
    console.error('Login verification error:', error);
    res.status(500).json({ message: 'Login verification failed' });
  }
});

module.exports = router;