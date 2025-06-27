import { useEffect, useState } from 'react'
import axios from 'axios'

const API = 'https://personal-notes-app-1zke.onrender.com'

export default function Notes() {
  const [notes, setNotes] = useState([])
  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')

  const token = localStorage.getItem('token')

  useEffect(() => {
    axios.get(`${API}/api/notes`, {
      headers: { Authorization: `Bearer ${token}` }
    }).then(res => setNotes(res.data))
      .catch(() => alert('Please login first'))
  }, [])

  const createNote = async () => {
    try {
      const res = await axios.post(
        `${API}/api/notes`,
        { title, content },
        { headers: { Authorization: `Bearer ${token}` } }
      )
      setNotes([...notes, res.data])
    } catch (err) {
      alert('Failed to create note')
      console.log(err);
      
    }
  }

  return (
    <div>
      <h2>My Notes</h2>
      <input placeholder="Title" onChange={e => setTitle(e.target.value)} />
      <input placeholder="Content" onChange={e => setContent(e.target.value)} />
      <button onClick={createNote}>Add Note</button>
      <ul>
        {notes.map(note => (
          <li key={note._id}><strong>{note.title}</strong>: {note.content}</li>
        ))}
      </ul>
    </div>
  )
}
