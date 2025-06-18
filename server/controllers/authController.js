import User from '../models/User.js';
import bcrypt from 'bcryptjs';
import nodemailer from 'nodemailer';
import generateToken from '../utils/generateToken.js';

export const completeSignup = async (req, res) => {
  const { email, name, password } = req.body;

  if (!email || !name || !password) {
    return res.status(400).json({ message: 'All fields are required' });
  }

  try {
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(400).json({ message: 'User does not exist' });
    }

    if (!user.isVerified) {
      return res.status(400).json({ message: 'User not verified yet' });
    }

    // Check if user already completed signup
    if (user.password && user.password !== 'temp') {
      return res.status(400).json({ message: 'User already completed signup' });
    }

    // Update name and securely hash password
    user.name = name;
    user.password = await bcrypt.hash(password, 10);

    await user.save();

    const token = generateToken(user._id);

    res.status(200).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      token,
    });
  } catch (err) {
    res.status(500).json({ message: 'Error completing signup', error: err.message });
  }
};


export const loginUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });

    if (!user) return res.status(400).json({ message: 'User not found' });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: 'Invalid credentials' });

    const token = generateToken(user._id);

    res.status(200).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      token,
    });
  } catch (err) {
    res.status(500).json({ message: 'Login failed', error: err.message });
  }
};

export const sendOtp = async (req, res) => {
  const { email } = req.body;
  const otp = Math.floor(100000 + Math.random() * 900000).toString();

  try {
    // Check if a verified user already exists
    const user = await User.findOne({ email });
    if (user?.isVerified) {
      return res.status(400).json({ message: 'User already exists' });
    }

    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_FROM,
        pass: process.env.EMAIL_PASS,
      },
    });

    await transporter.sendMail({
      from: process.env.EMAIL_FROM,
      to: email,
      subject: 'Verify your email',
      html: `<p>Your OTP is <b>${otp}</b>. It is valid for 10 minutes.</p>`,
    });

    // Either update or create the user entry
    const userExists = await User.findOne({ email });

    if (userExists) {
      userExists.otp = otp;
      userExists.otpExpiresAt = Date.now() + 10 * 60 * 1000;
      await userExists.save();
    } else {
      await User.create({
        email,
        otp,
        otpExpiresAt: Date.now() + 10 * 60 * 1000,
        password: 'temp', // add dummy password to pass validation
        name: 'temp',
        isVerified: false,
      });
    }

    res.status(200).json({ message: 'OTP sent to email' });
  } catch (err) {
    res.status(500).json({ message: 'Error sending OTP', error: err.message });
  }
};



export const verifyOtp = async (req, res) => {
  const { email, otp } = req.body;

  if (!email || !otp) {
    return res.status(400).json({ message: 'Email and OTP are required' });
  }

  try {
    const user = await User.findOne({ email });

    if (!user || !user.otp) {
      return res.status(404).json({ message: 'OTP not found. Please request a new one.' });
    }

    // Check if OTP expired
    if (user.otpExpiresAt < new Date()) {
      return res.status(400).json({ message: 'OTP has expired. Please request a new one.' });
    }

    // Check if OTP matches
    if (user.otp !== otp) {
      return res.status(401).json({ message: 'Invalid OTP' });
    }

    // OTP is correct — mark user as verified
    user.isVerified = true;
    user.otp = undefined;
    user.otpExpiresAt = undefined;

    await user.save();

    res.status(200).json({ message: 'OTP verified successfully, you can now complete signup/login.' });
  } catch (err) {
    console.error('Error verifying OTP:', err);
    res.status(500).json({ message: 'Server error during OTP verification' });
  }
};

// Logout user
export const logout = (req, res) => {
  req.logout(() => {
    res.status(200).json({ message: 'Logged out successfully' });
  });
};

// Update password
export const updatePassword = async (req, res) => {
  const { currentPassword, newPassword } = req.body;
  const user = await User.findById(req.user._id);

  if (!user) return res.status(404).json({ message: 'User not found' });

  const isMatch = await bcrypt.compare(currentPassword, user.password);
  if (!isMatch) return res.status(401).json({ message: 'Incorrect current password' });

  user.password = await bcrypt.hash(newPassword, 10);
  await user.save();

  res.status(200).json({ message: 'Password updated successfully' });
};

// Delete account
export const deleteAccount = async (req, res) => {
  const user = await User.findByIdAndDelete(req.user._id);
  if (!user) return res.status(404).json({ message: 'User not found' });

  res.status(200).json({ message: 'Account deleted successfully' });
};

// Check auth
export const checkAuth = (req, res) => {
  res.status(200).json({ message: 'Authenticated', user: req.user });
};
