# Wiring up MongoDB in our routers
Now that we have a connection and a model, we can start reading/writing contacts from/to the database. So let's open our `routes/contacts.js` file and, first of all, let's get rid of the hardcoded data and the 2 functions that access it.

## Listing contacts
Then we're gonna update the route that shows the list of contacts, so it gets them from the database:

```js
router.get('/', function(req, res) {
  Contact.find(function (err, contacts, count) {
    res.render('list', {contacts: contacts});
  });
});
```

If you start the server, you'll see there are no contacts shown, that's because the database is still empty. Next we'll take care of the route for creating a contact.

## Creating a contact
We have to update the route that handles contact creation so it looks like this:

```js
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
      // TODO: Send a "flash" message and redirect.
      res.send('New contact created');
      // res.redirect('/contacts');
    }
  });
});
```

## Updating a contact
Now let's take care of the `PUT` requests to `/contacts/:id` path, which will update users. This is the route:

```js
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
      // TODO: Send a "flash" message and redirect.
      res.send('Contact: '+ contact.name +' successfully updated!');
      // res.redirect('/contacts');
    }
  });
})
```

## Creating notes
We're using `POST` requests to `/contacts/:contact_id` to create **notes**. Let's modify the route so it makes use of Mongoose **models**:

```js
.post(function (req, res) {
  var contact_id = req.params.contact_id;

  Contact.findByIdAndUpdate(contact_id, {
    $push: {notes: {note: req.body.notes}}
  }, function (err, contact) {
    if (err) {
      res.status(400).send('Error saving new note: ' + err);
    } else {
      // TODO: Send a "flash" message and redirect.
      res.send(contact.note + '\'s note successfully created!');
      // res.redirect('/contacts');
    }
  });
})
```

To show the `postedDate` of the note in a nicer formate we can use of the [moment.js library][1]. We just have to install it:

```bash
$ npm i -S moment
```

Require it wherever we want to use it, in this case in our `contacts.js` route, and now we can use it in our templates. We have to modify two things:

* The router where we render the `edit` form:

```js
.get(function (req, res) {
  var contact_id = req.params.contact_id;

  Contact.findById(contact_id, function (err, c) {
    res.render('edit', {contact: c, moment: moment});
  });
})
```

* The `edit.jade` template where the `postedDate` field is shown:

```
dt= moment(note.postedDate).fromNow()
```

## Deleting a contact
To delete a contact we have to find it and remove it, but first we have to remove the **notes** associated with that contact:

```js
.delete(function (req, res) {
  var contact_id = req.params.contact_id;

  Contact.findById(contact_id, function (err, contact) {
    if (err) {
      res.status(500).send('Error deleting '+ contact.name + ':' + err);
    } else {
      contact.notes.remove();
      contact.remove();

      // TODO: Send a "flash" message and redirect.
      res.send('Contact: '+ contact.name +' successfully deleted!');
      console.log('Contact: '+ contact.name +' successfully deleted!');
      // res.redirect('/contacts');
    }
  });
});
```

- [ ] Fix flash messages.

That's all for this section. Check out the `v0.7` tag of the project to see how's it going so far:

```
$ git checkout tags/v0.7
```

---
[:arrow_backward:][back] ║ [:house:][home] ║ [:arrow_forward:][next]

<!-- navigation -->
[home]: ../README.md
[back]: database.md
[next]: authentication.md

<!-- links -->
[1]: http://momentjs.com/
