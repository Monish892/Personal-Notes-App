import { useState } from 'react'
import axios from 'axios'

const API = 'https://personal-notes-app-1zke.onrender.com'

export default function Register() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  const register = async () => {
    try {
      await axios.post(`${API}/api/auth/register`, { email, password })
      alert('Registered successfully!')
    } catch (err) {
      alert('Registration failed')
    }
  }

  return (
    <div>
      <h2>Register</h2>
      <input placeholder="Email" onChange={e => setEmail(e.target.value)} />
      <input placeholder="Password" type="password" onChange={e => setPassword(e.target.value)} />
      <button onClick={register}>Register</button>
    </div>
  )
}
