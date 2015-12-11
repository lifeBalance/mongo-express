# Static templates
Next we're going to add the following templates:

* `list.jade`, a template for listing contacts.
* `add.jade`, a template for adding contacts.
* `edit.jade`, a template for editing contacts.
* `edit-form.jade`, a partial used in the above 2 templates.

## Listing contacts
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

## Adding a contact
We also have to add a new route for `GET` requests to `/contacts/add`:

```js
router.get('/add', function(req, res) {
  res.render('add', {});
});
```
This route will render the form for adding new contacts.

## Editing a contact
Let's modify the route that handles `GET` requests to `/contacts/:contact_id`. This route will render the form for editing a contact:

```js
.get(function (req, res) {
  res.render('edit', {});
})
```

## Try it out
Before trying it out, let's add a link in our index page that will take us to the `/contacts` path:

```jade
p
  a.btn.btn-default(href="/contacts/") View Contacts
```

Check out the `v0.3` tag of the project to see how's it going so far:

```bash
$ git checkout tags/v0.3
$ npm run dev
```

---
[:arrow_backward:][back] ║ [:house:][home] ║ [:arrow_forward:][next]

<!-- navigation -->
[home]: ../README.md
[back]: bootstrap.md
[next]: dynamic-templates.md

<!-- links -->
[1]: http://expressjs.com/en/index.html
[2]: https://github.com/lifeBalance/mongo-express/blob/v0.1/routes/contacts.js
[3]: https://github.com/remy/nodemon
