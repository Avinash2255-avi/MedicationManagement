import React from 'react'
import './CalendarSection.css'

function CalendarSection() {
  const days = Array.from({ length: 30 }, (_, i) => i + 1)
  const today = new Date().getDate()

  return (
    <div className="calendar-box">
      <h2 className="calendar-title">Medication Calendar</h2>
      <div className="calendar-sub">June 2025</div>
      <div className="calendar-grid">
        {days.map(day => (
          <div
            key={day}
            className={`calendar-day ${
              day === today ? 'today' : 'missed'
            }`}
          >
            {day}
          </div>
        ))}
      </div>
      <div className="legend">
        <span><span className="dot green"></span> Medication taken</span>
        <span><span className="dot red"></span> Missed medication</span>
        <span><span className="dot blue"></span> Today</span>
      </div>
    </div>
  )
}

export default CalendarSection
