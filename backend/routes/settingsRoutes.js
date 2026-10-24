const express = require('express');
const router = express.Router();
const { getSettings, updateSectionSettings, triggerBackup } = require('../controllers/settingsController');

router.get('/', getSettings);
router.put('/:section', updateSectionSettings);
router.post('/backup', triggerBackup);

module.exports = router;
