/**
 * Express Register Router.
 *
 * @author Kristoffer Åberg
 * @version 1.0.0
 */

'use strict'

const router = require('express').Router()
const controller = require('../controllers/registerController')

// Middleware
const redirectHome = (req, res, next) => {
  if (req.session.userid) {
    req.session.flash = { type: 'danger', text: 'You are already logged in' }
    res.redirect('.')
  } else {
    next()
  }
}

// GET, POST
router
  .get('/', redirectHome, controller.register)
  .post('/', redirectHome, controller.registerUser)

module.exports = router
