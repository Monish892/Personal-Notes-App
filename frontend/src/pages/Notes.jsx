import { useEffect, useState } from 'react'

const API = 'https://personal-notes-app-1zke.onrender.com'

export default function NotesApp() {
  const [notes, setNotes] = useState([])
  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [showAuth, setShowAuth] = useState(false)
  const [isLogin, setIsLogin] = useState(true)
  const [authData, setAuthData] = useState({ email: '', password: '', name: '' })
  const [token, setToken] = useState('')
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    const savedToken = localStorage?.getItem?.('token')
    const savedUser = localStorage?.getItem?.('user')
    if (savedToken && savedUser) {
      setToken(savedToken)
      setUser(JSON.parse(savedUser))
      setIsAuthenticated(true)
      fetchNotes(savedToken)
    }
  }, [])

  const fetchNotes = async (authToken) => {
    try {
      const response = await fetch(`${API}/api/notes`, {
        headers: { Authorization: `Bearer ${authToken}` }
      })
      if (response.ok) {
        const data = await response.json()
        setNotes(data)
      }
    } catch (err) {
      console.error('Failed to fetch notes:', err)
    }
  }

  const handleAuth = async (e) => {
    e.preventDefault()
    setLoading(true)
    
    try {
      const endpoint = isLogin ? '/api/auth/login' : '/api/auth/register'
      const payload = isLogin 
        ? { email: authData.email, password: authData.password }
        : authData

      const response = await fetch(`${API}${endpoint}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      })

      const data = await response.json()
      
      if (response.ok) {
        setToken(data.token)
        setUser(data.user)
        setIsAuthenticated(true)
        setShowAuth(false)
        localStorage?.setItem?.('token', data.token)
        localStorage?.setItem?.('user', JSON.stringify(data.user))
        fetchNotes(data.token)
        setAuthData({ email: '', password: '', name: '' })
      } else {
        alert(data.message || 'Authentication failed')
      }
    } catch (err) {
      alert('Network error. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const logout = () => {
    setToken('')
    setUser(null)
    setIsAuthenticated(false)
    setNotes([])
    localStorage?.removeItem?.('token')
    localStorage?.removeItem?.('user')
  }

  const createNote = async (e) => {
    e.preventDefault()
    if (!title.trim() || !content.trim()) return

    setLoading(true)
    try {
      const response = await fetch(`${API}/api/notes`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ title, content })
      })

      if (response.ok) {
        const newNote = await response.json()
        setNotes([newNote, ...notes])
        setTitle('')
        setContent('')
      } else {
        alert('Failed to create note')
      }
    } catch (err) {
      alert('Failed to create note')
    } finally {
      setLoading(false)
    }
  }

  const deleteNote = async (noteId) => {
    try {
      const response = await fetch(`${API}/api/notes/${noteId}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` }
      })

      if (response.ok) {
        setNotes(notes.filter(note => note._id !== noteId))
      }
    } catch (err) {
      alert('Failed to delete note')
    }
  }

  return (
    <div style={styles.container}>
      {/* Animated Background */}
      <div style={styles.background}>
        <div style={styles.shape1}></div>
        <div style={styles.shape2}></div>
        <div style={styles.shape3}></div>
      </div>

      {/* Navigation */}
      <nav style={styles.navbar}>
        <div style={styles.navContent}>
          <h1 style={styles.logo}>📝 NotesApp</h1>
          <div style={styles.navButtons}>
            {isAuthenticated ? (
              <>
                <span style={styles.welcomeText}>Hello, {user?.name || user?.email}!</span>
                <button style={styles.logoutBtn} onClick={logout}>
                  Logout
                </button>
              </>
            ) : (
              <>
                <button 
                  style={styles.navBtn}
                  onClick={() => { setShowAuth(true); setIsLogin(true); }}
                >
                  Login
                </button>
                <button 
                  style={styles.navBtnSecondary}
                  onClick={() => { setShowAuth(true); setIsLogin(false); }}
                >
                  Register
                </button>
              </>
            )}
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main style={styles.main}>
        {isAuthenticated ? (
          <>
            {/* Create Note Form */}
            <div style={styles.createNoteCard}>
              <h2 style={styles.cardTitle}>Create New Note</h2>
              <form onSubmit={createNote} style={styles.form}>
                <input
                  style={styles.input}
                  placeholder="Enter note title..."
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  required
                />
                <textarea
                  style={styles.textarea}
                  placeholder="Write your note content..."
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  rows="4"
                  required
                />
                <button 
                  type="submit" 
                  style={styles.submitBtn}
                  disabled={loading}
                >
                  {loading ? '✨ Adding...' : '➕ Add Note'}
                </button>
              </form>
            </div>

            {/* Notes List */}
            <div style={styles.notesContainer}>
              <h2 style={styles.sectionTitle}>Your Notes ({notes.length})</h2>
              {notes.length === 0 ? (
                <div style={styles.emptyState}>
                  <p>📝 No notes yet. Create your first note above!</p>
                </div>
              ) : (
                <div style={styles.notesGrid}>
                  {notes.map((note, index) => (
                    <div 
                      key={note._id} 
                      style={{
                        ...styles.noteCard,
                        animationDelay: `${index * 0.1}s`
                      }}
                    >
                      <div style={styles.noteHeader}>
                        <h3 style={styles.noteTitle}>{note.title}</h3>
                        <button
                          style={styles.deleteBtn}
                          onClick={() => deleteNote(note._id)}
                          title="Delete note"
                        >
                          🗑️
                        </button>
                      </div>
                      <p style={styles.noteContent}>{note.content}</p>
                      <div style={styles.noteFooter}>
                        <small style={styles.noteDate}>
                          {new Date(note.createdAt || Date.now()).toLocaleDateString()}
                        </small>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </>
        ) : (
          <div style={styles.welcomeSection}>
            <div style={styles.welcomeCard}>
              <h2 style={styles.welcomeTitle}>Welcome to NotesApp</h2>
              <p style={styles.welcomeText}>
                Organize your thoughts, ideas, and reminders in one beautiful place.
              </p>
              <div style={styles.features}>
                <div style={styles.feature}>✨ Beautiful & Intuitive</div>
                <div style={styles.feature}>🔒 Secure & Private</div>
                <div style={styles.feature}>📱 Works Everywhere</div>
              </div>
              <button 
                style={styles.getStartedBtn}
                onClick={() => { setShowAuth(true); setIsLogin(false); }}
              >
                Get Started
              </button>
            </div>
          </div>
        )}
      </main>

      {/* Auth Modal */}
      {showAuth && (
        <div style={styles.modalOverlay} onClick={() => setShowAuth(false)}>
          <div style={styles.modal} onClick={(e) => e.stopPropagation()}>
            <div style={styles.modalHeader}>
              <h2 style={styles.modalTitle}>
                {isLogin ? '👋 Welcome Back' : '🚀 Join NotesApp'}
              </h2>
              <button 
                style={styles.closeBtn}
                onClick={() => setShowAuth(false)}
              >
                ✕
              </button>
            </div>
            
            <form onSubmit={handleAuth} style={styles.authForm}>
              {!isLogin && (
                <input
                  style={styles.input}
                  type="text"
                  placeholder="Full Name"
                  value={authData.name}
                  onChange={(e) => setAuthData({...authData, name: e.target.value})}
                  required
                />
              )}
              <input
                style={styles.input}
                type="email"
                placeholder="Email Address"
                value={authData.email}
                onChange={(e) => setAuthData({...authData, email: e.target.value})}
                required
              />
              <input
                style={styles.input}
                type="password"
                placeholder="Password"
                value={authData.password}
                onChange={(e) => setAuthData({...authData, password: e.target.value})}
                required
              />
              
              <button 
                type="submit" 
                style={styles.authSubmitBtn}
                disabled={loading}
              >
                {loading ? '⏳ Please wait...' : (isLogin ? '🔓 Sign In' : '✨ Create Account')}
              </button>
            </form>

            <div style={styles.authSwitch}>
              <p>
                {isLogin ? "Don't have an account? " : "Already have an account? "}
                <button 
                  style={styles.switchBtn}
                  onClick={() => setIsLogin(!isLogin)}
                >
                  {isLogin ? 'Register here' : 'Login here'}
                </button>
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

const styles = {
  container: {
    minHeight: '100vh',
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
    position: 'relative',
    overflow: 'hidden'
  },
  
  background: {
    position: 'fixed',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    zIndex: -1
  },
  
  shape1: {
    position: 'absolute',
    top: '10%',
    left: '10%',
    width: '300px',
    height: '300px',
    background: 'rgba(255,255,255,0.1)',
    borderRadius: '50%',
    animation: 'float 6s ease-in-out infinite'
  },
  
  shape2: {
    position: 'absolute',
    top: '60%',
    right: '10%',
    width: '200px',
    height: '200px',
    background: 'rgba(255,255,255,0.08)',
    borderRadius: '50%',
    animation: 'float 8s ease-in-out infinite reverse'
  },
  
  shape3: {
    position: 'absolute',
    bottom: '10%',
    left: '20%',
    width: '150px',
    height: '150px',
    background: 'rgba(255,255,255,0.06)',
    borderRadius: '50%',
    animation: 'float 7s ease-in-out infinite'
  },
  
  navbar: {
    background: 'rgba(255,255,255,0.95)',
    backdropFilter: 'blur(10px)',
    borderBottom: '1px solid rgba(255,255,255,0.2)',
    padding: '1rem 0',
    position: 'sticky',
    top: 0,
    zIndex: 100
  },
  
  navContent: {
    maxWidth: '1200px',
    margin: '0 auto',
    padding: '0 2rem',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  
  logo: {
    fontSize: '1.5rem',
    fontWeight: 'bold',
    color: '#4c63d2',
    margin: 0
  },
  
  navButtons: {
    display: 'flex',
    alignItems: 'center',
    gap: '1rem'
  },
  
  welcomeText: {
    color: '#666',
    fontSize: '0.9rem'
  },
  
  navBtn: {
    background: 'linear-gradient(135deg, #4c63d2, #5a67d8)',
    color: 'white',
    border: 'none',
    padding: '0.75rem 1.5rem',
    borderRadius: '25px',
    cursor: 'pointer',
    fontWeight: '600',
    transition: 'all 0.3s ease',
    boxShadow: '0 4px 15px rgba(76, 99, 210, 0.3)'
  },
  
  navBtnSecondary: {
    background: 'transparent',
    color: '#4c63d2',
    border: '2px solid #4c63d2',
    padding: '0.75rem 1.5rem',
    borderRadius: '25px',
    cursor: 'pointer',
    fontWeight: '600',
    transition: 'all 0.3s ease'
  },
  
  logoutBtn: {
    background: 'linear-gradient(135deg, #f56565, #e53e3e)',
    color: 'white',
    border: 'none',
    padding: '0.75rem 1.5rem',
    borderRadius: '25px',
    cursor: 'pointer',
    fontWeight: '600',
    transition: 'all 0.3s ease'
  },
  
  main: {
    maxWidth: '1200px',
    margin: '0 auto',
    padding: '2rem'
  },
  
  createNoteCard: {
    background: 'rgba(255,255,255,0.95)',
    backdropFilter: 'blur(10px)',
    borderRadius: '20px',
    padding: '2rem',
    marginBottom: '2rem',
    boxShadow: '0 8px 32px rgba(0,0,0,0.1)',
    border: '1px solid rgba(255,255,255,0.2)',
    animation: 'slideUp 0.6s ease-out'
  },
  
  cardTitle: {
    color: '#2d3748',
    marginBottom: '1.5rem',
    fontSize: '1.5rem',
    fontWeight: '700'
  },
  
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: '1rem'
  },
  
  input: {
    padding: '1rem',
    border: '2px solid #e2e8f0',
    borderRadius: '12px',
    fontSize: '1rem',
    transition: 'all 0.3s ease',
    background: 'rgba(255,255,255,0.8)',
    outline: 'none'
  },
  
  textarea: {
    padding: '1rem',
    border: '2px solid #e2e8f0',
    borderRadius: '12px',
    fontSize: '1rem',
    transition: 'all 0.3s ease',
    background: 'rgba(255,255,255,0.8)',
    outline: 'none',
    resize: 'vertical',
    fontFamily: 'inherit'
  },
  
  submitBtn: {
    background: 'linear-gradient(135deg, #48bb78, #38a169)',
    color: 'white',
    border: 'none',
    padding: '1rem 2rem',
    borderRadius: '12px',
    fontSize: '1.1rem',
    fontWeight: '600',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
    boxShadow: '0 4px 15px rgba(72, 187, 120, 0.3)'
  },
  
  notesContainer: {
    animation: 'fadeIn 0.8s ease-out'
  },
  
  sectionTitle: {
    color: 'white',
    marginBottom: '1.5rem',
    fontSize: '1.8rem',
    fontWeight: '700',
    textAlign: 'center',
    textShadow: '0 2px 4px rgba(0,0,0,0.3)'
  },
  
  emptyState: {
    textAlign: 'center',
    color: 'white',
    fontSize: '1.2rem',
    padding: '3rem',
    background: 'rgba(255,255,255,0.1)',
    borderRadius: '20px',
    backdropFilter: 'blur(10px)'
  },
  
  notesGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
    gap: '1.5rem'
  },
  
  noteCard: {
    background: 'rgba(255,255,255,0.95)',
    backdropFilter: 'blur(10px)',
    borderRadius: '16px',
    padding: '1.5rem',
    boxShadow: '0 8px 32px rgba(0,0,0,0.1)',
    border: '1px solid rgba(255,255,255,0.2)',
    transition: 'all 0.3s ease',
    animation: 'slideInUp 0.6s ease-out both'
  },
  
  noteHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: '1rem'
  },
  
  noteTitle: {
    color: '#2d3748',
    fontSize: '1.2rem',
    fontWeight: '700',
    margin: 0,
    flex: 1
  },
  
  deleteBtn: {
    background: 'none',
    border: 'none',
    cursor: 'pointer',
    fontSize: '1.2rem',
    padding: '0.25rem',
    borderRadius: '6px',
    transition: 'all 0.2s ease',
    opacity: 0.7
  },
  
  noteContent: {
    color: '#4a5568',
    lineHeight: '1.6',
    marginBottom: '1rem'
  },
  
  noteFooter: {
    borderTop: '1px solid #e2e8f0',
    paddingTop: '0.75rem'
  },
  
  noteDate: {
    color: '#a0aec0',
    fontSize: '0.85rem'
  },
  
  welcomeSection: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    minHeight: '70vh'
  },
  
  welcomeCard: {
    background: 'rgba(255,255,255,0.95)',
    backdropFilter: 'blur(10px)',
    borderRadius: '24px',
    padding: '3rem',
    textAlign: 'center',
    boxShadow: '0 16px 64px rgba(0,0,0,0.15)',
    border: '1px solid rgba(255,255,255,0.2)',
    maxWidth: '500px',
    animation: 'zoomIn 0.8s ease-out'
  },
  
  welcomeTitle: {
    color: '#2d3748',
    fontSize: '2.5rem',
    fontWeight: '800',
    marginBottom: '1rem'
  },
  
  features: {
    display: 'flex',
    justifyContent: 'center',
    gap: '1rem',
    marginTop: '2rem',
    marginBottom: '2rem',
    flexWrap: 'wrap'
  },
  
  feature: {
    background: 'rgba(76, 99, 210, 0.1)',
    color: '#4c63d2',
    padding: '0.5rem 1rem',
    borderRadius: '20px',
    fontSize: '0.9rem',
    fontWeight: '600'
  },
  
  getStartedBtn: {
    background: 'linear-gradient(135deg, #4c63d2, #5a67d8)',
    color: 'white',
    border: 'none',
    padding: '1rem 2rem',
    borderRadius: '25px',
    fontSize: '1.1rem',
    fontWeight: '700',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
    boxShadow: '0 8px 24px rgba(76, 99, 210, 0.4)'
  },
  
  modalOverlay: {
    position: 'fixed',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    background: 'rgba(0,0,0,0.6)',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1000,
    backdropFilter: 'blur(4px)',
    animation: 'fadeIn 0.3s ease-out'
  },
  
  modal: {
    background: 'white',
    borderRadius: '20px',
    padding: '2rem',
    width: '90%',
    maxWidth: '400px',
    boxShadow: '0 16px 64px rgba(0,0,0,0.2)',
    animation: 'slideIn 0.4s ease-out'
  },
  
  modalHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '2rem'
  },
  
  modalTitle: {
    color: '#2d3748',
    fontSize: '1.5rem',
    fontWeight: '700',
    margin: 0
  },
  
  closeBtn: {
    background: 'none',
    border: 'none',
    fontSize: '1.5rem',
    cursor: 'pointer',
    color: '#a0aec0',
    padding: '0.25rem'
  },
  
  authForm: {
    display: 'flex',
    flexDirection: 'column',
    gap: '1rem',
    marginBottom: '1.5rem'
  },
  
  authSubmitBtn: {
    background: 'linear-gradient(135deg, #4c63d2, #5a67d8)',
    color: 'white',
    border: 'none',
    padding: '1rem',
    borderRadius: '12px',
    fontSize: '1.1rem',
    fontWeight: '600',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
    boxShadow: '0 4px 15px rgba(76, 99, 210, 0.3)'
  },
  
  authSwitch: {
    textAlign: 'center',
    color: '#666'
  },
  
  switchBtn: {
    background: 'none',
    border: 'none',
    color: '#4c63d2',
    cursor: 'pointer',
    fontWeight: '600',
    textDecoration: 'underline'
  }
}