# Dynamic templates
So far we've been showing static data in our templates, now it's time to make them **dynamic**, meaning the information they contain is not gonna be hardcoded in the template, but we're gonna be pass it as **data contexts**. Ideally we'd do this using a database, but let's start using just a list of JavaScript objects at the top our `contacts.js` route file:

```js
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
```

This array of objects will get us going until we set up a database. To access this data we're going to use a couple of functions, but first of all let's install the **underscore** library, since we're going to be using it in our functions:

```bash
$ npm i -S underscore
```

And don't forget to require it at the top of our `app.js` file:

```js
var _ = require('underscore');
```

This is the function to look up a contact using its `id` field:
```js
function lookupContact(contact_id) {
  return _.find(contacts, function (contact) {
    // Returns `true` when a user id matches the one received as a string.
    return contact.id == parseInt(contact_id);
  });
}
```

The second will return the latest user in the list, meaning the one with the highest `id`:
```js
function findMaxId() {
  return _.max(contacts, function (contact) {
    return contact.id;
  });
}
```
### Listing users
Now we have to update our routes starting with the one that handles `POST` requests to `/contacts`:

```js
router.get('/', function(req, res) {
  res.render('list', {contacts: contacts});
});
```
In the data context object, note how we are passing the `contacts` array as the value of a property with the same name. Using this property in our templates we will be able or accessing all of the objects in the `contacts` array.

Now we have to update the `list.jade` template so it starts showing dynamic data:

```jade
tbody
  if !contacts.length
    tr
      td(colspan=4) You should add a contact.
  else
    each contact in contacts
      tr
        td
          input(type="checkbox", id="#{contact.id}")
        td
          a(href="/contacts/#{contact.id}")= contact.name
        td #{contact.job}
        td #{contact.nickname}
        td
          a(href="mailto:#{contact.email}") #{contact.email}
```

### Creating a new contact
Next let's take care of `POST` requests to `/contacts`:

```js
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
```

### Rendering the add contact form
This route doesn't need to pass any data to the view, but in order to be compatible with the edit form, so we'll just pass an empty object:

```js
router.get('/add', function(req, res) {
  res.render('add', {contact: {}});
});
```

### Rendering the edit form
Here we are just passing a `contact` object as the data context. Check it:

```js
.get(function (req, res) {
  var contact_id = req.params.contact_id;
  var contact = lookupContact(contact_id);

  res.render('edit', {contact: contact});
})
```

We have to take care of the `edit-form.jade` template though, and add `value` attributes to each of the input fields, so they show the information we are passing from the route:

```jade
.form-group
  label(for="fullname") Full name
  input#fullname.form-control(name="fullname", type="text", value="#{contact.name}")
.form-group
  label(for="job") Job
  input#job.form-control(name="job", type="text", value="#{contact.job}")
.form-group
  label(for="nickname") Nickname
  input#nickname.form-control(name="nickname", type="text", value="#{contact.nickname}")
.form-group
  label(for="email") Email
  input#email.form-control(name="email", type="email", value="#{contact.email}")
```

And also the `edit.jade` template. This template has 2 sections:

1. For editing contacts: it will send a `PUT` request to `contacts/:id?_method=put`.
2. For adding notes: it will send a `POST` request to `contacts/:id`.

```jade
extends layout

block content
  .row
    .col-md-6
      h1 Edit contact
      form(role="form", method="post", action="/contacts/#{contact.id}?_method=put")
        include edit-form
        button.btn.btn-primary(type="submit") Edit User
    .col-md-6
      h2 Add a Note
      form(role="form", method="post", action="/contacts/#{contact.id}")
        dl
          if contact.notes
            each note in contact.notes
              dt= note.created
              dt= note.note

        .form-group
          label(for="notes")
          textarea#notes.form-control(name="notes")
        button.btn.btn-default(type="submit", value="addNote") Add Note
```

Note how the `action` attributes have been updated to include the `id` we are passing in the data context.

Regarding the **edit contact** part of the form, we also have to take care of the `method` attribute, since we are trying to update a contact, we want to send a `PUT` request, but browsers don't handle those properly. The way around that is using `POST` but adding a hidden `_method=PUT` attribute. We need to add a module to our app to achieve that.

Install the [method-override][] package running:

```bash
$ npm i -S method-override
```

Require it in your `app.js` file:

```js
var methodOverride = require('method-override');
```

And finally add it to your middleware list, between `bodyParser` and `cookieParser`:

```js
...
app.use(methodOverride('_method'));
...
```

### Updating routes for editing contacts and adding notes
Lastly we're going to modify the route that handles `PUT` requests to `contacts/:id?_method=put`, to update the contact info. Check it:

```js
.put(function (req, res) {
  var contact_id = req.params.contact_id;
  var contact = lookupContact(contact_id);

  contact.name = req.params.name;
  contact.job = req.params.job;
  contact.nickname = req.params.nickname;
  contact.email = req.params.email;

  // "Flash" message
  res.send('Contact: '+ contact.name +' successfully updated!');
})
```

And also the route for `POST` requests to `/contacts/#{contact.id}`, for adding notes. This is it:

```js
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
```

Now everything is ready for updating contacts and adding notes.

### Deleting contacts
For deleting contacts we are going to use AJAX. For that purpose we have created an additional JavaScript file named `delete.js` and placed it in `public/javascripts`. This is what it looks like:

```js
$('#delete').on('click', function (e) {
  // Prevent submit
  e.preventDefault();

  // Selects all checkboxes that are checked
  $('input:checked').each(function (index, value) {
    var val = $(this).attr('id');
    console.log($(this));
    var $thisInput = $(this);

    $.ajax({
      url: '/contacts/' + val,
      type: 'DELETE'
    }).done(function () {
      $thisInput.parents('tr').remove;
    });

  });
});
```

Don't forget to add this script to the `layout.jade` file.

This is what the route looks like:
```js
.delete(function (req, res) {
  var contact_id = req.params.contact_id;
  var contact = lookupContact(contact_id);
  console.log('Successfully deleted contact with id:' + contact_id);
});
```

> Note that we are not really deleting the contacts, since these are hardcoded objects in our `contacts.js` file, so when we refresh the page, they will come back.

That's all for this section. Check out the `v0.4` tag of the project to see how's it going so far:

```
$ git checkout tags/v0.4
$ npm run dev
```

---
[:arrow_backward:][back] ║ [:house:][home] ║ [:arrow_forward:][next]

<!-- navigation -->
[home]: ../README.md
[back]: static-templates.md
[next]: README/#

<!-- links -->
[1]: http://expressjs.com/en/index.html
[2]: https://github.com/lifeBalance/mongo-express/blob/v0.1/routes/contacts.js
[3]: https://github.com/remy/nodemon
[4]: https://github.com/expressjs/method-override
