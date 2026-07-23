const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { z } = require('zod');
const db = require('../config/db');
const config = require('../config/env');

const registerSchema = z.object({
  body: z.object({
    full_name: z.string().min(2, 'Name must be at least 2 characters'),
    email: z.string().email('Invalid email address'),
    phone: z.string().optional(),
    password: z.string().min(6, 'Password must be at least 6 characters'),
    role: z.enum(['customer', 'dresser', 'salon_owner', 'admin']).optional().default('customer'),
  }),
});

const loginSchema = z.object({
  body: z.object({
    email: z.string().email('Invalid email address'),
    password: z.string().min(1, 'Password is required'),
  }),
});

const register = async (req, res) => {
  const { full_name, email, phone, password, role } = req.body;

  const existingUser = await db('users').where({ email }).first();
  if (existingUser) {
    return res.status(400).json({ error: 'Email is already registered' });
  }

  const salt = await bcrypt.genSalt(10);
  const password_hash = await bcrypt.hash(password, salt);

  const [user] = await db('users')
    .insert({
      full_name,
      email,
      phone,
      password_hash,
      role: role || 'customer',
    })
    .returning(['id', 'full_name', 'email', 'phone', 'role', 'avatar_url', 'created_at']);

  const token = jwt.sign(
    { userId: user.id, role: user.role },
    config.jwt.secret,
    { expiresIn: config.jwt.expiresIn }
  );

  return res.status(201).json({
    message: 'User registered successfully',
    token,
    user,
  });
};

const login = async (req, res) => {
  const { email, password } = req.body;

  const user = await db('users').where({ email }).first();
  if (!user) {
    return res.status(401).json({ error: 'Invalid email or password' });
  }

  const isMatch = await bcrypt.compare(password, user.password_hash);
  if (!isMatch) {
    return res.status(401).json({ error: 'Invalid email or password' });
  }

  const token = jwt.sign(
    { userId: user.id, role: user.role },
    config.jwt.secret,
    { expiresIn: config.jwt.expiresIn }
  );

  const { password_hash, ...userProfile } = user;

  return res.json({
    message: 'Login successful',
    token,
    user: userProfile,
  });
};

const getMe = async (req, res) => {
  return res.json({ user: req.user });
};

module.exports = {
  register,
  login,
  getMe,
  registerSchema,
  loginSchema,
};
