import React, { useState, useEffect } from 'react'
import axios from 'axios'
import { useNavigate, useLocation, Link} from 'react-router-dom'
import './Login.css'


function Login() {
  const [formData, setFormData] = useState({ username: '', password: '' })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [role, setRole] = useState('patient') // default role
  const navigate = useNavigate()
  const location = useLocation()

  useEffect(() => {
    const params = new URLSearchParams(location.search)
    const selectedRole = params.get('role')
    if (selectedRole === 'caretaker') {
      setRole('caretaker')
    } else {
      setRole('patient')
    }
  }, [location.search])

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      const trimmedFormData = {
        username: formData.username.trim(),
        password: formData.password,
        role,
      }

      const res = await axios.post('http://localhost:5000/api/auth/login', trimmedFormData)
      const { token, role: serverRole } = res.data

      if (!token) throw new Error('Token missing from response')

      localStorage.setItem('token', token)
      localStorage.setItem('role', serverRole)

      if (serverRole === 'caretaker') {
        navigate('/caretaker-dashboard')
      } else {
        navigate('/dashboard')
      }
    } catch (err) {
      console.error('Login error:', err.response?.data || err.message)
      setError(err.response?.data?.error || 'Login failed')
    } finally {
      setLoading(false)
    }
  }

  return (
  <div className="login-container">
    <h2>{role === 'caretaker' ? '👥 Caretaker Login' : '🧑‍⚕️ Patient Login'}</h2>

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

    {error && <p style={{ color: 'red' }}>{error}</p>}

    <p>
      Don’t have an account?{' '}
      <Link to="/signuppatient" className="signup-link">Sign up here</Link>
    </p>
  </div>
)

}

export default Login
