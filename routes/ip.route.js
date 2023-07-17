const express = require('express');
const router = express.Router();
const axios = require('axios');
const redis = require('redis');
const { auth } = require('../middelWare/auth');
const { IPModel } = require('../models/ip.Model');

const validateIP = (req, res, next) => {
  const ip = req.params.ip;

  const ipRegex = /^(?:[0-9]{1,3}\.){3}[0-9]{1,3}$/;
  if (!ipRegex.test(ip)) {
    return res.status(400).json({ error: 'Invalid IP address' });
  }

  next();
};

router.get('/:ip', auth, validateIP, async (req, res) => {
  try {
    const ip = req.params.ip;

    const cachedInfo = await getAsync(ip);
    if (cachedInfo) {
      return res.json(JSON.parse(cachedInfo));
    }

    const response = await axios.get(`https://ipapi.co/${ip}/json/`);
    const ipInfo = response.data;

    await setAsync(ip, 21600, JSON.stringify(ipInfo));

    const ipRecord = new IPModel({ address: ip, city: ipInfo.city });
    await ipRecord.save();

    res.json(ipInfo);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'An error occurred' });
  }
});

module.exports = { router };
