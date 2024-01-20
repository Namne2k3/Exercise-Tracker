const express = require('express')
const app = express()
const cors = require('cors')
const mongoose = require('mongoose')
const { UserRouter } = require('./controllers')

// configs
require('dotenv').config()
app.use(cors())
app.use(express.static('public'))
app.get('/', (req, res) => {
  res.sendFile(__dirname + '/views/index.html')
});
app.use(express.json())
app.use(express.urlencoded({ extended: true }))


// connectDB
async function connectDB() {
  try {
    const res = await mongoose.connect(process.env.MONGO_URI);
    if (res) {
      console.log("Connected to Database")
    }
  } catch (error) {
    console.log(error);
  }
}

// middlewares


// routes
app.use('/api/users', UserRouter)


// listener
const listener = app.listen(process.env.PORT || 3000, async () => {
  await connectDB();
  console.log('Your app is listening on port ' + listener.address().port)
})
