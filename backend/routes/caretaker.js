const express = require('express')
const router = express.Router()
const db = require('../database/db')
const auth = require('../middleware/auth')

router.get('/patients', auth, (req, res) => {
  db.all(`SELECT id AS user_id, username FROM users WHERE role = 'patient'`, [], (err, users) => {
    if (err) return res.status(500).json({ error: 'Failed to fetch patients' })

    const patientPromises = users.map((user) => {
      return new Promise((resolve) => {
        db.all(
          `SELECT * FROM medications WHERE user_id = ?`,
          [user.user_id],
          (medErr, meds) => {
            if (medErr) resolve({ ...user, medications: [], photos: [] })
            else {
              // Check action status for today
              const today = new Date().toISOString().split('T')[0]
              const enrichedMeds = meds.map((med) => {
                const takenDates = JSON.parse(med.taken_dates || '[]')
                return { ...med, action: takenDates.includes(today) ? 1 : 0 }
              })

              db.all(
                `SELECT * FROM medication_photos WHERE medication_id IN (${enrichedMeds
                  .map((m) => m.id)
                  .join(',') || 0})`,
                [],
                (photoErr, photos) => {
                  resolve({ ...user, medications: enrichedMeds, photos: photos || [] })
                }
              )
            }
          }
        )
      })
    })

    Promise.all(patientPromises).then((data) => res.json(data))
  })
})

module.exports = router
