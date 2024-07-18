const express = require('express')
const cors = require('cors')
const app = express()

app.use(express.json())
app.use(cors())

const PORT = process.env.PORT || 5000

app.get('/', (req, res) => {
  res.send('Server running')
})

app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`)
})
