const jwt = require('jsonwebtoken');
const { UserModel } = require('../models/user.Model');
const { BlackListModel } = require('../models/blackList.model');

const auth = async (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
      return res.status(401).json({ error: 'Authorization token missing' });
    }

    const isBlacklisted = await BlackListModel.exists({ token });
    if (isBlacklisted) {
      return res.status(401).json({ error: 'Invalid token' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await UserModel.findById(decoded.userID);
    if (!user) {
      return res.status(401).json({ error: 'Invalid token' });
    }

    req.user = user;
    next();
  } catch (err) {
    res.status(401).json({ error: 'Invalid token' });
  }
};

module.exports = { auth };
