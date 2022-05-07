const express = require('express')
const cors = require('cors')
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb')
const dotEnv = require('dotenv')

// app
const app = express()
const port = process.env.PORT || 5000
dotEnv.config()

// middleware
app.use(express.json())
app.use(cors())

// dataBase

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.ydiek.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`

const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverApi: ServerApiVersion.v1,
})

const bigStoreServer = async () => {
  try {
    await client.connect()
    const productCollection = client.db('inventory').collection('product')

    app.get('/products-home', async (req, res) => {
      const query = {}
      const curser = productCollection.find(query)
      const product = await curser.limit(6).toArray()

      res.send(product)
    })

    app.get('/inventory/:id', async (req, res) => {
      const id = ObjectId(req.params.id)
      const query = { _id: id }
      const product = await productCollection.findOne(query)

      res.send(product)
    })
  } finally {
    console.log('db connect')
  }
}

bigStoreServer().catch(console.dir)

// route
app.get('/', (req, res) => {
  res.send('Big Store Server Runing')
})

// server
app.listen(port, () => {
  console.log(`all ok server running http://localhost:${port}`)
})
