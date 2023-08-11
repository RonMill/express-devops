const express = require('express')

const authContoller = require('../controller/authController')
const router = express.Router()

router.post('/signup', authContoller.signUp)
router.post('/login', authContoller.login)
router.post('/logout', authContoller.logout)

module.exports = router