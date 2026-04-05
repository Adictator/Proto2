require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');
const multer = require('multer');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'uploads')));

// Multer configuration for image uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, 'uploads'));
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  }
});

const upload = multer({ storage });

// Database Connection
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/restray')
  .then(() => console.log('✅ MongoDB Connected'))
  .catch(err => console.log('❌ MongoDB Error:', err));

// Import Routes
const authRoutes = require('./routes/authRoutes');
const pickupRoutes = require('./routes/pickupRoutes');

// Use Routes
app.use('/api/auth', authRoutes);
app.use('/api/pickups', pickupRoutes);

// Health Check
app.get('/api/health', (req, res) => {
  res.json({ status: 'Restray API Running ✅' });
});

// Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Restray Server running on http://localhost:${PORT}`);
});

module.exports = { app, upload };