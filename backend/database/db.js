const sqlite3 = require('sqlite3').verbose()
const path = require('path')

const dbPath = path.resolve(__dirname, 'medication.db')
const db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    console.error('❌ Error opening database:', err.message)
  } else {
    console.log('✅ Connected to SQLite database at', dbPath)

    // ✅ Create users table
    db.run(
      `
      CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        username TEXT UNIQUE NOT NULL,
        password TEXT NOT NULL,
        role TEXT NOT NULL
      )
    `,
      (err) => {
        if (err) console.error('❌ Failed to create users table:', err.message)
        else console.log('✅ Users table ready')
      }
    )

    // ✅ Create medications table
    db.run(
      `
      CREATE TABLE IF NOT EXISTS medications (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id INTEGER NOT NULL,
        name TEXT NOT NULL,
        dosage TEXT NOT NULL,
        frequency TEXT NOT NULL,
        taken_dates TEXT DEFAULT '[]',
        updated_at TEXT DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users(id)
      )
    `,
      (err) => {
        if (err) console.error('❌ Failed to create medications table:', err.message)
        else console.log('✅ Medications table ready')
      }
    )

    // ✅ Create medication_photos table
    db.run(
      `
      CREATE TABLE IF NOT EXISTS medication_photos (
        photo_id TEXT PRIMARY KEY,
        medication_id INTEGER NOT NULL,
        photo_path TEXT NOT NULL,
        uploaded_at TEXT DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (medication_id) REFERENCES medications(id)
      )
    `,
      (err) => {
        if (err) console.error('❌ Failed to create medication_photos table:', err.message)
        else console.log('✅ medication_photos table ready')
      }
    )
  }
})

module.exports = db
