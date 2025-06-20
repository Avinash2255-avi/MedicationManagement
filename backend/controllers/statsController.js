const db = require('../database/db');

exports.getStatsSummary = (req, res) => {
  const userId = req.user.id;
  const today = new Date().toISOString().split('T')[0];

  const stats = {
    todayStatus: false,
    streak: 0,
    monthlyRate: 0,
  };

  // ✅ Check today's status
  db.all(
    `SELECT taken_dates FROM medications WHERE user_id = ?`,
    [userId],
    (err, rows) => {
      if (err) return res.status(500).json({ error: err.message });

      let todayTaken = false;
      let totalTakenThisMonth = 0;
      let totalExpectedThisMonth = rows.length;

      const thisMonth = new Date().toISOString().slice(0, 7); // 'YYYY-MM'

      rows.forEach((med) => {
        let dates = [];
        try {
          dates = JSON.parse(med.taken_dates || '[]');
        } catch (e) {
          dates = [];
        }

        // Check if today is in taken_dates
        if (dates.includes(today)) {
          todayTaken = true;
        }

        // Count dates in this month
        totalTakenThisMonth += dates.filter((d) => d.startsWith(thisMonth)).length;
      });

      stats.todayStatus = todayTaken;

      // ✅ Count streak (simplified: number of unique dates user took meds)
      db.all(
        `SELECT taken_dates FROM medications WHERE user_id = ?`,
        [userId],
        (err2, rows2) => {
          if (err2) return res.status(500).json({ error: err2.message });

          const uniqueDates = new Set();

          rows2.forEach((med) => {
            let dates = [];
            try {
              dates = JSON.parse(med.taken_dates || '[]');
            } catch (e) {
              dates = [];
            }

            dates.forEach((d) => uniqueDates.add(d));
          });

          stats.streak = uniqueDates.size;

          // ✅ Monthly rate: total taken this month / total expected (if daily meds)
          stats.monthlyRate =
            totalExpectedThisMonth > 0
              ? Math.round((totalTakenThisMonth / totalExpectedThisMonth) * 100)
              : 0;

          res.json(stats);
        }
      );
    }
  );
};
