var express = require('express');
var router = express.Router();
var passport = require('passport');
var Account = require('../models/accounts');

// Registering Users
router.route('/register')
  .get(function (req, res) {
    res.render('register', {});
  })
  .post(function (req, res) {
    Account.register(new Account({ username: req.body.username }),
      req.body.password,
      function(err, account) {
        if(err) {
          // User didn't fill the username or password fields
          if (req.body.username === '' || req.body.password === '') {
            req.flash('error', 'You must fill a username and password!');

            return res.render('register', {
              message: req.flash('error')
            });
          } else {
            req.flash('error', 'Username already exists!');

            return res.render('register', {
              message: req.flash('error')
            });
          }
        }

        req.login(account, function(err) {
          req.flash('success', 'Successfully registered.');
          res.redirect('/contacts');
        });
      }
    );
  });

// Log in
router.get('/login', function(req, res) {
  res.render('login', {
    user: req.user,
    message: req.flash('error')
  });
});

router.post('/login',
  passport.authenticate('local', {
    successRedirect: '/contacts',
    failureRedirect: '/auth/login',
    successFlash: 'Successfully logged in!',
    failureFlash: true
  }),
  function(req, res) {
    res.redirect('/contacts');
  });

// Log out
router.get('/logout', function(req, res) {
  req.logout();
  req.flash('success', 'Successfully logged out.');
  res.redirect('/');
});


module.exports = router;
