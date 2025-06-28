import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'

const API = 'https://personal-notes-app-1zke.onrender.com'

export default function Register() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const navigate = useNavigate()

  const register = async () => {
    try {
      const respone = await axios.post(`${API}/api/auth/register`, { email, password })
      console.log(respone.data)
      alert('Registered successfully!')
      navigate('/login') // Redirect to login page
    } catch (err) {
      alert('Registration failed')
      console.error(err)
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