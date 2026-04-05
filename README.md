# 🐾 Restray - Food Rescue & Animal Care Platform

> Rescuing food. Saving lives. Building a sustainable future.

[![License: MIT](https://img.shields.io/badge/License-MIT-green.svg)](https://opensource.org/licenses/MIT)
[![Node.js](https://img.shields.io/badge/Node.js-18+-green)](https://nodejs.org/)
[![React](https://img.shields.io/badge/React-18+-blue)](https://reactjs.org/)
[![MongoDB](https://img.shields.io/badge/MongoDB-5.0+-brightgreen)](https://www.mongodb.com/)

## 📋 Features

### 🐾 Core Features
- ✅ **Email-based authentication** with 6-digit verification codes
- ✅ **Three user roles**: Volunteers, Restaurants, Partners
- ✅ **Food safety AI analyzer** - Identifies suitable animals for each food item
- ✅ **Image verification** - Prevents duplicate proof submissions using SHA-256 hashing
- ✅ **Location-based pickup** - Google Maps integration for restaurant and volunteer location management
- ✅ **Real-time notifications** - Email alerts for pickups and deliveries
- ✅ **Payment & Points system** - Partners earn ₹50/pickup, volunteers earn 10 points/pickup
- ✅ **Virtual bank balance** - Partners can track earnings
- ✅ **Transaction history** - Complete audit trail of all activities

### 👤 Volunteer Features
- Set preferred pickup locations
- Choose from 17 time slots (6:30 AM - 11:00 PM)
- Browse available food pickups by location
- Accept and deliver food to animals
- Upload delivery proof photos
- Earn points for each pickup
- View achievements and congratulatory messages
- Track total pickups completed

### 🍽️ Restaurant Features
- Post surplus food items with descriptions and quantities
- Upload photos of food
- AI analyzes which animals can safely eat the food
- Get suggested pickup locations via Google Maps
- Choose time slots for pickup
- Real-time notifications when volunteers accept
- Track donation impact
- View which volunteers completed deliveries

### 💼 Partner Features
- Access extended time slots (11 AM - 1 AM)
- Earn ₹50 per food delivery pickup
- Virtual bank balance to track earnings
- Upload delivery proof to receive payment
- AI duplicate detection prevents re-submitting same photo
- View complete earnings history
- Track regularity bonus potential (future feature)

## 🛠️ Tech Stack

### Backend
- **Framework**: Express.js
- **Database**: MongoDB
- **Authentication**: JWT + Email OTP
- **Image Processing**: SHA-256 hashing for duplicate detection
- **Email**: Nodemailer (Gmail)
- **File Upload**: Multer

### Frontend
- **Framework**: React 18
- **Routing**: React Router v6
- **Styling**: CSS3 with CSS Grid & Flexbox
- **State Management**: React Hooks
- **API Communication**: Fetch API

### AI/Algorithms
- **Food Safety Analyzer**: Rule-based system with 15+ food-animal mappings
- **Image Verification**: SHA-256 cryptographic hashing
- **Location Services**: Geospatial queries with MongoDB GeoJSON

## 📦 Installation

### Prerequisites
- Node.js 18+
- MongoDB 5.0+
- Gmail account with App Password
- Google Maps API key

### Backend Setup

```bash
# Clone repository
git clone https://github.com/Adictator/Restray.git
cd Restray/backend

# Install dependencies
npm install

# Create .env file
cp .env.example .env

# Add your credentials to .env:
# MONGODB_URI=mongodb://localhost:27017/restray
# JWT_SECRET=your-secret-key
# EMAIL_USER=your-gmail@gmail.com
# EMAIL_PASSWORD=your-app-password
# GOOGLE_MAPS_API_KEY=your-api-key

# Start server
npm run dev