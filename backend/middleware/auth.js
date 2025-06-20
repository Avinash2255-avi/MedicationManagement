const jwt = require('jsonwebtoken')

// 🔐 Use consistent secret key (consider .env for production)
const SECRET_KEY = process.env.SECRET_KEY || 'your_secret_key'

/**
 * Middleware to verify JWT token from Authorization header
 */
module.exports = function authenticateToken(req, res, next) {
  const authHeader = req.headers.authorization

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    console.warn('⛔ Missing or malformed Authorization header')
    return res.status(401).json({ error: 'Authorization token missing or malformed' })
  }

  const token = authHeader.split(' ')[1]
  console.log('🔐 Token received:', token)

  jwt.verify(token, SECRET_KEY, (err, decoded) => {
    if (err) {
      console.error('❌ Token verification failed:', err.message)
      return res.status(403).json({ error: 'Invalid or expired token' })
    }

    console.log('✅ Token verified. Decoded payload:', decoded)
    req.user = decoded // Add decoded info (e.g. id, role) to request
    next()
  })
}
