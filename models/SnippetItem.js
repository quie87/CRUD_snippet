/**
 * Mongoose model snippetItem.
 *
 * @author Kristoffer Åberg
 * @version 1.0.0
 */

'use strict'

const mongoose = require('mongoose')

const snippetItemSchema = new mongoose.Schema({
  createdAt: {
    type: Date,
    required: true,
    default: Date.now
  },
  description: {
    type: String,
    required: true,
    trim: true,
    minlength: 1
  },
  user: {
    type: String
  },
  author: {
    type: String
  }
})

const SnippetItem = mongoose.model('snippetItem', snippetItemSchema)

module.exports = SnippetItem
