const mongoose = require('mongoose');
const Event = require('../models/Event');
const SwapRequest = require('../models/SwapRequest');

// GET /api/swappable-slots
exports.getSwappableSlots = async (req, res) => {
  try {
    const slots = await Event.find({ status: 'SWAPPABLE', ownerId: { $ne: req.user._id } }).populate('ownerId', 'name email');
    res.json(slots);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

// POST /api/swap-request { mySlotId, theirSlotId }
exports.createSwapRequest = async (req, res) => {
  const { mySlotId, theirSlotId } = req.body;
  if (!mySlotId || !theirSlotId) return res.status(400).json({ message: 'Missing slot ids' });

  const session = await mongoose.startSession();
  session.startTransaction();
  try {
    const mySlot = await Event.findOne({ _id: mySlotId }).session(session);
    const theirSlot = await Event.findOne({ _id: theirSlotId }).session(session);
    if (!mySlot || !theirSlot) {
      await session.abortTransaction();
      return res.status(404).json({ message: 'One or both slots not found' });
    }
    if (String(mySlot.ownerId) !== String(req.user._id)) {
      await session.abortTransaction();
      return res.status(403).json({ message: "mySlot doesn't belong to you" });
    }
    if (String(theirSlot.ownerId) === String(req.user._id)) {
      await session.abortTransaction();
      return res.status(400).json({ message: "Can't request your own slot" });
    }
    if (mySlot.status !== 'SWAPPABLE' || theirSlot.status !== 'SWAPPABLE') {
      await session.abortTransaction();
      return res.status(400).json({ message: 'Both slots must be SWAPPABLE' });
    }

    // create swap request
    const swap = await SwapRequest.create([{ requesterId: req.user._id, responderId: theirSlot.ownerId, mySlotId, theirSlotId }], { session });
    // update slots to SWAP_PENDING
    mySlot.status = 'SWAP_PENDING';
    theirSlot.status = 'SWAP_PENDING';
    await mySlot.save({ session });
    await theirSlot.save({ session });

    await session.commitTransaction();
    session.endSession();
    const populated = await SwapRequest.findById(swap[0]._id).populate('mySlotId theirSlotId requesterId responderId');
    res.status(201).json(populated);
  } catch (err) {
    await session.abortTransaction();
    session.endSession();
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

// POST /api/swap-response/:id { accepted: true|false }
exports.respondSwapRequest = async (req, res) => {
  const { id } = req.params;
  const { accepted } = req.body;
  const session = await mongoose.startSession();
  session.startTransaction();
  try {
    const swap = await SwapRequest.findById(id).session(session);
    if (!swap) {
      await session.abortTransaction();
      return res.status(404).json({ message: 'SwapRequest not found' });
    }
    if (String(swap.responderId) !== String(req.user._id)) {
      await session.abortTransaction();
      return res.status(403).json({ message: 'Not authorized to respond to this request' });
    }
    if (swap.status !== 'PENDING') {
      await session.abortTransaction();
      return res.status(400).json({ message: 'SwapRequest not pending' });
    }

    const mySlot = await Event.findById(swap.mySlotId).session(session);
    const theirSlot = await Event.findById(swap.theirSlotId).session(session);

    if (!mySlot || !theirSlot) {
      swap.status = 'REJECTED';
      await swap.save({ session });
      await session.commitTransaction();
      session.endSession();
      return res.status(400).json({ message: 'One of the slots was removed' });
    }

    if (!accepted) {
      swap.status = 'REJECTED';
      mySlot.status = 'SWAPPABLE';
      theirSlot.status = 'SWAPPABLE';
      await mySlot.save({ session });
      await theirSlot.save({ session });
      await swap.save({ session });
      await session.commitTransaction();
      session.endSession();
      return res.json({ message: 'Rejected' });
    }

    // ACCEPT: swap owners and set statuses to BUSY
    // Verify slots are still SWAP_PENDING
    if (mySlot.status !== 'SWAP_PENDING' || theirSlot.status !== 'SWAP_PENDING') {
      await session.abortTransaction();
      return res.status(400).json({ message: 'Slots are not pending' });
    }

    const ownerA = mySlot.ownerId;
    const ownerB = theirSlot.ownerId;

    mySlot.ownerId = ownerB;
    theirSlot.ownerId = ownerA;
    mySlot.status = 'BUSY';
    theirSlot.status = 'BUSY';

    swap.status = 'ACCEPTED';

    await mySlot.save({ session });
    await theirSlot.save({ session });
    await swap.save({ session });

    await session.commitTransaction();
    session.endSession();

    const populated = await SwapRequest.findById(swap._id).populate('mySlotId theirSlotId requesterId responderId');
    res.json(populated);
  } catch (err) {
    await session.abortTransaction();
    session.endSession();
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

// GET /api/swap-requests/me -> returns incoming and outgoing
exports.mySwapRequests = async (req, res) => {
  try {
    const incoming = await SwapRequest.find({ responderId: req.user._id }).populate('mySlotId theirSlotId requesterId responderId').sort({ createdAt: -1 });
    const outgoing = await SwapRequest.find({ requesterId: req.user._id }).populate('mySlotId theirSlotId requesterId responderId').sort({ createdAt: -1 });
    res.json({ incoming, outgoing });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};
