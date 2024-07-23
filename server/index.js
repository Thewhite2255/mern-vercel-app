const express = require('express')
const cors = require('cors')
const helmet = require('helmet')

const app = express()

app.use(express.json())
app.use(cors())

const PORT = process.env.PORT || 5000

app.use(helmet())

app.get('/api/hello/', (req, res) => {
  res.json({
    message: 'Hello World',
  })
})

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
