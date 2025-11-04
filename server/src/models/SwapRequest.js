const mongoose = require('mongoose');

const SwapStatus = ['PENDING', 'ACCEPTED', 'REJECTED'];

const swapRequestSchema = new mongoose.Schema({
  requesterId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  responderId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  mySlotId: { type: mongoose.Schema.Types.ObjectId, ref: 'Event', required: true },
  theirSlotId: { type: mongoose.Schema.Types.ObjectId, ref: 'Event', required: true },
  status: { type: String, enum: SwapStatus, default: 'PENDING' },
}, { timestamps: true });

module.exports = mongoose.model('SwapRequest', swapRequestSchema);
module.exports.SwapStatus = SwapStatus;
