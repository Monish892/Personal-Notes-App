const express = require('express')
const jwt = require('jsonwebtoken')
const Note = require('../models/Note')
const router = express.Router()

function authMiddleware(req, res, next) {
  const token = req.headers.authorization?.split(' ')[1]
  if (!token) return res.status(401).json({ msg: 'No token' })

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET)
    req.user = decoded.id
    next()
  } catch {
    res.status(401).json({ msg: 'Invalid token' })
  }
}

router.use(authMiddleware)

router.get('/', async (req, res) => {
  const notes = await Note.find({ user: req.user })
  res.json(notes)
})

router.post('/', async (req, res) => {
  const { title, content } = req.body
  const note = await Note.create({ title, content, user: req.user })
  res.json(note)
})

router.put('/:id', async (req, res) => {
  const note = await Note.findOneAndUpdate(
    { _id: req.params.id, user: req.user },
    req.body,
    { new: true }
  )
  res.json(note)
})

router.delete('/:id', async (req, res) => {
  await Note.findOneAndDelete({ _id: req.params.id, user: req.user })
  res.json({ msg: 'Note deleted' })
})

module.exports = router
