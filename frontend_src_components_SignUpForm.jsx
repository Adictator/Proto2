import React, { useState } from 'react';
import '../styles/Forms.css';

function SignUpForm({ onSubmit, initialRole }) {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    firstName: '',
    lastName: '',
    phoneNumber: '',
    role: initialRole,
    restaurantName: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form className="auth-form signup-form" onSubmit={handleSubmit}>
      <h2>Create Account</h2>
      
      <select 
        name="role" 
        value={formData.role}
        onChange={handleChange}
        className="role-select"
      >
        <option value="volunteer">👤 Volunteer</option>
        <option value="restaurant">🍽️ Restaurant</option>
        <option value="partner">💼 Partner</option>
      </select>

      <input 
        type="email" 
        name="email" 
        placeholder="Email address" 
        value={formData.email}
        onChange={handleChange}
        required 
      />

      <input 
        type="password" 
        name="password" 
        placeholder="Password" 
        value={formData.password}
        onChange={handleChange}
        required 
      />

      <input 
        type="text" 
        name="firstName" 
        placeholder="First name" 
        value={formData.firstName}
        onChange={handleChange}
        required 
      />

      <input 
        type="text" 
        name="lastName" 
        placeholder="Last name" 
        value={formData.lastName}
        onChange={handleChange}
        required 
      />

      <input 
        type="tel" 
        name="phoneNumber" 
        placeholder="Phone number" 
        value={formData.phoneNumber}
        onChange={handleChange}
        required 
      />

      {formData.role === 'restaurant' && (
        <input 
          type="text" 
          name="restaurantName" 
          placeholder="Restaurant name" 
          value={formData.restaurantName}
          onChange={handleChange}
          required 
        />
      )}

      <button type="submit" className="btn-submit">Continue</button>
    </form>
  );
}

export default SignUpForm;