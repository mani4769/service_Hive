const mongoose = require('mongoose');

const EventStatus = ['BUSY', 'SWAPPABLE', 'SWAP_PENDING'];

const eventSchema = new mongoose.Schema({
  title: { type: String, required: true },
  startTime: { type: Date, required: true },
  endTime: { type: Date, required: true },
  status: { type: String, enum: EventStatus, default: 'BUSY' },
  ownerId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
}, { timestamps: true });

module.exports = mongoose.model('Event', eventSchema);
module.exports.EventStatus = EventStatus;
