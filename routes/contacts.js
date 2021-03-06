var express = require('express');
var router = express.Router();
var _ = require('underscore');
var moment = require('moment');
var Contact = require('../models/contacts');

/* Restricting access to non logged in users */
router.use(function (req, res, next) {
  if (!req.user) {
    res.redirect('/');
  }
  next();
});

/* GET to `/contacts` (Show list of contacts) */
router.get('/', function(req, res) {
  Contact.find(function (err, contacts, count) {

    res.render('list', {
      contacts: contacts,
      user: req.user,
      message: req.flash('success') || req.flash('error')
    });
  });
});

/* POST `/contacts` (Adds a contact) */
router.post('/', function(req, res) {
  new Contact({
    name: req.body.fullname,
    job: req.body.job,
    nickname: req.body.nickname,
    email:  req.body.email
  }).save(function (err, contacts, count) {
    if (err) {
      res.status().send('Error saving new contact: ' + err);
    } else {
      // Send a "flash" message and redirect.
      req.flash('success', 'New contact created');
      res.redirect('/contacts');
    }
  });
});

/* GET Render a form for adding a contact. */
router.get('/add', function(req, res) {
  res.render('add', {
    contact: {},
    user: req.user
  });
});


/* GET, POST, whatever.. to /contacts/contact_id */
router.route('/:contact_id')
  // .all(function(req, res, next) {
  //   var contact_id = req.params.contact_id;
  //   var contact = {};
  //   Contact.findById(contact_id, function (err, c) {
  //     contact = c;
  //     next();
  //   });
  // })
  .get(function (req, res) {
    var contact_id = req.params.contact_id;

    Contact.findById(contact_id, function (err, c) {
      res.render('edit', {
        user: req.user,
        contact: c,
        moment: moment
      });
    });

  })
  .post(function (req, res) {
    var contact_id = req.params.contact_id;

    Contact.findByIdAndUpdate(contact_id, {
      $push: {
        notes: {
          note: req.body.notes
        }
      }
    }, function (err, contact) {
      if (err) {
        res.status(400).send('Error saving new note: ' + err);
      } else {
        // Send a "flash" message and redirect.
        req.flash('success', contact.note + '\'s note successfully created!');
        res.redirect('/contacts');
      }
    });
  })
  .put(function (req, res) {
    var contact_id = req.params.contact_id;

    Contact.findByIdAndUpdate(contact_id, {
      name: req.body.fullname,
      job: req.body.job,
      nickname: req.body.nickname,
      email: req.body.email
    }, function (err, contact) {
      if (err) {
        res.status(400).send('Error saving new contact: ' + err);
      } else {
        // Send a "flash" message and redirect.
        req.flash('success', 'Contact: '+ contact.name +' successfully updated!');
        res.redirect('/contacts');
      }
    });
  })
  .delete(function (req, res) {
    var contact_id = req.params.contact_id;

    Contact.findById(contact_id, function (err, contact) {
      if (err) {
        res.status(500).send('Error deleting '+ contact.name + ':' + err);
      } else {
        contact.notes.remove();
        contact.remove();

        // Send a "flash" message and redirect.
        // req.flash('success', 'Contact: '+ contact.name +' successfully deleted!');
        // res.redirect('/contacts');
      }
    });
  });

module.exports = router;
