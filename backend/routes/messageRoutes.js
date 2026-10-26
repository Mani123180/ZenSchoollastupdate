const express = require('express');
const router = express.Router();
const { getContacts, getMessages, sendMessage, heartbeat } = require('../controllers/messageController');
const { protect } = require('../middleware/authMiddleware');

router.post('/heartbeat', protect, heartbeat);
router.get('/contacts', protect, getContacts);
router.get('/', protect, getMessages);
router.post('/', protect, sendMessage);

module.exports = router;
