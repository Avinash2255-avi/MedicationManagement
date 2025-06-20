const express = require('express')
const multer = require('multer')
const { v4: uuidv4 } = require('uuid')
const path = require('path')
const db = require('../database/db')
const authenticateToken = require('../middleware/auth')

const router = express.Router()

// 📂 Configure multer for file upload
const storage = multer.diskStorage({
  destination: 'uploads/',
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname)
    cb(null, uuidv4() + ext)
  },
})

const upload = multer({ storage })

// 📸 Upload proof photo and mark medication as taken (update taken_dates)
router.post('/upload', authenticateToken, upload.single('photo'), (req, res) => {
  const file = req.file
  const { medication_id } = req.body
  const today = new Date().toISOString().split('T')[0]

  if (!file || !medication_id) {
    return res.status(400).json({ error: 'Photo and medication_id are required' })
  }

  const photo_id = uuidv4()
  const photo_path = file.path

  // Insert into medication_photos
  db.run(
    `INSERT INTO medication_photos (photo_id, medication_id, photo_path) VALUES (?, ?, ?)`,
    [photo_id, medication_id, photo_path],
    (err) => {
      if (err) {
        console.error('DB error:', err.message)
        return res.status(500).json({ error: 'Database error while saving photo' })
      }

      // Get current taken_dates
      db.get(
        `SELECT taken_dates FROM medications WHERE id = ?`,
        [medication_id],
        (err2, row) => {
          if (err2 || !row) {
            console.error('Failed to fetch taken_dates:', err2?.message)
            return res.status(500).json({ error: 'Medication not found' })
          }

          let takenDates = []
          try {
            takenDates = JSON.parse(row.taken_dates || '[]')
          } catch (parseErr) {
            console.error('Error parsing taken_dates:', parseErr.message)
          }

          if (!takenDates.includes(today)) {
            takenDates.push(today)
          }

          // Update taken_dates and updated_at
          db.run(
            `UPDATE medications SET taken_dates = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?`,
            [JSON.stringify(takenDates), medication_id],
            (err3) => {
              if (err3) {
                console.error('❌ Failed to update taken_dates:', err3.message)
                return res.status(500).json({ error: 'Failed to mark medication as taken' })
              }

              console.log(`✅ Medication ID ${medication_id} marked as taken`)
              res.json({ success: true, photo_id, photo_path })
            }
          )
        }
      )
    }
  )
})

module.exports = router
