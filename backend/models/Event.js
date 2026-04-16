const mongoose = require('mongoose');

const eventSchema = new mongoose.Schema({
  title: { type: String, required: true },
  society: { type: String, required: true },
  date: { type: String, required: true },
  time: { type: String, required: true },
  location: { type: String, required: true },
  description: { type: String, required: true },
  credits: { type: Number, required: true },
  streams: [{ type: String }],
  status: { type: String, default: 'Open' },
  image: { type: String }
}, { timestamps: true });

module.exports = mongoose.model('Event', eventSchema);
