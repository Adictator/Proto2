import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/Dashboard.css';

function PartnerDashboard() {
  const navigate = useNavigate();
  const [user] = useState(JSON.parse(localStorage.getItem('user')));
  const [token] = useState(localStorage.getItem('token'));
  const [balance, setBalance] = useState(0);
  const [pickups, setPickups] = useState([]);

  useEffect(() => {
    if (!token) navigate('/');
    fetchBalance();
    fetchAvailablePickups();
  }, [token, navigate]);

  const fetchBalance = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/pickups/balance', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await response.json();
      setBalance(data.balance);
    } catch (error) {
      console.error('Error fetching balance:', error);
    }
  };

  const fetchAvailablePickups = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/pickups/available', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await response.json();
      setPickups(data);
    } catch (error) {
      console.error('Error fetching pickups:', error);
    }
  };

  const handleAcceptPickup = async (pickupId) => {
    try {
      const response = await fetch(`http://localhost:5000/api/pickups/${pickupId}/accept`, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}` }
      });

      if (response.ok) {
        alert('✅ Pickup accepted! Upload proof to earn ₹50');
        fetchAvailablePickups();
      }
    } catch (error) {
      console.error('Error accepting pickup:', error);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/');
  };

  return (
    <div className="dashboard partner-dashboard">
      <header className="dashboard-header">
        <h1>💼 Partner Dashboard</h1>
        <div className="user-info">
          <span>Welcome, {user?.firstName}!</span>
          <button onClick={handleLogout} className="logout-btn">Logout</button>
        </div>
      </header>

      <div className="dashboard-content">
        <div className="sidebar">
          <div className="stats-card">
            <h3>Virtual Bank Balance</h3>
            <div className="balance-display">₹{balance}</div>
            <p>Available for withdrawal</p>
          </div>
        </div>

        <div className="main-content">
          <h2>📦 Available Paid Pickups (11 AM - 1 AM)</h2>
          <p className="earning-rate">Earn ₹50 per pickup</p>

          <div className="pickups-grid">
            {pickups.length > 0 ? (
              pickups.map(pickup => (
                <div key={pickup._id} className="pickup-card partner-pickup">
                  <div className="food-items">
                    {pickup.foodItems.map((item, idx) => (
                      <div key={idx} className="food-item">
                        <p><strong>{item.name}</strong> - {item.quantity}</p>
                      </div>
                    ))}
                  </div>
                  <div className="earning-badge">💰 ₹50</div>
                  <button 
                    className="accept-btn"
                    onClick={() => handleAcceptPickup(pickup._id)}
                  >
                    Accept & Deliver
                  </button>
                </div>
              ))
            ) : (
              <p className="no-data">No pickups available right now</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default PartnerDashboard;