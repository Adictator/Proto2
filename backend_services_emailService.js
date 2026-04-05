const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD
  }
});

const sendVerificationEmail = async (email, code, type = 'signup') => {
  const subject = type === 'signup' 
    ? '🐾 Restray - Verify Your Email' 
    : '🐾 Restray - Login Verification Code';
    
  const message = type === 'signup'
    ? `Welcome to Restray! Your verification code is: <strong>${code}</strong>`
    : `Your Restray login verification code is: <strong>${code}</strong>`;

  const htmlContent = `
    <div style="font-family: Arial, sans-serif; background: linear-gradient(135deg, #2d5016 0%, #4a7c2c 100%); padding: 20px; border-radius: 10px; color: white;">
      <h2>🐾 Restray</h2>
      <p>${message}</p>
      <p style="color: #ffeb3b; font-weight: bold;">Code expires in 10 minutes</p>
      <p>If you didn't request this code, please ignore this email.</p>
    </div>
  `;

  try {
    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: email,
      subject,
      html: htmlContent
    });
    console.log(`✅ Email sent to ${email}`);
  } catch (error) {
    console.error('❌ Email error:', error);
    throw new Error('Failed to send verification email');
  }
};

module.exports = { sendVerificationEmail };