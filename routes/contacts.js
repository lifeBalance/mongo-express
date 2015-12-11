var express = require('express');
var router = express.Router();
var _ = require('underscore');

// Data
var contacts = [
  {
    id: 1,
    name: 'Bob',
    job: 'Programmer',
    nickname: 'Bobby Wan Kenobi',
    email: 'robert@example.com'
  },
  {
    id: 2,
    name: 'Cindy',
    job: 'Designer',
    nickname: 'Ice princess',
    email: 'cindy@example.com'
  },
  {
    id: 3,
    name: 'Snoop Lion',
    job: 'Rapper',
    nickname: 'Snoop Doggy Dog',
    email: 'high@example.com'
  }
];

// Functions dealing with the data above
function lookupContact(contact_id) {
  return _.find(contacts, function (contact) {
    // Returns `true` when a user id matches the one received as a string.
    return contact.id == parseInt(contact_id);
  });
}
function findMaxId() {
  return _.max(contacts, function (contact) {
    return contact.id;
  });
}

/* GET list of contacts. */
router.get('/', function(req, res) {
  res.render('list', {contacts: contacts});
});

/* POST contacts. */
router.post('/', function(req, res) {
  // Id for a new contact
  var newContactId = findMaxId() + 1;
  // Getting the data from the form
  var newContact = {
    id: newContactId,
    name: req.body.fullname,
    job: req.body.job,
    nickname: req.body.nickname,
    email:  req.body.email
  };
  // Pushing the new contact into the contacts array.
  contacts.push(newContact);
  // Sending a "flash" message.
  res.send('New contact created with id: ' + newContact.id);
  // res.redirect('contacts');
});

/* GET Render a form for adding a contact. */
router.get('/add', function(req, res) {
  res.render('add', {contact: {}});
});

/* GET, POST, whatever.. to /contacts/contact_id */
router.route('/:contact_id')
  .all(function(req, res, next) {
    var contact_id = req.params.contact_id;
    next();
  })
  .get(function (req, res) {
    var contact_id = req.params.contact_id;
    var contact = lookupContact(contact_id);

    res.render('edit', {contact: contact});
  })
  .post(function (req, res) {
    var contact_id = req.params.contact_id;
    var contact = lookupContact(contact_id);
    // If the contact doesn't have any notes, create empty array to put them.
    if (!contact.notes) {
      contact.notes = [];
    }
    // And add the notes received in the request
    contact.notes.push({
      created: Date(),
      note: req.body.notes
    });
    // "Flash" message
    res.send('Note successfully created for contact: ' + contact.name);
  })
  .put(function (req, res) {
    var contact_id = req.params.contact_id;
    var contact = lookupContact(contact_id);

    contact.name = req.body.fullname;
    contact.job = req.body.job;
    contact.nickname = req.body.nickname;
    contact.email = req.body.email;

    // "Flash" message
    res.send('Contact: '+ contact.name +' successfully updated!');
  })
  .delete(function (req, res) {
    var contact_id = req.params.contact_id;
    var contact = lookupContact(contact_id);
    console.log('Successfully deleted contact with id:' + contact_id);
  });

module.exports = router;
