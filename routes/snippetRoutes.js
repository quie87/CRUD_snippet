/**
 * Express Snippet Router.
 *
 * @author Kristoffer Åberg
 * @version 1.0.0
 */

'use strict'

const router = require('express').Router()
const controller = require('../controllers/snippetController')
const SnippetItem = require('../models/SnippetItem')

// Middleware
const redirectRegister = (req, res, next) => {
  if (!req.session.userid) {
    throw new Error('403')
  } else {
    next()
  }
}

const redirectAuthenticated = async (req, res, next) => {
  try {
    const snippetItem = await SnippetItem.findOne({ _id: req.params.id })
    const locals = {
      user: snippetItem.user
    }

    if (locals.user !== req.session.userid) {
      req.session.flash = { type: 'danger', text: 'You can´t edit other users snippets' }
      res.redirect(`/snippets`)
    } else {
      next()
    }
  } catch (error) {
    req.session.flash = { type: 'danger', text: error.message }
    res.redirect('.')
  }
}

// get / index
router.get('/', controller.index)

// GET, POST /create
router.route('/create')
  .get(redirectRegister, controller.create)
  .post(redirectRegister, redirectAuthenticated, controller.createPost)

// GET, POST /edit
router.get('/edit/:id', redirectRegister, redirectAuthenticated, controller.edit)
router.post('/edit', redirectRegister, redirectAuthenticated, controller.editPost)

// GET, POST  /delete
router.get('/delete/:id', redirectRegister, redirectAuthenticated, controller.delete)
router.post('/delete', redirectRegister, redirectAuthenticated, controller.deletePost)

module.exports = router
