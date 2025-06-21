import React from 'react'
import { useNavigate } from 'react-router-dom'
import './LandingPage.css'

function LandingPage() {
  const navigate = useNavigate()

  return (
    <div className="landing-container">
      <div className="logo">
        <img src="/logo.svg" alt="logo" className="logo-icon" />
        <h1>Welcome to MediCare Companion</h1>
        <p>Your trusted partner in medication management. Choose your role to get started with personalized features.</p>
      </div>

      <div className="role-cards">
        <div className="role-card patient">
          <h2>I'm a Patient</h2>
          <ul>
            <li>✔ Mark medications as taken</li>
            <li>✔ Upload proof photos (optional)</li>
            <li>✔ View your medication calendar</li>
            <li>✔ Large, easy-to-use interface</li>
          </ul>
          <button onClick={() => navigate('/login?role=patient')}>Continue as Patient</button>
        </div>

        <div className="role-card caretaker">
          <h2>I'm a Caretaker</h2>
          <ul>
            <li>✔ Monitor medication compliance</li>
            <li>✔ Set up notification preferences</li>
            <li>✔ View detailed reports</li>
            <li>✔ Receive email alerts</li>
          </ul>
          <button onClick={() => navigate('/logincare')}>Continue as Caretaker</button>
        </div>
      </div>
    </div>
  )
}

export default LandingPage
