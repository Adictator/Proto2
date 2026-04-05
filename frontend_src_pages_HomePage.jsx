import React from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/HomePage.css';

function HomePage() {
  const navigate = useNavigate();

  return (
    <div className="home-page">
      <div className="hero-section">
        <div className="logo">
          <h1>🐾 RESTRAY</h1>
          <p>Rescuing Food. Saving Lives.</p>
        </div>
        
        <div className="description">
          <p>Join our mission to reduce food waste and feed animals in need</p>
        </div>
      </div>

      <div className="main-options">
        {/* Volunteer Card */}
        <div className="option-card volunteer">
          <div className="card-header">
            <h2>👤 Volunteer</h2>
            <p className="card-subtitle">Help rescue and deliver food to animals</p>
          </div>
          
          <ul className="features">
            <li>✅ Set your preferred pickup location</li>
            <li>✅ Choose convenient time slots</li>
            <li>✅ Earn points for every pickup</li>
            <li>✅ Upload proof of delivery</li>
            <li>✅ Track your impact</li>
          </ul>

          <div className="button-group">
            <button onClick={() => navigate('/signup?role=volunteer')} className="btn-primary">
              Sign Up
            </button>
            <button onClick={() => navigate('/login?role=volunteer')} className="btn-secondary">
              Log In
            </button>
          </div>
        </div>

        {/* Restaurant Card */}
        <div className="option-card restaurant">
          <div className="card-header">
            <h2>🍽️ Restaurant</h2>
            <p className="card-subtitle">Donate surplus food to help animals</p>
          </div>
          
          <ul className="features">
            <li>✅ Post available food items</li>
            <li>✅ AI analysis of food safety</li>
            <li>✅ Smart location suggestions</li>
            <li>✅ Real-time pickup notifications</li>
            <li>✅ Track donation impact</li>
          </ul>

          <div className="button-group">
            <button onClick={() => navigate('/signup?role=restaurant')} className="btn-primary">
              Sign Up
            </button>
            <button onClick={() => navigate('/login?role=restaurant')} className="btn-secondary">
              Log In
            </button>
          </div>
        </div>

        {/* Partner Card */}
        <div className="option-card partner">
          <div className="card-header">
            <h2>💼 Partner</h2>
            <p className="card-subtitle">Earn money delivering food to animals</p>
          </div>
          
          <ul className="features">
            <li>✅ Extended time slots (11 AM - 1 AM)</li>
            <li>✅ Earn ₹50 per pickup</li>
            <li>✅ Virtual bank balance tracking</li>
            <li>✅ Upload delivery proof for payment</li>
            <li>✅ View earnings history</li>
          </ul>

          <div className="button-group">
            <button onClick={() => navigate('/signup?role=partner')} className="btn-primary">
              Sign Up
            </button>
            <button onClick={() => navigate('/login?role=partner')} className="btn-secondary">
              Log In
            </button>
          </div>
        </div>
      </div>

      <div className="animal-silhouettes">
        <span>🦌</span>
        <span>🐰</span>
        <span>🐐</span>
        <span>🦅</span>
        <span>🦝</span>
      </div>
    </div>
  );
}

export default HomePage;