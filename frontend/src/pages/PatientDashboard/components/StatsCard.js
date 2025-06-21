import React, { useEffect, useState } from 'react'
import './StatsCard.css'
import axios from 'axios'

function StatsCard({ refreshTrigger }) {
  const [streak, setStreak] = useState(0)
  const [todayStatus, setTodayStatus] = useState(false)
  const [monthlyRate, setMonthlyRate] = useState(0)
  const [greeting, setGreeting] = useState('Good Day!')

  const token = localStorage.getItem('token')

  // 🕒 Optional: Personalized greeting based on time
  const updateGreeting = () => {
    const hour = new Date().getHours()
    if (hour < 12) setGreeting('Good Morning!')
    else if (hour < 18) setGreeting('Good Afternoon!')
    else setGreeting('Good Evening!')
  }

  const fetchStats = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/stats/summary', {
        headers: { Authorization: `Bearer ${token}` },
      })

      setStreak(res.data.streak || 0)
      setTodayStatus(res.data.todayStatus || false)
      setMonthlyRate(res.data.monthlyRate || 0)
    } catch (err) {
      console.error('📉 Failed to fetch stats:', err)
    }
  }

  useEffect(() => {
    updateGreeting()
    fetchStats()
  }, [refreshTrigger])

  return (
    <div className="stats-card">
      <div className="stats-title">{greeting}</div>
      <div className="stats-subtitle">Ready to stay on track with your medication?</div>
      <div className="stats-boxes">
        <div className="stats-box">
          <div className="value">{streak}</div>
          <div className="label">Day Streak</div>
        </div>
        <div className="stats-box">
          <div className="value">{todayStatus ? '✔️' : '⭕'}</div>
          <div className="label">Today's Status</div>
        </div>
        <div className="stats-box">
          <div className="value">{monthlyRate}%</div>
          <div className="label">Monthly Rate</div>
        </div>
      </div>
    </div>
  )
}

export default StatsCard
