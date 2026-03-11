// passwordResetController.js
const User = require('../models/User');
const crypto = require('crypto');
const nodemailer = require('nodemailer');

// Setup nodemailer (use your SMTP config)
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

// Request password reset
exports.requestReset = async (req, res) => {
  const { email } = req.body;
  const user = await User.findOne({ email });
  if (!user) return res.status(404).json({ error: 'User not found' });
  const token = crypto.randomBytes(32).toString('hex');
  user.resetToken = token;
  user.resetTokenExpiry = Date.now() + 3600 * 1000; // 1 hour
  await user.save();
  const resetUrl = `${process.env.FRONTEND_URL}/reset-password?token=${token}`;
  await transporter.sendMail({
    to: email,
    subject: 'Password Reset',
    html: `<p>Reset your password: <a href="${resetUrl}">Reset Link</a></p>`
  });
  res.json({ message: 'Reset email sent' });
};

// Reset password
exports.resetPassword = async (req, res) => {
  const { token, password } = req.body;
  const user = await User.findOne({ resetToken: token, resetTokenExpiry: { $gt: Date.now() } });
  if (!user) return res.status(400).json({ error: 'Invalid or expired token' });
  user.password = password; // hash in real app
  user.resetToken = undefined;
  user.resetTokenExpiry = undefined;
  await user.save();
  res.json({ message: 'Password reset successful' });
};

// Add email
exports.addEmail = async (req, res) => {
  const { userId, email } = req.body;
  const user = await User.findById(userId);
  if (!user) return res.status(404).json({ error: 'User not found' });
  user.email = email;
  await user.save();
  res.json({ message: 'Email added' });
};
