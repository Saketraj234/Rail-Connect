const User = require('../models/User');
const jwt = require('jsonwebtoken');

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET || 'secret123', {
    expiresIn: '30d',
  });
};

const registerUser = async (req, res) => {
  console.log('--- NEW REGISTRATION REQUEST ---');
  console.log('Request Body:', JSON.stringify(req.body, null, 2));
  
  const { rail_id, name, email, password, mobile } = req.body;

  if (!rail_id || rail_id.trim() === '') {
    console.log('Validation failed: rail_id is empty or null');
    return res.status(400).json({ message: 'User ID is required' });
  }

  if (!email || email.trim() === '') {
    console.log('Validation failed: email is empty or null');
    return res.status(400).json({ message: 'Email is required' });
  }

  try {
    const userExists = await User.findOne({ $or: [{ email }, { rail_id }] });

    if (userExists) {
      console.log('User already exists:', { 
        emailMatch: userExists.email === email, 
        idMatch: userExists.rail_id === rail_id 
      });
      return res.status(400).json({ message: 'User with this ID or Email already exists' });
    }

    console.log('Creating new user in DB...');
    const user = await User.create({
      rail_id,
      name,
      email,
      password,
      mobile,
      isVerified: true, 
    });

    if (user) {
      console.log('User created successfully:', user.rail_id);
      console.log('Hashed password in DB:', user.password.substring(0, 10) + '...');
      res.status(201).json({
        _id: user._id,
        rail_id: user.rail_id,
        name: user.name,
        email: user.email,
        mobile: user.mobile,
        token: generateToken(user._id),
      });
    } else {
      res.status(400).json({ message: 'Invalid user data' });
    }
  } catch (error) {
    console.error('Registration Error:', error.message);
    if (error.code === 11000) {
      const field = Object.keys(error.keyPattern)[0];
      res.status(400).json({ message: `Duplicate ${field} detected. Please ensure your ${field} is unique.` });
    } else {
      res.status(500).json({ message: error.message });
    }
  }
};

const loginUser = async (req, res) => {
  const { rail_id, password } = req.body;
  console.log('--- LOGIN ATTEMPT ---');
  console.log('User ID:', rail_id);

  try {
    // Login with rail_id as requested
    const user = await User.findOne({ rail_id });

    if (!user) {
      console.log('Login failed: User not found with ID:', rail_id);
      return res.status(401).json({ message: 'Invalid User ID or Password' });
    }

    const isMatch = await user.matchPassword(password);
    console.log('Password Match Result:', isMatch);

    if (isMatch) {
      console.log('Login successful for:', rail_id);
      res.json({
        _id: user._id,
        rail_id: user.rail_id,
        name: user.name,
        email: user.email,
        mobile: user.mobile,
        profilePhoto: user.profilePhoto,
        address: user.address,
        token: generateToken(user._id),
      });
    } else {
      console.log('Login failed: Incorrect password for:', rail_id);
      res.status(401).json({ message: 'Invalid User ID or Password' });
    }
  } catch (error) {
    console.error('Login Error:', error.message);
    res.status(500).json({ message: error.message });
  }
};

const updateUserProfile = async (req, res) => {
  console.log('--- PROFILE UPDATE ATTEMPT ---');
  console.log('User ID from token:', req.user.id);
  try {
    const user = await User.findById(req.user.id);

    if (user) {
      console.log('User found in DB:', user.rail_id);
      user.name = req.body.name || user.name;
      user.email = req.body.email || user.email;
      user.mobile = req.body.mobile || user.mobile;
      user.address = req.body.address || user.address;
      
      // Handle large profile photo data (Base64)
      if (req.body.profilePhoto) {
        console.log('Photo data detected, length:', req.body.profilePhoto.length);
        user.profilePhoto = req.body.profilePhoto;
      }

      const updatedUser = await user.save();
      console.log('User saved successfully');

      res.json({
        _id: updatedUser._id,
        rail_id: updatedUser.rail_id,
        name: updatedUser.name,
        email: updatedUser.email,
        mobile: updatedUser.mobile,
        profilePhoto: updatedUser.profilePhoto,
        address: updatedUser.address,
        token: generateToken(updatedUser._id),
      });
    } else {
      console.log('User not found with ID:', req.user.id);
      res.status(404).json({ message: 'User not found' });
    }
  } catch (error) {
    console.error('Profile Update Error:', error.message);
    res.status(500).json({ message: error.message });
  }
};

const changePassword = async (req, res) => {
  const { currentPassword, newPassword } = req.body;
  try {
    const user = await User.findById(req.user.id);
    if (user && (await user.matchPassword(currentPassword))) {
      user.password = newPassword;
      await user.save();
      res.json({ message: 'Password changed successfully' });
    } else {
      res.status(401).json({ message: 'Invalid current password' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { registerUser, loginUser, updateUserProfile, changePassword };
