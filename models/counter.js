const mongoose = require('mongoose');

const miniCounter2Schema = new mongoose.Schema({
  value: { type: Number, default: 1 },
});

module.exports = mongoose.model('miniCounter2', miniCounter2Schema, 'miniCounter2');
