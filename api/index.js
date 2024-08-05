const express = require('express')
const app = express()
const cors = require('cors')
const helmet = require('helmet')
const connectDB = require('./config/db')
const errorMiddleware = require('./middlewares/errorMiddleware')
const path = require('path')
const cookieParser = require('cookie-parser')

require('dotenv').config()

connectDB()

app.use(express.json())
app.use(cors())
app.use(cookieParser())
app.use(helmet())

app.use('/api/auth', require('./routes/authRoutes'))

app.get('/api', (req, res) => {
  res.json({
    message: 'Server is ready',
  })
})
app.get('/api/hello/', (req, res) => {
  res.json({
    message: 'Hello World',
  })
})

app.use(errorMiddleware)

const PORT = process.env.PORT || 5000

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
