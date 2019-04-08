/**
 * Express login Router.
 *
 * @author Kristoffer Åberg
 * @version 1.0.0
 */

'use strict'

const router = require('express').Router()
const controller = require('../controllers/loginController')

// middleware
const redirectLogin = (req, res, next) => {
  if (req.session.userid) {
    req.session.flash = { type: 'danger', text: 'You are already logged in' }
    res.redirect('.')
  } else {
    next()
  }
}

// GET, POST
router
  .get('/', redirectLogin, controller.login)
  .post('/', redirectLogin, controller.loginUser)

module.exports = router
