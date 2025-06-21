import React from 'react'
import { useNavigate } from 'react-router-dom'
import { HiOutlineUserGroup } from 'react-icons/hi'
import './Header.css'

function Header() {
  const navigate = useNavigate()

  const handleLogout = () => {
    localStorage.removeItem('token')         // Clear auth token
    navigate('/')                       // Redirect to login page
  }

  return (
    <header className="header-container">
      <div className="logo-section">
        <div className="logo-icon">M</div>
        <div>
          <h1 className="app-title">MediCare Companion</h1>
          <p className="sub-title">Patient View</p>
        </div>
      </div>

      <button className="switch-btn" onClick={handleLogout}>
        <HiOutlineUserGroup className="text-lg" />
        Logout
      </button>
    </header>
  )
}

export default Header
