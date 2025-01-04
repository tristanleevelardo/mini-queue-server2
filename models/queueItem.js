const mongoose = require('mongoose');

const miniQueue2Wise = new mongoose.Schema({
  windowNum: {
    type: String,
    required: false, // Make it optional
  },
  queueNum: {
    type: String,
    required: false, // Make it optional
  },
  status: String,
  priority: Boolean,
  
});

module.exports = mongoose.model('miniQueue2Schema', miniQueue2Wise, 'miniQueue2List');