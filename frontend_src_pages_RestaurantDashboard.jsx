import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import FoodPickupForm from '../components/FoodPickupForm';
import '../styles/Dashboard.css';

function RestaurantDashboard() {
  const navigate = useNavigate();
  const [user] = useState(JSON.parse(localStorage.getItem('user')));
  const [token] = useState(localStorage.getItem('token'));
  const [showForm, setShowForm] = useState(false);
  const [pickups, setPickups] = useState([]);

  useEffect(() => {
    if (!token) navigate('/');
  }, [token, navigate]);

  const handleCreatePickup = async (formData) => {
    try {
      const response = await fetch('http://localhost:5000/api/pickups', {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}` },
        body: formData
      });

      if (response.ok) {
        alert('✅ Pickup request created!');
        setShowForm(false);
      }
    } catch (error) {
      console.error('Error creating pickup:', error);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/');
  };

  return (
    <div className="dashboard restaurant-dashboard">
      <header className="dashboard-header">
        <h1>🍽️ Restaurant Dashboard</h1>
        <div className="user-info">
          <span>Welcome, {user?.firstName}!</span>
          <button onClick={handleLogout} className="logout-btn">Logout</button>
        </div>
      </header>

      <div className="dashboard-content">
        <button 
          className="create-btn"
          onClick={() => setShowForm(!showForm)}
        >
          {showForm ? 'Cancel' : '+ Create Food Pickup'}
        </button>

        {showForm && <FoodPickupForm onSubmit={handleCreatePickup} />}
      </div>
    </div>
  );
}

export default RestaurantDashboard;