const express = require('express')
const cors = require('cors')
const dotEnv = require('dotenv')

// app
const app = express()
const port = process.env.PORT || 5000
dotEnv.config()

// middleware
app.use(express.json())
app.use(cors())

// route
app.get('/', (req, res) => {
  res.send('Big Store Server Runing')
})

// server
app.listen(port, () => {
  console.log(`all ok server running http://localhost:${port}`)
})
