import User from '../models/userModel.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

const secretToken = process.env.SECRET_TOKEN

const generateToken = (data) => {
  return jwt.sign(data, secretToken, { expiresIn: '8h' });
}

// Register a new user
export const registerUser = async (req, res) => {
  const {username, password} = req.body;
  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = await User.create({ username, password: hashedPassword });
    return res.status(201).json(newUser);
  } catch (error) {
    console.error('Error registering user:', error);
    res.status(500).json({ message: 'Error registering user', error: error.message });
  }
};

// Login user
export const loginUser = async (req, res) => {
  const { username, password } = req.body;

  try {
    const user = await User.findOne({ username });
    if (!user) {
      console.log('User not found')
      return res.status(404).json({ message: 'User not found' });
    }

    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) {
      return res.status(401).json({ message: 'Invalid password' });
    }
    const token = generateToken({ id: user._id, username: user.username });
    res.json({ user, token });
  } catch {
    res.status(500).json({ message: 'Error logging in', error: error.message });
  }
};

// Get user

export const getUser = async (req, res) => {
  const { id } = req.user;
  try { 
    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.json(user);
  } catch (error) {
    return res.status(500).json({ message: 'Error fetching user', error: error.message });
  }
};
