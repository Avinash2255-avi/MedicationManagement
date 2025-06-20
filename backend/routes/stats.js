// routes/stats.js
const express = require('express')
const auth = require('../middleware/auth')
const statsController = require('../controllers/statsController')

const router = express.Router()

// GET /api/stats/summary
router.get('/summary', auth, statsController.getStatsSummary)

module.exports = router
