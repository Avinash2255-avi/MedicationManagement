const express = require('express')
const multer = require('multer')
const path = require('path')
const { v4: uuidv4 } = require('uuid')
const db = require('../database/db')
const authenticateToken = require('../middleware/auth')

const router = express.Router()

// 📁 Set up multer storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/') // Make sure this folder exists
  },
  filename: (req, file, cb) => {
    const uniqueName = uuidv4() + path.extname(file.originalname)
    cb(null, uniqueName)
  },
})

const upload = multer({ storage })

// 📸 POST /api/photos/upload
router.post('/upload', authenticateToken, upload.single('photo'), (req, res) => {
  const { medication_id } = req.body
  const file = req.file
  const userId = req.user.id
  const today = new Date().toISOString().split('T')[0]

  if (!file || !medication_id) {
    return res.status(400).json({ error: 'Photo and medication_id are required' })
  }

  const photo_id = uuidv4()
  const photo_path = file.path

  // 1. Save photo record
  db.run(
    `INSERT INTO medication_photos (photo_id, photo_path, medication_id) VALUES (?, ?, ?)`,
    [photo_id, photo_path, medication_id],
    (err) => {
      if (err) {
        console.error('DB insert error:', err)
        return res.status(500).json({ error: 'Failed to save photo' })
      }

      // 2. Get current taken_dates
      db.get(
        `SELECT taken_dates FROM medications WHERE id = ? AND user_id = ?`,
        [medication_id, userId],
        (err2, row) => {
          if (err2 || !row) {
            console.error('Failed to fetch medication:', err2?.message)
            return res.status(404).json({ error: 'Medication not found' })
          }

          let takenDates = []
          try {
            takenDates = JSON.parse(row.taken_dates || '[]')
          } catch (e) {
            console.warn('⚠ Error parsing taken_dates:', e.message)
          }

          if (!takenDates.includes(today)) {
            takenDates.push(today)
          }

          // 3. Update taken_dates
          db.run(
            `UPDATE medications SET taken_dates = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ? AND user_id = ?`,
            [JSON.stringify(takenDates), medication_id, userId],
            (err3) => {
              if (err3) {
                console.error('❌ Failed to update taken_dates:', err3.message)
                return res.status(500).json({ error: 'Photo saved, but failed to mark medication' })
              }

              res.status(201).json({
                success: true,
                message: 'Photo uploaded and medication marked as taken',
                photo_id,
                photo_path,
              })
            }
          )
        }
      )
    }
  )
})

module.exports = router
