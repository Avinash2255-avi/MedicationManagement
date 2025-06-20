const express = require('express');
const cors = require('cors');
const sqlite3 = require('sqlite3').verbose();
const bcrypt = require('bcrypt');
const path = require('path');
const authRoutes = require('./routes/authRoutes');
const medicationRoutes = require('./routes/medicationRoutes'); // ✅ added
const photoRoutes = require('./routes/photoRoutes')
const statsRoutes = require('./routes/stats')
const app = express();
app.use(cors());
app.use(express.json());

// 📌 DB setup...
const dbPath = path.resolve(__dirname, 'database', 'medication.db');
const db = new sqlite3.Database(dbPath, (err) => {
  // ... your DB setup as shared
});

// ✅ Export DB
module.exports = db;

// ✅ Register routes
app.use('/api/auth', authRoutes);
app.use('/api/medications', medicationRoutes); // ✅ Register meds route
app.use('/api/photos', photoRoutes)
app.use('/uploads', express.static('uploads'))
app.use('/api/stats', statsRoutes)
app.use('/api/caretaker', require('./routes/caretaker'))


// ✅ Start server
app.listen(5000, () => {
  console.log('🚀 Server running on http://localhost:5000');
});
