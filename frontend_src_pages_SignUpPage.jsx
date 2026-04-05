import React, { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import SignUpForm from '../components/SignUpForm';
import VerificationForm from '../components/VerificationForm';
import '../styles/AuthPage.css';

function SignUpPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [step, setStep] = useState('form'); // 'form' or 'verification'
  const [email, setEmail] = useState('');
  const [role, setRole] = useState(searchParams.get('role') || 'volunteer');
  const [formData, setFormData] = useState(null);

  const handleSignUpSubmit = async (data) => {
    try {
      setEmail(data.email);
      setRole(data.role);
      setFormData(data);
      
      const response = await fetch('http://localhost:5000/api/auth/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: data.email, role: data.role })
      });

      if (response.ok) {
        setStep('verification');
      } else {
        alert('Failed to send verification code');
      }
    } catch (error) {
      console.error('Signup error:', error);
      alert('Error during signup');
    }
  };

  const handleVerificationSubmit = async (code) => {
    try {
      const response = await fetch('http://localhost:5000/api/auth/verify-code', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email,
          code,
          ...formData
        })
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
          <SignUpForm onSubmit={handleSignUpSubmit} initialRole={role} />
        ) : (
          <VerificationForm 
            email={email} 
            onSubmit={handleVerificationSubmit}
            type="signup"
          />
        )}
      </div>
    </div>
  );
}

export default SignUpPage;