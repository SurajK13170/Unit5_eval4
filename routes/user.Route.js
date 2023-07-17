const express = require('express');
const { UserModel } = require('../models/user.Model');
const { BlackListModel } = require('../models/blackList.model');
const userRoute = express.Router();
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

userRoute.post('/register', async (req, res) => {
  const { name, email, pass } = req.body;
  try {
    const existUser = await UserModel.findOne({ email });
    if (existUser) {
      return res.status(500).json({ msg: 'User already registered with this email!!' });
    } else {
      const hash = await bcrypt.hash(pass, 10);
      const user = new UserModel({ name, email, pass: hash });
      await user.save();
      res.status(200).json({ msg: 'Registration successful!' });
    }
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

userRoute.post('/login', async (req, res) => {
  const { email, pass } = req.body;
  try {
    const user = await UserModel.findOne({ email });
    if (user) {
      bcrypt.compare(pass, user.pass, (err, result) => {
        if (result) {
          const token = jwt.sign({ userID: user._id, userName: user.name }, process.env.JWT_SECRET);
          res.status(200).json({ msg: 'Login Success', token });
        } else {
          res.status(401).json({ error: 'Invalid credentials' });
        }
      });
    } else {
      res.status(401).json({ error: 'Invalid credentials' });
    }
  } catch (err) {
    res.status(500).json({ error: 'An error occurred' });
  }
});

userRoute.get('/logout', async (req, res) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    if (token) {
      const blacklistedToken = new BlackListModel({ token });
      await blacklistedToken.save();
      res.status(200).json({ msg: 'Logout Success!' });
    } else {
      res.status(400).json({ error: 'Token not found' });
    }
  } catch (err) {
    res.status(500).json({ error: 'An error occurred' });
  }
});

module.exports = { userRoute };
