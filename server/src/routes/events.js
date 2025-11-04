const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const { createEvent, getMyEvents, updateEvent, deleteEvent } = require('../controllers/eventController');

router.use(auth);
router.get('/', getMyEvents);
router.post('/', createEvent);
router.put('/:id', updateEvent);
router.delete('/:id', deleteEvent);

module.exports = router;
