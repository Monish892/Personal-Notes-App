// Example for Login.jsx
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import './Login.css' // Assuming you have a CSS file for styling

const API = 'https://personal-notes-app-1zke.onrender.com'

export default function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const navigate = useNavigate()

  const login = async () => {
    try {
      const respone = await axios.post(`${API}/api/auth/login`, { email, password })
      localStorage.setItem('token', respone.data.token)
      alert('Login successful!')
      navigate('/notes') 
    } catch (err) {
      alert('Login failed')
      console.error(err)
    }
  }

  return (
    <div>
      <h2>Login</h2>
      <input placeholder="Email" onChange={e => setEmail(e.target.value)} />
      <input placeholder="Password" type="password" onChange={e => setPassword(e.target.value)} />
      <button onClick={login}>Login</button>
    </div>
  )
}