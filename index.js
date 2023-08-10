const express = require('express')
const mongoose = require('mongoose');
const { MONGO_USER, MONGO_PASSWORD, MONOG_IP, MONGO_PORT } = require('./config/config');

const postRouter = require('./routes/postRoutes')
const userRouter = require('./routes/userRoutes')

const app = express()

const mongoURL = `mongodb://${MONGO_USER}:${MONGO_PASSWORD}@${MONOG_IP}:${MONGO_PORT}/?authSource=admin`

const connectWithRetry = () => {
  mongoose.connect(mongoURL) //Da Mongo und Express im gleichen Netzwerk sind wird über DNS die IP zum Namen aufgelöst
    .then(() => {
      console.log("successfully connected to DB")
    })
    .catch((err) => {
      console.log(err)
      setTimeout(connectWithRetry, 5000)
    })

}

connectWithRetry()

app.use(express.json())

app.get('/', (req, res) => {
  res.send("<h2>Hi There</h2>")
});

app.use('/api/v1/posts', postRouter)
app.use('/api/v1/users', userRouter)

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`listen on port ${port}`))