const mongoose = require('mongoose');

const participationSchema = new mongoose.Schema({
  studentId: { type: String, required: true }, // Simplified to a predefined ID for this prototype
  eventId: { type: mongoose.Schema.Types.ObjectId, ref: 'Event', required: true }
}, { timestamps: true });

module.exports = mongoose.model('Participation', participationSchema);
