const mongoose = require('mongoose');

const imageSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  pickupId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Pickup'
  },
  imageHash: {
    type: String,
    required: true,
    unique: true
  },
  imageUrl: String,
  uploadedAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Image', imageSchema);