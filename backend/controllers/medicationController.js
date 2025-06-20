const db = require('../database/db');

// ✅ Add new medication
exports.addMedication = (req, res) => {
  const { name, dosage, frequency } = req.body;
  const userId = req.user.id;

  db.run(
    `INSERT INTO medications (user_id, name, dosage, frequency, taken_dates) VALUES (?, ?, ?, ?, ?)`,
    [userId, name, dosage, frequency, JSON.stringify([])],
    function (err) {
      if (err) {
        console.error('❌ Error inserting medication:', err.message);
        return res.status(500).json({ message: 'Error adding medication' });
      }
      res.status(201).json({ id: this.lastID });
    }
  );
};

// ✅ Get all medications for the logged-in user
exports.getMedications = (req, res) => {
  const userId = req.user.id;
  const today = new Date().toISOString().split('T')[0];

  db.all(
    `SELECT id, name, dosage, frequency, taken_dates FROM medications WHERE user_id = ?`,
    [userId],
    (err, rows) => {
      if (err) {
        console.error('❌ Error fetching medications:', err.message);
        return res.status(500).json({ message: 'Error fetching medications' });
      }

      const updatedRows = rows.map((med) => {
        let takenDates = [];
        try {
          takenDates = JSON.parse(med.taken_dates || '[]');
        } catch (e) {
          takenDates = [];
        }

        return {
          ...med,
          action: takenDates.includes(today) ? 1 : 0,
        };
      });

      res.json(updatedRows);
    }
  );
};

// ✅ Mark a medication as taken (with updated_at update)
exports.markAsTaken = (req, res) => {
  const userId = req.user.id;
  const { id } = req.params;
  const today = new Date().toISOString().split('T')[0];

  db.get(
    `SELECT taken_dates FROM medications WHERE id = ? AND user_id = ?`,
    [id, userId],
    (err, row) => {
      if (err || !row) {
        console.error('❌ Medication not found or error:', err?.message);
        return res.status(404).json({ message: 'Medication not found' });
      }

      let takenDates = [];
      try {
        takenDates = JSON.parse(row.taken_dates || '[]');
      } catch (e) {
        console.error('⚠️ Error parsing taken_dates JSON:', e.message);
      }

      if (!takenDates.includes(today)) {
        takenDates.push(today);
      }

      db.run(
        `UPDATE medications 
         SET taken_dates = ?, updated_at = CURRENT_TIMESTAMP 
         WHERE id = ? AND user_id = ?`,
        [JSON.stringify(takenDates), id, userId],
        (err2) => {
          if (err2) {
            console.error('❌ Failed to update taken_dates:', err2.message);
            return res.status(500).json({ message: 'Failed to update medication' });
          }
          res.json({ message: 'Medication marked as taken' });
        }
      );
    }
  );
};
