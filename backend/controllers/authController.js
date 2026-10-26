const jwt = require('jsonwebtoken');
const User = require('../models/User');
const { initialUsers } = require('../seed/seedData');
const { getDBStatus } = require('../config/db');

// Exact 6 Active Portal Users matching the 6 Login Presets
const realPortalUsers = [
  {
    userId: 'USR001',
    username: 'superadmin',
    email: 'superadmin@zenschool.com',
    password: 'SuperAdmin@123',
    name: 'Super Administrator',
    role: 'superadmin',
    schoolId: 'ALL',
    schoolName: 'Zenith Central Trust',
    status: 'Active',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80',
  },
  {
    userId: 'USR002',
    username: 'admin_ssv',
    email: 'admin@ssvschool.com',
    password: 'admin123',
    name: 'School Administrator',
    role: 'schooladmin',
    schoolId: 'SCHOOL002',
    schoolName: 'Sri Sankara Vidhyasala Girls High School',
    status: 'Active',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80',
  },
  {
    userId: 'USR003',
    username: 'principal',
    email: 'principal@ssvschool.com',
    password: 'principal123',
    name: 'Dr. Savithri Raman',
    role: 'principal',
    schoolId: 'SCHOOL002',
    schoolName: 'Sri Sankara Vidhyasala Girls High School',
    status: 'Active',
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=150&q=80',
  },
  {
    userId: 'USR004',
    username: 'teacher',
    email: 'teacher@ssvschool.com',
    password: 'teacher123',
    name: 'Mrs. Priya Krishnan',
    role: 'teacher',
    schoolId: 'SCHOOL002',
    schoolName: 'Sri Sankara Vidhyasala Girls High School',
    status: 'Active',
    avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=150&q=80',
  },
  {
    userId: 'USR006',
    username: 'student',
    email: 'student@ssvschool.com',
    password: 'student123',
    name: 'Aishwarya Kumar',
    role: 'student',
    schoolId: 'SCHOOL002',
    schoolName: 'Sri Sankara Vidhyasala Girls High School',
    status: 'Active',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=150&q=80',
  },
  {
    userId: 'USR008',
    username: 'parent',
    email: 'parent@ssvschool.com',
    password: 'parent123',
    name: 'Ramesh Kumar',
    role: 'parent',
    schoolId: 'SCHOOL002',
    schoolName: 'Sri Sankara Vidhyasala Girls High School',
    status: 'Active',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=150&q=80',
  },
];

// In-memory store for fallback if DB is disconnected
let memUsers = [...realPortalUsers];

const generateToken = (user) => {
  return jwt.sign(
    {
      id: user.userId || user._id,
      username: user.username,
      name: user.name,
      role: user.role,
      schoolId: user.schoolId,
      schoolName: user.schoolName,
    },
    process.env.JWT_SECRET || 'zenschool_jwt_super_secret_key_2026_zen_education',
    { expiresIn: '7d' }
  );
};

const login = async (req, res) => {
  try {
    const { username, password } = req.body;
    if (!username || !password) {
      return res.status(400).json({ success: false, message: 'Please provide username and password' });
    }

    const query = username.trim().toLowerCase();
    let foundUser = null;

    if (getDBStatus()) {
      foundUser = await User.findOne({
        $or: [
          { username: query },
          { email: query },
        ],
      });
    }

    // Fallback to memUsers if not found in DB or DB disconnected
    if (!foundUser) {
      foundUser = memUsers.find(
        (u) =>
          u.username.toLowerCase() === query ||
          (u.email && u.email.toLowerCase() === query) ||
          (u.email && u.email.split('@')[0].toLowerCase() === query)
      );
    }

    if (!foundUser) {
      return res.status(401).json({ success: false, message: 'Invalid username/email or password.' });
    }

    // Verify password
    if (foundUser.password !== password) {
      return res.status(401).json({ success: false, message: 'Invalid username/email or password.' });
    }

    const token = generateToken(foundUser);
    const userSafe = {
      userId: foundUser.userId || foundUser._id,
      username: foundUser.username,
      name: foundUser.name,
      email: foundUser.email,
      phone: foundUser.phone || '',
      role: foundUser.role,
      schoolId: foundUser.schoolId,
      schoolName: foundUser.schoolName,
      status: foundUser.status,
      avatar: foundUser.avatar,
    };

    return res.json({
      success: true,
      message: 'Login successful',
      token,
      user: userSafe,
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

const getMe = async (req, res) => {
  try {
    return res.json({ success: true, user: req.user });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

const getDemoAccounts = async (req, res) => {
  try {
    const accounts = memUsers.map((u) => ({
      userId: u.userId,
      username: u.username,
      email: u.email,
      name: u.name,
      role: u.role,
      schoolName: u.schoolName,
      passwordHint: u.password,
    }));
    return res.json({ success: true, demoAccounts: accounts });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = { login, getMe, getDemoAccounts, memUsers };
