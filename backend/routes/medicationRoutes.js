const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const controller = require('../controllers/medicationController');

// ✅ Add a new medication
router.post('/', auth, controller.addMedication);

// ✅ Get all medications (action column computed dynamically)
router.get('/', auth, controller.getMedications);

// ✅ Mark a medication as taken (adds today to taken_dates)
router.post('/:id/mark', auth, controller.markAsTaken);

module.exports = router;
