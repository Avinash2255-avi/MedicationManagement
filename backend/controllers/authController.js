const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const db = require('../database/db')

const SECRET_KEY = 'your_secret_key' // Replace with env variable in production

// ✅ Signup Controller
exports.signup = (req, res) => {
  const { username, password, role } = req.body

  if (!username || !password || !role) {
    return res.status(400).json({ error: 'All fields are required' })
  }

  // Check if user already exists
  db.get(`SELECT * FROM users WHERE username = ?`, [username], async (err, existingUser) => {
    if (err) return res.status(500).json({ error: 'Database error' })

    if (existingUser) {
      return res.status(409).json({ error: 'Username already exists' })
    }

    try {
      const hashedPassword = await bcrypt.hash(password, 10)

      db.run(
        `INSERT INTO users (username, password, role) VALUES (?, ?, ?)`,
        [username, hashedPassword, role],
        function (err) {
          if (err) {
            console.error('❌ Failed to insert user:', err.message)
            return res.status(500).json({ error: 'Failed to register user' })
          }

          console.log(`✅ Registered user: ${username}`)
          return res.status(201).json({ message: 'User registered successfully', id: this.lastID })
        }
      )
    } catch (error) {
      console.error('❌ Password hashing error:', error.message)
      return res.status(500).json({ error: 'Internal server error' })
    }
  })
}

// ✅ Login Controller
exports.login = (req, res) => {
  const { username, password } = req.body

  if (!username || !password) {
    return res.status(400).json({ error: 'Username and password are required' })
  }

  db.get(`SELECT * FROM users WHERE username = ?`, [username], async (err, user) => {
    if (err) return res.status(500).json({ error: 'Database error' })

    if (!user) {
      return res.status(401).json({ error: 'Invalid credentials' })
    }

    const isMatch = await bcrypt.compare(password, user.password)
    if (!isMatch) {
      return res.status(401).json({ error: 'Invalid credentials' })
    }

    const token = jwt.sign({ id: user.id, role: user.role }, SECRET_KEY, { expiresIn: '1h' })

    console.log(`✅ Login success for "${username}"`)
    return res.status(200).json({ message: 'Login successful', token, role: user.role })
  })
}
