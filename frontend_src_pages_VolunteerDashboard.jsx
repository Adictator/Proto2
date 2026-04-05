import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/Dashboard.css';

function VolunteerDashboard() {
  const navigate = useNavigate();
  const [user] = useState(JSON.parse(localStorage.getItem('user')));
  const [token] = useState(localStorage.getItem('token'));
  const [activeTab, setActiveTab] = useState('available');
  const [pickups, setPickups] = useState([]);
  const [balance, setBalance] = useState(0);
  const [selectedPickup, setSelectedPickup] = useState(null);
  const [showDeliveryForm, setShowDeliveryForm] = useState(false);

  useEffect(() => {
    if (!token) navigate('/');
    fetchAvailablePickups();
    fetchBalance();
  }, [token, navigate]);

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

  const handleAcceptPickup = async (pickupId) => {
    try {
      const response = await fetch(`http://localhost:5000/api/pickups/${pickupId}/accept`, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}` }
      });

      if (response.ok) {
        alert('✅ Pickup accepted!');
        fetchAvailablePickups();
      }
    } catch (error) {
      console.error('Error accepting pickup:', error);
    }
  };

  const handleUploadProof = async (pickupId, file) => {
    try {
      const formData = new FormData();
      formData.append('deliveryProof', file);

      const response = await fetch(`http://localhost:5000/api/pickups/${pickupId}/delivery-proof`, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}` },
        body: formData
      });

      const data = await response.json();

      if (response.ok) {
        alert(data.congratulations);
        setShowDeliveryForm(false);
        fetchBalance();
      } else {
        alert(data.message);
      }
    } catch (error) {
      console.error('Error uploading proof:', error);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/');
  };

  return (
    <div className="dashboard volunteer-dashboard">
      <header className="dashboard-header">
        <h1>🐾 Volunteer Dashboard</h1>
        <div className="user-info">
          <span>Welcome, {user?.firstName}!</span>
          <button onClick={handleLogout} className="logout-btn">Logout</button>
        </div>
      </header>

      <div className="dashboard-content">
        <div className="sidebar">
          <div className="stats-card">
            <h3>Your Points</h3>
            <div className="points-display">{balance}</div>
            <p>Pickups completed</p>
          </div>
        </div>

        <div className="main-content">
          <div className="tabs">
            <button 
              className={`tab ${activeTab === 'available' ? 'active' : ''}`}
              onClick={() => setActiveTab('available')}
            >
              Available Pickups
            </button>
            <button 
              className={`tab ${activeTab === 'history' ? 'active' : ''}`}
              onClick={() => setActiveTab('history')}
            >
              Delivery History
            </button>
          </div>

          {activeTab === 'available' && (
            <div className="pickups-grid">
              {pickups.length > 0 ? (
                pickups.map(pickup => (
                  <div key={pickup._id} className="pickup-card">
                    <div className="food-items">
                      <h3>Food Available</h3>
                      {pickup.foodItems.map((item, idx) => (
                        <div key={idx} className="food-item">
                          <p><strong>{item.name}</strong> - {item.quantity}</p>
                          <p className="suitable">Suitable for: {item.suitableFor.join(', ')}</p>
                        </div>
                      ))}
                    </div>
                    <div className="pickup-time">
                      <p><strong>Time:</strong> {pickup.timeSlot.start} - {pickup.timeSlot.end}</p>
                      <p><strong>Location:</strong> {pickup.pickupLocation.address}</p>
                    </div>
                    <button 
                      className="accept-btn"
                      onClick={() => handleAcceptPickup(pickup._id)}
                    >
                      Accept Pickup
                    </button>
                  </div>
                ))
              ) : (
                <p className="no-data">No available pickups at the moment</p>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default VolunteerDashboard;