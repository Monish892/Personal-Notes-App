import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Login from './pages/Login'
import Register from './pages/Register'
import Notes from './pages/Notes'

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Notes />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
      </Routes>
    </BrowserRouter>
  )
}
