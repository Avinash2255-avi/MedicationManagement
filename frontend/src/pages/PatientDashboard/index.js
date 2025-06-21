import React, { useState } from 'react'
import './PatientDashboard.css'
import Header from './components/Header'
import StatsCard from './components/StatsCard'
import MedicationSection from './components/MedicationSection'
import CalendarSection from './components/CalendarSection'

function PatientDashboard() {
  const [statsRefreshTrigger, setStatsRefreshTrigger] = useState(0)

  // 🔁 This is passed to MedicationSection to trigger stats refresh
  const handleStatsRefresh = () => {
    setStatsRefreshTrigger(prev => prev + 1)
  }

  return (
    <div className="dashboard-wrapper">
      <Header />

      {/* 📊 StatsCard updates when refreshTrigger changes */}
      <StatsCard refreshTrigger={statsRefreshTrigger} />

      <div className="dashboard-grid">
        <div>
          {/* 💊 Pass handleStatsRefresh to auto-refresh StatsCard */}
          <MedicationSection onMarkTaken={handleStatsRefresh} />
        </div>
        <div>
          <CalendarSection />
        </div>
      </div>
    </div>
  )
}

export default PatientDashboard
