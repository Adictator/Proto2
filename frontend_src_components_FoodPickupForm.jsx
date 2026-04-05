import React, { useState } from 'react';
import '../styles/Forms.css';

function FoodPickupForm({ onSubmit }) {
  const [foodItems, setFoodItems] = useState([{ name: '', quantity: '', description: '' }]);
  const [pickupLocation, setPickupLocation] = useState({
    coordinates: [0, 0],
    address: ''
  });
  const [timeSlot, setTimeSlot] = useState({ start: '6:30', end: '7:00' });
  const [foodImage, setFoodImage] = useState(null);

  const timeSlots = [
    { start: '6:30', end: '7:00' },
    { start: '7:00', end: '7:30' },
    { start: '11:00', end: '11:30' },
    { start: '11:30', end: '12:00' },
    { start: '12:00', end: '12:30' },
    { start: '5:00', end: '5:30' },
    { start: '5:30', end: '6:00' },
    { start: '6:00', end: '6:30' },
    { start: '7:00', end: '7:30' }
  ];

  const handleFoodItemChange = (index, field, value) => {
    const newItems = [...foodItems];
    newItems[index][field] = value;
    setFoodItems(newItems);
  };

  const addFoodItem = () => {
    setFoodItems([...foodItems, { name: '', quantity: '', description: '' }]);
  };

  const handleLocationChange = (e) => {
    setPickupLocation({
      ...pickupLocation,
      address: e.target.value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append('foodItems', JSON.stringify(foodItems));
    formData.append('pickupLocation', JSON.stringify(pickupLocation));
    formData.append('timeSlot', JSON.stringify(timeSlot));
    if (foodImage) {
      formData.append('foodImage', foodImage);
    }

    onSubmit(formData);
  };

  return (
    <form className="food-pickup-form" onSubmit={handleSubmit}>
      <h3>📦 Post Food for Pickup</h3>

      <div className="form-section">
        <h4>Food Items</h4>
        {foodItems.map((item, index) => (
          <div key={index} className="food-item-input">
            <input 
              type="text" 
              placeholder="Food name (e.g., Vegetables)"
              value={item.name}
              onChange={(e) => handleFoodItemChange(index, 'name', e.target.value)}
              required
            />
            <input 
              type="text" 
              placeholder="Quantity (e.g., 10kg)"
              value={item.quantity}
              onChange={(e) => handleFoodItemChange(index, 'quantity', e.target.value)}
              required
            />
            <textarea 
              placeholder="Description"
              value={item.description}
              onChange={(e) => handleFoodItemChange(index, 'description', e.target.value)}
            />
          </div>
        ))}
        <button type="button" onClick={addFoodItem} className="btn-secondary">+ Add Another Item</button>
      </div>

      <div className="form-section">
        <h4>Pickup Location</h4>
        <input 
          type="text" 
          placeholder="Enter address (AI will suggest locations)"
          value={pickupLocation.address}
          onChange={handleLocationChange}
          required
        />
      </div>

      <div className="form-section">
        <h4>Preferred Time Slot</h4>
        <select 
          value={`${timeSlot.start}-${timeSlot.end}`}
          onChange={(e) => {
            const [start, end] = e.target.value.split('-');
            setTimeSlot({ start, end });
          }}
        >
          {timeSlots.map((slot, idx) => (
            <option key={idx} value={`${slot.start}-${slot.end}`}>
              {slot.start} - {slot.end}
            </option>
          ))}
        </select>
      </div>

      <div className="form-section">
        <h4>Upload Food Photo</h4>
        <input 
          type="file" 
          accept="image/*"
          onChange={(e) => setFoodImage(e.target.files[0])}
        />
      </div>

      <button type="submit" className="btn-primary">Post Food for Pickup</button>
    </form>
  );
}

export default FoodPickupForm;