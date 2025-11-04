const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const { getSwappableSlots, createSwapRequest, respondSwapRequest, mySwapRequests } = require('../controllers/swapController');

router.use(auth);
router.get('/swappable-slots', getSwappableSlots);
router.post('/swap-request', createSwapRequest);
router.post('/swap-response/:id', respondSwapRequest);
router.get('/swap-requests/me', mySwapRequests);

module.exports = router;
