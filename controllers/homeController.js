/**
 * Home Controller.
 *
 * @author Kristoffer Åberg
 * @version 1.0.0
 */

'use strict'

const homeController = {}

/**
 * index GET
 */
homeController.index = (req, res, next) => res.render('home/index')

/**
 * logout POST
 */
homeController.logoutUser = (req, res) => {
  if (!req.session.userid) {
    res.redirect('/login')
  } else {
    req.session.destroy(err => {
      if (err) {
        return res.redirect('/')
      }
      res.clearCookie(req.session)
      res.redirect('/')
    })
  }
}
// Exports.
module.exports = homeController
