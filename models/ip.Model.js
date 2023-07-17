const mongoose = require('mongoose');

const ipSchema = new mongoose.Schema({
  address: { type: String, required: true, unique: true },
  city: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
});

const IPModel = mongoose.model('IP', ipSchema);

module.exports = { IPModel };
