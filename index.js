const express = require('express')
const app = express()
const mongoose = require('mongoose');

mongoose.connect("mongodb://herbert:herbert@172.21.0.2:27017/?authSource=admin")
  .then(() => {
    console.log("successfully connected to DB")
  })
  .catch((err)=>{
    console.log(err)
  })


app.get('/', (req, res) => {
  res.send("<h2>Hi There</h2>")
});

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`listen on port ${port}`))