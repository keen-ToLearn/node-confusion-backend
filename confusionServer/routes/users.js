var express = require('express');
const passport = require('passport');
var Users = require('../models/users');
const authenticate = require('../authenticate');
const cors = require('./cors');

var router = express.Router();

router.use(express.json());

/* GET users listing. */
router.get('/', cors.corsWithOptions, authenticate.verifyUser, authenticate.verifyAdmin, function(req, res, next) {
  Users.find({})
    .then(users => {
      res.statusCode = 200
      res.setHeader('Content-Type', 'application/json')
      res.json(users)
    },
    err => next(err))
    .catch(err => next(err))
});

router.post('/signup', cors.corsWithOptions, (req, res, next) => {
  Users.register(new Users({ username: req.body.username }), req.body.password)
    .then(user => {
      if(req.body.firstname)
        user.firstname = req.body.firstname
      if(req.body.lastname)
        user.lastname = req.body.lastname
      return user.save()
    },
    err => next(err))
    .then(user => {
      passport.authenticate('local')(req, res, () => {
        res.statusCode = 200
        res.setHeader('Content-Type', 'application/json')
        res.json({
          status: 'Registration successful',
          success: true
        })
      })
    })
    .catch(err => next(err))
})

router.post('/login', cors.corsWithOptions, passport.authenticate('local', { session: false }), (req, res) => {
  var token = authenticate.getToken({ _id: req.user._id })
  res.statusCode = 200
  res.setHeader('Content-Type', 'application/json')
  res.json({
    status: 'You are successfully logged in!',
    success: true,
    token: token
  })
})

router.get('/logout', cors.corsWithOptions, (req, res, next) => {
  if(req.session) {
    req.session.destroy()
    res.clearCookie('session-id')
    res.redirect('/')
  }
  else {
    var err = new Error('You are not logged in!')
    err.status = 403
    next(err)
  }
})

router.get('/facebook/token', passport.authenticate('facebook-token'), (req, res) => {
  if(req.user) {
    var token = authenticate.getToken({ _id: req.user._id })
    res.statusCode = 200
    res.setHeader('Content-Type', 'application/json')
    res.json({
      status: 'You are successfully logged in!',
      success: true,
      token: token
    })
  }
})

module.exports = router;
