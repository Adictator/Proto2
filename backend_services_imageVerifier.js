const crypto = require('crypto');
const fs = require('fs');
const Image = require('../models/Image');

// Generate SHA-256 hash of image file to detect duplicates
const generateImageHash = (filePath) => {
  return new Promise((resolve, reject) => {
    const hash = crypto.createHash('sha256');
    const stream = fs.createReadStream(filePath);
    
    stream.on('data', chunk => hash.update(chunk));
    stream.on('end', () => resolve(hash.digest('hex')));
    stream.on('error', reject);
  });
};

const verifyImageNotDuplicate = async (filePath, userId) => {
  try {
    const imageHash = await generateImageHash(filePath);
    
    // Check if hash already exists in database
    const existingImage = await Image.findOne({ imageHash });
    
    if (existingImage) {
      fs.unlinkSync(filePath); // Delete the uploaded file
      return {
        isDuplicate: true,
        message: 'This image has already been submitted. No duplicate submissions allowed.'
      };
    }
    
    return {
      isDuplicate: false,
      imageHash,
      message: 'Image verified - unique and valid'
    };
  } catch (error) {
    console.error('Image verification error:', error);
    throw error;
  }
};

const saveImageRecord = async (userId, pickupId, imageHash, imageUrl) => {
  const image = new Image({
    userId,
    pickupId,
    imageHash,
    imageUrl
  });
  return await image.save();
};

module.exports = {
  generateImageHash,
  verifyImageNotDuplicate,
  saveImageRecord
};