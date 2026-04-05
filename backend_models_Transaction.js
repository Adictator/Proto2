const mongoose = require('mongoose');

const transactionSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  pickupId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Pickup',
    required: true
  },
  type: {
    type: String,
    enum: ['payment', 'points'],
    required: true
  },
  amount: Number, // For payments (₹)
  pointsEarned: Number, // For volunteers
  status: {
    type: String,
    enum: ['pending', 'completed', 'failed'],
    default: 'pending'
  },
  description: String,
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Transaction', transactionSchema);