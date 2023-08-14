const User = require('../models/userModel')
const bcrypt = require('bcryptjs')

exports.signUp = async (req, res, next) => {
  const { username, password } = req.body
  try {
    const hashpassword = await bcrypt.hash(password, 12)
    const newUser = await User.create({
      username: username,
      password: hashpassword
    })
    req.session.user = newUser
    res.status(200).json({
      status: 'success',
      data: {
        user: newUser
      }
    })
  } catch (err) {
    res.status(400).json({
      status: 'fail'
    })
  }
}

exports.login = async (req, res) => {
  const sess = req.session;
  const { username, password } = req.body
  try {
    const user = await User.findOne({ username })
    if (!user) {
      return res.status(404).json({
        status: 'fail',
        message: 'User not found'
      })
    }
    const isCorrect = await bcrypt.compare(password, user.password)
    if (isCorrect) {
      //if login success save userdata in session 
      req.session.user = user
      res.status(200).json({
        status: 'success'
      })
    } else {
      res.status(400).json({
        status: 'fail',
        message: 'incorrect username or password'
      })
    }
  } catch (err) {
    res.status(400).json({
      status: 'fail'
    })
  }
}

exports.logout = async (req, res) =>{
  req.session.destroy(err =>{
    if(err){
      return console.log(err)
    }
    res.status(200).json({
      status: 'success'
    })
  })
}