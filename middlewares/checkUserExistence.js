import User from "../models/userModel.js";

export const checkUser = async (req, res, next) => {
  const { username } = req.body;

  try {
    const userByUsername = await User.findOne({ username });
    if (userByUsername) {
      return res.status(400).json({ message: 'Username already exists' });
    }
    console.log('User checked');
    next();
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};