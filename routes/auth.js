var express = require('express');
var router = express.Router();
var passport = require('passport');
var Account = require('../models/accounts');

// Registering Users
router.route('/register')
  .get(function (req, res, next) {
    res.render('register', {});
  })
  .post(function (req, res, next) {
    Account.register(new Account({ username: req.body.username }),
      req.body.password,
      function(err, account) {
        if(err) {
          return res.render('register', { account: account });
        }

        req.login(account, function(err) {
          res.redirect('/contacts');
        });
      }
    );
  });

// Log in
router.get('/login', function(req, res, next) {
  res.render('login', { user: req.user });
});

router.post('/login', passport.authenticate('local'), function(req, res) {
  res.redirect('/contacts');
});

// Log out
router.all('/logout', function(req, res, next) {
  req.logout();
  res.redirect('/');
});


module.exports = router;
