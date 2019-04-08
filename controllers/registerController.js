/**
 * Register Controller.
 *
 * @author Kristoffer Åberg
 * @version 1.0.0
 */

'use strict'

const User = require('../models/user')

const registerController = {}

/**
 * Index GET
 */
registerController.register = (req, res, next) => res.render('register/index')

/**
 * Register POST
 */
registerController.registerUser = async (req, res) => {
  try {
    const user = new User({
      name: req.body.name,
      email: req.body.email,
      password: req.body.password
    })

    await user.save()

    req.session.flash = { type: 'success', text: 'User was successfully created.' }
    res.redirect('/login')
  } catch (error) {
    req.session.flash = { type: 'danger', text: 'User already exists' }
    res.redirect('/register')
  }
}
// Exports.
module.exports = registerController
