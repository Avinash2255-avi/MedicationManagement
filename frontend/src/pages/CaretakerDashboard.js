import React, { useEffect, useState } from 'react'
import axios from 'axios'
import './CaretakerDashboard.css'
import { HiOutlineUserGroup } from 'react-icons/hi'
import { useNavigate } from 'react-router-dom'

function CaretakerDashboard() {
  const [patients, setPatients] = useState([])
  console.log(patients)
  const [activeTab, setActiveTab] = useState('overview')
  const token = localStorage.getItem('token')
  const navigate = useNavigate()

  const handleLogout = () => {
    localStorage.removeItem('token')
    navigate('/')
  }

  useEffect(() => {
    const fetchPatients = async () => {
      try {
        const res = await axios.get('http://localhost:5000/api/caretaker/patients', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        setPatients(res.data)
      } catch (err) {
        console.error('Failed to fetch patient data:', err)
      }
    }

    fetchPatients()
  }, [token])

  return (
    <div className="caretaker-dashboard-container">
      <header className="caretaker-header">
        <div className="app-info">
          <div className="logo-circle">M</div>
          <div>
            <h1>MediCare Companion</h1>
            <p>Caretaker View</p>
          </div>
        </div>
        <button className="switch-btn" onClick={handleLogout}>
          <HiOutlineUserGroup className="text-lg" /> Logout
        </button>
      </header>

      <section className="dashboard-banner">
        <div className="banner-header">
          <HiOutlineUserGroup className="icon" />
          <div>
            <h2>Caretaker Dashboard</h2>
            <p>Monitoring Eleanor Thompson's medication adherence</p>
          </div>
        </div>
        <div className="metrics">
          <div className="metric-card">85%<span>Adherence Rate</span></div>
          <div className="metric-card">5<span>Current Streak</span></div>
          <div className="metric-card">3<span>Missed This Month</span></div>
          <div className="metric-card">4<span>Taken This Week</span></div>
        </div>
      </section>

      <nav className="tabs">
        <button className={activeTab === 'overview' ? 'active' : ''} onClick={() => setActiveTab('overview')}>Overview</button>
        <button className={activeTab === 'activity' ? 'active' : ''} onClick={() => setActiveTab('activity')}>Recent Activity</button>
        <button className={activeTab === 'calendar' ? 'active' : ''} onClick={() => setActiveTab('calendar')}>Calendar View</button>
        <button className={activeTab === 'notifications' ? 'active' : ''} onClick={() => setActiveTab('notifications')}>Notifications</button>
      </nav>

      {activeTab === 'overview' && (
        <>
          <div className="status-actions-container">
            <div className="status-card">
              <h3>🗕️ Today's Status</h3>
              <div className="medication-set">
                <p>Daily Medication Set</p>
                <small>8:00 AM</small>
                <span className="status-badge">Pending</span>
              </div>
            </div>

            <div className="quick-actions">
              <h3>⚡ Quick Actions</h3>
              <button>📧 Send Reminder Email</button>
              <button>🔔 Configure Notifications</button>
              <button>🗓️ View Full Calendar</button>
            </div>
          </div>

          <section className="adherence-progress-card">
            <h3>📊 Monthly Adherence Progress</h3>
            <p className="progress-label">Overall Progress</p>
            <div className="progress-bar-container">
              <div className="progress-bar-fill" style={{ width: '85%' }}></div>
            </div>
            <div className="progress-legend">
              <div><span className="taken">22 days</span><br /><small>Taken</small></div>
              <div><span className="missed">3 days</span><br /><small>Missed</small></div>
              <div><span className="remaining">5 days</span><br /><small>Remaining</small></div>
            </div>
          </section>
        </>
      )}

      {activeTab === 'activity' && (
        <div className="activity-tab">
          <h3>Recent Medication Activity</h3>
          <ul className="activity-list">
            <li className="taken">🔹 Monday, June 10 - Taken at 8:30 AM <span>Completed</span></li>
            <li className="taken">🔹 Sunday, June 9 - Taken at 8:15 AM <span>Completed</span></li>
            <li className="missed">🔹 Saturday, June 8 - Medication missed <span>Missed</span></li>
            <li className="taken">🔹 Friday, June 7 - Taken at 8:45 AM <span>Completed</span></li>
            <li className="taken">🔹 Thursday, June 6 - Taken at 8:20 AM <span>Completed</span></li>
          </ul>
        </div>
      )}

      {activeTab === 'calendar' && (
        <div className="calendar-view">
          <h3>📅 Medication Calendar Overview</h3>
          <div className="calendar-grid-wrapper">
            <div className="calendar">
              <div className="calendar-header">
                <button>{'<'}</button>
                <h4>June 2025</h4>
                <button>{'>'}</button>
              </div>
              <div className="calendar-days">
                {['Su','Mo','Tu','We','Th','Fr','Sa'].map((day, i) => (
                  <div key={i} className="calendar-day-name">{day}</div>
                ))}
                {Array.from({ length: 30 }, (_, i) => {
                  const day = i + 1
                  const today = new Date().getDate()
                  const isToday = day === today
                  const isMissed = [1, 3, 5, 6, 8, 10, 11, 13, 15, 17, 19].includes(day)
                  const isTaken = [2, 4, 7, 9, 12, 14, 16, 18, 20, 22].includes(day)
                  return (
                    <div key={day} className={`calendar-day ${isToday ? 'today' : ''}`}>
                      {isTaken && <div className="dot green-dot"></div>}
                      {isMissed && <div className="dot red-dot"></div>}
                      {isToday && !isMissed && !isTaken && <div className="dot blue-dot"></div>}
                      <span>{day}</span>
                    </div>
                  )
                })}
              </div>
              <div className="legend">
                <div><span className="legend-dot green-dot"></span> Medication taken</div>
                <div><span className="legend-dot red-dot"></span> Missed medication</div>
                <div><span className="legend-dot blue-dot"></span> Today</div>
              </div>
            </div>
            <div className="calendar-details">
              <h4>Details for June 20, 2025</h4>
              <div className="calendar-today-box">
                <p><strong>🕒 Today</strong></p>
                <p>Monitor Eleanor Thompson's medication status for today.</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'notifications' && (
        <div className="notifications-tab">
          <h3>🔔 Notification Preferences</h3>
          <div className="notification-section">
            <h4>Email Notifications</h4>
            <p>Receive medication alerts via email</p>
            <input type="email" defaultValue="caretaker@example.com" />
            <div className="toggle">Enable <input type="checkbox" checked readOnly /></div>
          </div>

          <div className="notification-section">
            <h4>Missed Medication Alerts</h4>
            <p>Get notified when medication is not taken on time</p>
            <label>Alert me if medication isn't taken within</label>
            <select defaultValue="2 hours">
              <option>1 hour</option>
              <option>2 hours</option>
              <option>4 hours</option>
            </select>
            <label>Daily reminder time</label>
            <input type="time" defaultValue="20:00" />
            <small>Time to check if today's medication was taken</small>
          </div>
        </div>
        
      )}
    </div>
  )
}

export default CaretakerDashboard
