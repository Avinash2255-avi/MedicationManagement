import React from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'

// Pages
import LandingPage from './pages/LandingPage'
import Login from './pages/Login'
import CaretakerLogin from './pages/CaretakerLogin'
import Signuppatient from './pages/Signuppatient'
import PatientDashboard from './pages/PatientDashboard'
import CaretakerDashboard from './pages/CaretakerDashboard'
import SignupCare from './pages/SignupCare'



// Route protection
import ProtectedRoute from './pages/PatientDashboard/components/ProtectedRoute'

function App() {
  return (
    <Router>
      <Routes>
        {/* 🌟 Default Landing Page */}
        <Route path="/" element={<LandingPage />} />

        {/* 🔐 Public Auth Routes */}
        <Route path="/login" element={<Login />} />
        <Route path="/logincare" element={<CaretakerLogin />} />
        <Route path="/signuppatient" element={<Signuppatient />} />
        <Route path="/signup-care" element={<SignupCare />} />

        {/* 🔒 Protected Route for Patient Dashboard */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <PatientDashboard />
            </ProtectedRoute>
          }
        />

        {/* 🔒 Protected Route for Caretaker Dashboard */}
        <Route
          path="/caretaker-dashboard"
          element={
            <ProtectedRoute>
              <CaretakerDashboard />
            </ProtectedRoute>
          }
        />

        {/* ❌ 404 Fallback */}
        <Route path="*" element={<h2 style={{ textAlign: 'center' }}>404 - Page Not Found</h2>} />
      </Routes>
    </Router>
  )
}

export default App
