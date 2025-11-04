const Event = require('../models/Event');

exports.createEvent = async (req, res) => {
  try {
    const { title, startTime, endTime, status } = req.body;
    if (!title || !startTime || !endTime) return res.status(400).json({ message: 'Missing fields' });
    const ev = await Event.create({ title, startTime, endTime, status: status || 'BUSY', ownerId: req.user._id });
    res.status(201).json(ev);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.getMyEvents = async (req, res) => {
  try {
    const events = await Event.find({ ownerId: req.user._id }).sort({ startTime: 1 });
    res.json(events);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.updateEvent = async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;
    const ev = await Event.findOne({ _id: id, ownerId: req.user._id });
    if (!ev) return res.status(404).json({ message: 'Event not found' });
    Object.assign(ev, updates);
    await ev.save();
    res.json(ev);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.deleteEvent = async (req, res) => {
  try {
    const { id } = req.params;
    const ev = await Event.findOneAndDelete({ _id: id, ownerId: req.user._id });
    if (!ev) return res.status(404).json({ message: 'Event not found' });
    res.json({ message: 'Deleted' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};
