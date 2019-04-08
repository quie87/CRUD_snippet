/**
 * Snippet Controller.
 *
 * @author Kristoffer Åberg
 * @version 1.0.0
 */

'use strict'

const SnippetItem = require('../models/SnippetItem')

const snippetController = {}

/**
 * Index GET
 */
snippetController.index = async (req, res, next) => {
  try {
    const locals = {
      snippetItems: (await SnippetItem.find({}))
        .map(snippetItem => ({
          id: snippetItem._id,
          description: snippetItem.description,
          user: snippetItem.user,
          author: snippetItem.author,
          owner: snippetItem.user === req.session.userid
        }))
    }
    res.render('snippets/index', { locals })
  } catch (error) {
    next(error)
  }
}

/**
 * create GET
 */
snippetController.create = async (req, res, next) => res.render('snippets/create')

/**
 * create POST
 */
snippetController.createPost = async (req, res, next) => {
  try {
    const snippetItem = new SnippetItem({
      description: req.body.description,
      user: req.session.userid,
      author: req.session.author
    })

    await snippetItem.save()

    req.session.flash = { type: 'success', text: 'Snippet item was created successfully.' }
    res.redirect('.')
  } catch (error) {
    req.session.flash = { type: 'danger', text: error.message }
    res.redirect('./create')
  }
}

/**
 * edit GET
 */
snippetController.edit = async (req, res, next) => {
  try {
    const snippetItem = await SnippetItem.findOne({ _id: req.params.id })
    const locals = {
      id: snippetItem._id,
      description: snippetItem.description,
      user: snippetItem.user
    }

    res.render('snippets/edit', { locals })
  } catch (error) {
    req.session.flash = { type: 'danger', text: error.message }
    res.redirect('.')
  }
}

/**
 * edit POST
 */
snippetController.editPost = async (req, res, next) => {
  try {
    const result = await SnippetItem.updateOne({ _id: req.body.id }, {
      description: req.body.description
    })

    if (result.nModified === 1) {
      req.session.flash = { type: 'success', text: 'Snippet item was updated successfully.' }
    } else {
      req.session.flash = {
        type: 'success',
        text: 'No changes was made'
      }
    }
    res.redirect('.')
  } catch (error) {
    req.session.flash = { type: 'danger', text: error.message }
    res.redirect(`./edit/${req.body.id}`)
  }
}

/**
 * delete GET
 */
snippetController.delete = async (req, res, next) => {
  try {
    const snippetItem = await SnippetItem.findOne({ _id: req.params.id })
    const locals = {
      id: snippetItem._id,
      description: snippetItem.description,
      user: snippetItem.user
    }

    res.render('snippets/delete', { locals })
  } catch (error) {
    req.session.flash = { type: 'danger', text: error.message }
    res.redirect('.')
  }
}

/**
 * delete POST
 */
snippetController.deletePost = async (req, res, next) => {
  try {
    await SnippetItem.deleteOne({ _id: req.body.id })

    req.session.flash = { type: 'success', text: 'Snippet item was removed successfully.' }
    res.redirect('.')
  } catch (error) {
    req.session.flash = { type: 'danger', text: error.message }
    req.redirect(`./delete/${req.body.id}`)
  }
}

// Exports.
module.exports = snippetController
