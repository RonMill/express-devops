const express = require('express')
const mongoose = require('mongoose');

const session = require('express-session');
const redis = require('redis')
const connectRedis = require('connect-redis')


const { MONGO_USER, MONGO_PASSWORD, MONOG_IP, MONGO_PORT, REDIS_URL, REDIS_PORT, SESSION_SECRET } = require('./config/config');

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



const RedisStore = connectRedis(session)

const redisClient = redis.createClient({
  host: REDIS_URL,
  port: REDIS_PORT
})
redisClient.on('error', function (err) {
  console.log('Could not establish a connection with redis. ' + err);
});
redisClient.on('connect', function (err) {
  console.log('Connected to redis successfully');
});

app.use(session({
  store: new RedisStore({ client: redisClient }),
  secret: SESSION_SECRET,
  resave: false,
  saveUninitialized: true,
  cookie: {
      secure: false, // if true only transmit cookie over https
      httpOnly: true, // if true prevent client side JS from reading the cookie 
      maxAge: 50000 // session max age in miliseconds
  }
}))

app.use(express.json())

app.get('/', (req, res) => {
  res.send("<h2>Hi There</h2>")
});

app.use('/api/v1/posts', postRouter)
app.use('/api/v1/users', userRouter)

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`listen on port ${port}`))