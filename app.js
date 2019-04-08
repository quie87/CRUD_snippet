'use strict'

const express = require('express')
const session = require('express-session')
const exphbs = require('express-handlebars')
const path = require('path')
const bodyParser = require('body-parser')
const mongoose = require('./config/mongoose.js')
const logger = require('morgan')
const helmet = require('helmet')

const port = process.env.PORT || 3000
const SESS_NAME = 'sid'
const SESS_SECRETE = 'Hejsanhoppsan'

// Connect to the database.
mongoose.run().catch(error => {
  console.error(error)
  process.exit(1)
})

// initiate expree
const app = express()

// Put the helmet on
app.use(helmet())

app.use(helmet.contentSecurityPolicy({
  directives: {
    defaultSrc: ["'self'"],
    fontSrc: ["'self'"],
    styleSrc: ["'self'", "'unsafe-inline'", 'maxcdn.bootstrapcdn.com/bootstrap/4.0.0/css/bootstrap.min.css'],
    scriptSrc: ["'self'", 'code.jquery.com/jquery-3.2.1.slim.min.js', 'cdnjs.cloudflare.com/ajax/libs/popper.js/1.12.9/umd/popper.min.js',
      'https://maxcdn.bootstrapcdn.com/bootstrap/4.0.0/js/bootstrap.min.js', 'https://use.fontawesome.com/releases/v5.0.6/js/all.js']
  }
}))

// Setup view engine
app.engine('hbs', exphbs({
  extname: '.hbs',
  defaultLayout: 'main'
}))

app.set('view engine', 'hbs')

// Middleware
app.use(logger('dev'))
app.use(bodyParser.urlencoded({ extended: true }))
app.use(express.static(path.join(__dirname, 'public')))

// Setup session store with the given options.
const sessionOptions = {
  name: SESS_NAME,
  secret: SESS_SECRETE,
  resave: false,
  saveUninitialized: false,
  cookie: {
    httpOnly: true,
    maxAge: 1000 * 60 * 60 * 24,
    sameSite: 'lax'
  }
}

app.use(session(sessionOptions))

// additional middleware to be executed before the routes
app.use((req, res, next) => {
  res.locals.flash = req.session.flash
  delete req.session.flash

  next()
})

app.use((req, res, next) => {
  if (req.session && req.session.userid) {
    res.session = { userid: req.session.userid }
    res.locals.userid = req.session.userid
  }
  next()
})

// Define routs
app.use('/', require('./routes/homeRoutes'))
app.use('/snippets', require('./routes/snippetRoutes'))
app.use('/register', require('./routes/registerRoutes'))
app.use('/login', require('./routes/loginRoutes'))

// Error handling
app.use((req, res, next) => {
  res.status(404)
  res.sendFile(path.join(__dirname, 'views', 'error', '404.html'))
})

// 403 forbidden or 500
app.use((err, req, res, next) => {
  if (err.message === '403') {
    res.status(403)
    res.sendFile(path.join(__dirname, 'views', 'error', '403.html'))
  } else {
    res.status(err.status || 500)
    res.send(err.message || 'internal Server Error')
  }
})
// Starts server
app.listen(port, () => {
  console.log(`Server running on port ${port}`)
  console.log('Press Ctrl-C to terminate...\n')
})
