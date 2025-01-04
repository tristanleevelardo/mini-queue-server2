const mongoose = require('mongoose');

const miniCounter2SchemaP = new mongoose.Schema({
  value: { type: Number, default: 1 },
});

module.exports = mongoose.model('miniCounter2P', miniCounter2SchemaP, 'miniCounter2P');
