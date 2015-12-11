# mongo-express

## Setup
1. Install:

  * Node.js
  * Express.js
  * Express generator

2. Generate the project and install dependencies:

  ```
  $ express mongo-express
    ...
    install dependencies:
      $ cd mongo-express && npm install

    run the app:
      $ DEBUG=mongo-express:* npm start
  ```
  When the generator finishes, the bottom of the output shows instructions about what to do next. Before installing the dependencies, I'm gonna add a line to the `scripts` section in my `package.json` file:

  ```
  "scripts": {
    "start": "node ./bin/www",
    "debug": "DEBUG=mongo-express:* npm start"
  },
  ```

  That way I don't have to remember that long command for debugging my app, just have to run `npm run debug`. Then, let's install the dependencies:

  ```
  $ cd mongo-express && npm install
  ```

3. And set up version control of of course:

  ```
  $ git init
  $ echo 'node_modules/' >> .gitignore
  $ git add .
  $ git commit -m 'Initial commit'
  ```

## Install additional packages
Let's install as `devDependencies` all the testing stuff:

* chai
* karma
* mocha
* sinon
* supertest

And as normal `dependencies`:

* express-session
* mongoose
* passport

And git it up:

```
$ git add .
$ git commit -m 'Add a bunch of modules'
```

## Routes
Since we're not gonna use it, let's rename the `users.js` route file to `contacts.js`, as well as the lines in `app.js` where is required  and  used:

```js
...
var users = require('./routes/contacts');
...
app.use('/contacts/', users);
...
```

Check the source of `routes/contacts.js` to see the changes.

We have to restart our app to see the new route working. Let's install nodemon to avoid all that hassle in the future:

```
$ npm i -D nodemon
```

And add yet another line at the end of the `scripts` section in our `package.json` file:

```json
"scripts": {
  "start": "node ./bin/www",
  "debug": "DEBUG=mongo-express:* npm start",
  "dev": "nodemon ./bin/www"
},
```

From now on, I'll just have to run `npm run dev` to start nodemon. Check out the `v0.1` tag of the project to see how's it going so far:

```
$ git checkout tags/v0.1
$ npm run dev
```

## Install Bootstrap Sass
To make use of the Sass version of Bootstrap we're going to need a couple of things:

* The Bootstrap framework itself (Sass version).
* The `node-sass-middleware` package.

### Bootstrap
Here we're going to integrate Bootstrap into the app. For that we're going to copy the sass, javascripts and font files into our express app. At the end of the process this is what our `public/` directory should look like:

```
public
├── fonts
│   └── bootstrap/
├── javascripts
│   └── bootstrap.js
└── stylesheets
    ├── _bootstrap.scss
    ├── app.css
    └── bootstrap/
```

Let's start with the sass files.

#### Sass files
1. Create a folder in the root of your project named `sass`.
2. Unzip the Bootstrap folder and browse to `assets/stylesheets` directory. Copy the `bootstrap` folder and the `_bootstrap.scss` file, and paste them inside the `sass` folder created above.
3. Create a new file in your `sass` folder named `app.scss`. Here is where we'll add our own custom styles. Don't forget to import the `_bootstrap.scss` there, adding the line:

  ```css
  @import 'bootstrap';
  ```
#### JavaScript file
From the Bootstrap unzipped folder, open the `assets/javascripts` directory, copy the `bootstrap.js` file, and paste it into our express app folder, inside `public/javascripts`. Done.

#### Bootstrap icon fonts
From the Bootstrap unzipped folder, go to the `assets/` directory, copy the whole `fonts` folder, and paste it into our express app `public/` folder. Done.

### The node-sass-middleware package
Let's add it to our dependencies with:

```bash
$ npm i -S node-sass-middleware
```

Now let's configure our app to make use of the package. Start requiring it at the top:

```js
var sassMiddleware = require('node-sass-middleware');
```

And add the following configuration to the middleware:

```js
app.use(sassMiddleware({
    /* Options */
    src: path.join(__dirname, 'sass'),
    dest: path.join(__dirname, 'public/stylesheets'),
    debug: true,
    outputStyle: 'compressed',
    prefix:  '/stylesheets'  // <link rel="stylesheets" href="stylesheets/app.css"/>
}));
```

That should be enough. Next we'll take care of the templates and see how the Bootstrap styles are working.

### Modifying the layout
In our `layout.jade` file, we've added a `link` tag for our stylesheet, and a couple of `script` tags for the `bootstrap.js` file, and another one for jQuery. Check its source code [here][1].

This is what we have in our `index.jade`:

```
extends layout

block content
  .jumbotron
    h1= title
    p Welcome to #{title}
      span(class="glyphicon glyphicon-thumbs-up" aria-hidden="true")
```
A div with the `.jumbotron` class and a glyphicon should be enough to check everything is working properly.

Check out the `v0.2` tag of the project to see how's it going so far:

```
$ git checkout tags/v0.2
$ npm run dev
```

## Adding new templates
Next we're going to add the following templates:

* `list.jade`, a template for listing contacts.
* `add.jade`, a template for adding contacts.
* `edit.jade`, a template for editing contacts.
* `edit-form.jade`, a partial used in the above 2 templates.

### Listing contacts
Now we have to modify the route `contacts.js` to render these templates. For example, this is what the route for **listing contacts** looks like:

```js
router.get('/', function(req, res) {
  res.render('list', {});
});
```

Note that we are using the `render` method which takes to arguments:

1. The name of the template passed as a string (no `.jade` extension needed.)
2. An object that serves as a **data context**, meaning the data we are passing to be rendered in the template. (In this case we're not passing any data, so the object is empty)

The route defined  above handles `GET` requests to the `/contacts` path.

### Adding a contact
We also have to add a new route for `GET` requests to `/contacts/add`:

```js
router.get('/add', function(req, res) {
  res.render('add', {});
});
```
This route will render the form for adding new contacts.

### Editing a contact
Let's modify the route that handles `GET` requests to `/contacts/:contact_id`. This route will render the form for editing a contact:

```js
.get(function (req, res) {
  res.render('edit', {});
})
```

### Try it out
Before trying it out, let's add a link in our index page that will take us to the `/contacts` path:
```
p
  a.btn.btn-default(href="/contacts/") View Contacts
```

Check out the `v0.3` tag of the project to see how's it going so far:

```
$ git checkout tags/v0.3
$ npm run dev
```

## Dynamic data
So far we've been showing static data in our templates, now it's time to make them dynamic. Ideally we'd do this using a database, but we're going to start using harcoded data, meaning a list of JavaScript objects at the top our `contacts.js` route file:

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

```
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

```
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

```
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

```
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
```
.delete(function (req, res) {
  var contact_id = req.params.contact_id;
  var contact = lookupContact(contact_id);
  console.log('Successfully deleted contact with id:' + contact_id);
});
```

> Note that we are not really deleting the contacts, since these are harcoded in your `contacts.js` file, so when you refresh the page, they will come back.

That's all for this section. Check out the `v0.4` tag of the project to see how's it going so far:

```
$ git checkout tags/v0.4
$ npm run dev
```

[1]: https://github.com/lifeBalance/mongo-express/blob/v0.2/views/layout.jade
