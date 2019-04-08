/**
 * Express login Controller.
 *
 * @author Kristoffer Åberg
 * @version 1.0.0
 */

'use strict'

const users = require('../models/user')
const loginController = {}

/**
 * Index GET
 */
loginController.login = (req, res, next) => res.render('login/index')

/**
 * Login POST
 */
loginController.loginUser = async (req, res, next) => {
  try {
    let user = await users.findOne({ 'email': req.body.email })
    if (!user) {
      req.session.flash = { type: 'danger', text: 'Wrong user name or password' }
      res.redirect('./login')
    }

    let result = await user.comparePassword(req.body.password)

    if (result) {
      req.session.flash = { type: 'success', text: 'You are logged in.' }
      req.session.userid = user._id
      req.session.author = user.name

      res.redirect('/')
    } else {
      req.session.flash = { type: 'danger', text: 'Wrong user name or password' }
      res.redirect('./login')
    }
  } catch (error) {
    req.session.flash = { type: 'danger', text: error.message }
    res.redirect('./login')
  }
}
// Exports.
module.exports = loginController
