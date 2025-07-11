require('dotenv').config()
const express = require('express')
const mongoose = require('mongoose')
const cors = require('cors')
const app = express()

app.use(cors({
  origin: 'https://personal-notes-app-1-vdlu.onrender.com',
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  credentials: true
}))
app.use(express.json())

mongoose.connect('mongodb+srv://grmonishs65:2007@asap-project.izf50.mongodb.net/notes')
.then(() => console.log('MongoDB connected'))
.catch((err) => console.error(err))

app.use('/api/auth', require('./routes/auth'))
app.use('/api/notes', require('./routes/note'))

const PORT = process.env.PORT || 5000
app.listen(PORT, () => console.log(`Server running on port ${PORT}`))
