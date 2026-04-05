import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import LoginForm from '../components/LoginForm';
import VerificationForm from '../components/VerificationForm';
import '../styles/AuthPage.css';

function LoginPage() {
  const navigate = useNavigate();
  const [step, setStep] = useState('form'); // 'form' or 'verification'
  const [email, setEmail] = useState('');

  const handleLoginSubmit = async (data) => {
    try {
      const response = await fetch('http://localhost:5000/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });

      if (response.ok) {
        setEmail(data.email);
        setStep('verification');
      } else {
        alert('Invalid email or password');
      }
    } catch (error) {
      console.error('Login error:', error);
      alert('Login failed');
    }
  };

  const handleVerificationSubmit = async (code) => {
    try {
      const response = await fetch('http://localhost:5000/api/auth/verify-login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, code })
      });

      const data = await response.json();

      if (response.ok) {
        localStorage.setItem('token', data.token);
        localStorage.setItem('user', JSON.stringify(data.user));
        
        // Navigate to appropriate dashboard
        if (data.user.role === 'volunteer') {
          navigate('/volunteer-dashboard');
        } else if (data.user.role === 'restaurant') {
          navigate('/restaurant-dashboard');
        } else if (data.user.role === 'partner') {
          navigate('/partner-dashboard');
        }
      } else {
        alert(data.message || 'Verification failed');
      }
    } catch (error) {
      console.error('Verification error:', error);
      alert('Verification failed');
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-container">
        <button onClick={() => navigate('/')} className="back-button">← Back</button>
        
        {step === 'form' ? (
          <LoginForm onSubmit={handleLoginSubmit} />
        ) : (
          <VerificationForm 
            email={email} 
            onSubmit={handleVerificationSubmit}
            type="login"
          />
        )}
      </div>
    </div>
  );
}

export default LoginPage;