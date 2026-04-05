const mongoose = require('mongoose');

const pickupSchema = new mongoose.Schema({
  restaurantId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  foodItems: [
    {
      name: String,
      quantity: String,
      description: String,
      suitableFor: [String], // ['rabbits', 'horses', 'deer', ...]
      isUnsafe: Boolean
    }
  ],
  foodImageUrl: String,
  
  pickupLocation: {
    type: {
      type: String,
      enum: ['Point'],
      default: 'Point'
    },
    coordinates: [Number], // [longitude, latitude]
    address: String
  },
  
  timeSlot: {
    start: String, // '6:30'
    end: String // '7:00'
  },
  
  status: {
    type: String,
    enum: ['available', 'accepted', 'completed', 'cancelled'],
    default: 'available'
  },
  
  assignedVolunteer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  
  deliveryProof: {
    imageUrl: String,
    imageHash: String,
    uploadedAt: Date,
    verifiedBy: String // 'volunteer' or 'partner'
  },
  
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

pickupSchema.index({ 'pickupLocation': '2dsphere' });

module.exports = mongoose.model('Pickup', pickupSchema);