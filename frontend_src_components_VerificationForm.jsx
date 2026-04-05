import React, { useState, useEffect } from 'react';
import '../styles/Forms.css';

function VerificationForm({ email, onSubmit, type }) {
  const [code, setCode] = useState('');
  const [timeLeft, setTimeLeft] = useState(600); // 10 minutes

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(prev => prev > 0 ? prev - 1 : 0);
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(code);
  };

  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;

  return (
    <form className="auth-form verification-form" onSubmit={handleSubmit}>
      <h2>Verify Your Email</h2>
      <p>A 6-digit code has been sent to:</p>
      <p className="email-display">{email}</p>

      <input 
        type="text" 
        placeholder="Enter 6-digit code" 
        maxLength="6"
        value={code}
        onChange={(e) => setCode(e.target.value.replace(/[^0-9]/g, ''))}
        required 
      />

      <div className="timer">
        Code expires in: {minutes}:{seconds.toString().padStart(2, '0')}
      </div>

      <button type="submit" className="btn-submit">Verify</button>
    </form>
  );
}

export default VerificationForm;