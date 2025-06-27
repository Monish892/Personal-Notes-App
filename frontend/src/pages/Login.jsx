import { useState } from 'react'
import axios from 'axios'

export default function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  const login = async () => {
    try {
      const res = await axios.post('https://personal-notes-app-1zke.onrender.com/api/auth/login', { email, password })
      localStorage.setItem('token', res.data.token)
      window.location.href = '/'
    } catch (err) {
      alert('Login failed')
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
