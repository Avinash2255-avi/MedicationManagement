import React, { useState } from 'react'
import axios from 'axios'
import { useNavigate, Link } from 'react-router-dom' // ✅ Add Link import
import './CaretakerLogin.css'

function CaretakerLogin() {
  const [formData, setFormData] = useState({ username: '', password: '' })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      const res = await axios.post('http://localhost:5000/api/auth/login', {
        username: formData.username.trim(),
        password: formData.password,
        role: 'caretaker',
      })

      const { token, role } = res.data
      localStorage.setItem('token', token)
      localStorage.setItem('role', role)

      if (role === 'caretaker') {
        navigate('/caretaker-dashboard')
      } else {
        navigate('/dashboard')
      }
    } catch (err) {
      setError(err.response?.data?.error || 'Login failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="login-container">
      <h2>👥 Caretaker Login</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          name="username"
          placeholder="Username"
          value={formData.username}
          onChange={handleChange}
          required
        />
        <input
          type="password"
          name="password"
          placeholder="Password"
          value={formData.password}
          onChange={handleChange}
          required
        />
        <button type="submit" disabled={loading}>
          {loading ? 'Logging in...' : 'Login'}
        </button>
      </form>
      {error && <p className="error">{error}</p>}

      {/* ✅ Caretaker signup link */}
      <p style={{ marginTop: '1rem' }}>
        Don't have an account?{' '}
        <Link to="/signup-care">Register as Caretaker</Link>
      </p>
    </div>
  )
}

export default CaretakerLogin
