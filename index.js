const express = require('express')
const cors = require('cors')
const jwt = require('jsonwebtoken')
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
    const blogsCollection = client.db('inventory').collection('blogs')
    const reviewsCollection = client.db('inventory').collection('reviews')

    // get all product
    app.get('/products', async (req, res) => {
      const query = {}
      const curser = productCollection.find(query)
      const products = await curser.toArray()

      res.send(products)
    })

    // add product on database
    app.post('/products', async (req, res) => {
      const productData = req.body
      const result = await productCollection.insertOne(productData)

      res.send(result)
    })

    // delete one product
    app.delete('/products/:id', async (req, res) => {
      const _id = ObjectId(req.params.id)
      const query = { _id }
      const result = await productCollection.deleteOne(query)

      res.send(result)
    })

    // get short product for home page
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

    // find user items
    app.get('/products/my-items', async (req, res) => {
      const email = req.query.email
      const query = { email }
      const curser = productCollection.find(query)
      const myItems = await curser.toArray()

      res.send(myItems)
    })

    // update quantity of product
    app.put('/inventory/:id', async (req, res) => {
      const id = ObjectId(req.params.id)
      const updatedQuantity = parseInt(req.body.quantity) - 1
      const filter = { _id: id }
      const options = { upsert: true }
      const updatedDoc = {
        $set: {
          quantity: updatedQuantity,
        },
      }

      const result = await productCollection.updateOne(
        filter,
        updatedDoc,
        options,
      )

      res.send(result)
    })

    app.post('/inventory/:id', async (req, res) => {
      const id = ObjectId(req.params.id)
      const { currentQuantity, stockToAdd } = req.body
      const finalQuantity = currentQuantity + stockToAdd
      const filter = { _id: id }
      const options = { upsert: true }
      const updatedDoc = {
        $set: {
          quantity: finalQuantity,
        },
      }

      const result = await productCollection.updateOne(
        filter,
        updatedDoc,
        options,
      )

      res.send(result)
    })

    // get blogs
    app.get('/blogs', async (req, res) => {
      const query = {}
      const curser = blogsCollection.find(query)
      const myItems = await curser.toArray()

      res.send(myItems)
    })

    // get review
    app.get('/reviews', async (req, res) => {
      const query = {}
      const curser = reviewsCollection.find(query)
      const reviews = await curser.toArray()

      res.send(reviews)
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
