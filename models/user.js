/**
 * Mongoose model userSchema.
 *
 * @author Kristoffer Åberg
 * @version 1.0.0
 */

'use strict'
const mongoose = require('mongoose')
mongoose.set('useCreateIndex', true)

const bcrypt = require('bcrypt')

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    lowercase: true,
    required: true,
    unique: false,
    match: [/^[a-zA-Z0-9]+$/]
  },
  email: {
    type: String,
    lowercase: true,
    required: true,
    unique: true,
    match: [/\S+@\S+\.\S+/]
  },
  password: {
    type: String,
    required: true
  }
}, {
  timestamps: true
})

// Hash password
userSchema.pre('save', async function (next) {
  let user = this

  if (user.isModified('password') || user.isNew) {
    let hashPwd = await bcrypt.hash(user.password, 12)
    user.password = hashPwd
  }

  next()
})

// Crypt password with bcrypt
userSchema.methods.comparePassword = function (candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password)
}

const User = mongoose.model('user', userSchema)

module.exports = User
