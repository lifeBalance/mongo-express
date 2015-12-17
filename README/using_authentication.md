# Routes and views
We need to define routes for:

* Registering.
* Log in.
* Log out.

These routes will go in a separate file named `auth.js`, inside the `routes/` folder, so before anything let's require it in our main file:

```js
app.use('/auth/', auth);
```

### Registration
This is what the route for registering looks like:

```js
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
```

Notice how we are logging in the user after its successful registration. This is done using the `login()` function on `req` (also aliased as `logIn()`). When the registration form has not been filled we send back an error notification in a flash message. If it is successful we are also passing a flash message before redirecting.

### Logging in
The route for **logging in** has two parts:

* One for showing the log in form:

```js
router.get('/login', function(req, res) {
  res.render('login', {
    user: req.user,
    message: req.flash('error')
  });
});
```

Notice the presence of a flash message in the data we are passing to the `render` method.

* And another one for handling the `POST` request sent with the form:

```js
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
```

The `passport.authenticate()` middleware invokes `req.login()` automatically after a successful authentication. It takes two arguments:

* The authentication strategy, in this case `local`.
* An options object. The `failureFlash` is set to `true`, meaning that if there are any errors while authenticating, they will be passed as flash messages. By the way, **passport-local-mongoose** already offers a default list of authentication error messages [here][8]

> When the login operation completes, user will be assigned to `req.user`.

* And finally, the route for **logging out**:
```js
router.get('/logout', function(req, res) {
  req.logout();
  req.flash('success', 'Successfully logged out.');
  res.redirect('/');
});
```

Passport exposes a `logout()` function on `req` (also aliased as `logOut()`) that can be called from any route handler which needs to terminate a login session. Invoking `logout()` will remove the `req.user` property and clear the login session (if any).

### Middleware for restricting access
In our `routes/contact.js` file we need to create a small middleware function that restrict access to users that are not logged in. In other words, if a user is not logged in and tries to visit the `contacts` page, will be redirected to the `index` page:

```js
router.use(function (req, res, next) {
  if (!req.user) {
    res.redirect('/');
  }
  next();
});
```

In the condition inside the if statement we are checking if the `req.user` property is **empty**. If it is, it means the user is not logged in, and we redirect to the **root route**. Note that this small piece of middleware is key for restricting access, without it, authentication would still work but it would make no difference if a user is authenticated or not.

## Views
We are gonna start adding links to our `index.jade` template:

```
if (user)
  p You are logged in as #[b=user.username] (#[a(href="/auth/logout") logout])
else
  p #[a(href="/auth/login") Please login] or #[a(href="/auth/register") register]
```

These links are shown only if a user is not logged in, but how the template knows what a `user` is? It doesn't, we have to pass one as a property of object we are passing as the data context, so in our `index.js` route we'll pass :

```js
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express', user: req.user });
});
```

We have added a couple of templates for:

* Register.
* Logging in.

That's all for this section. Check out the `v0.8` tag of the project to see how's it going so far:

```
$ git checkout tags/v0.8
```

---
[:arrow_backward:][back] ║ [:house:][home] ║ [:arrow_forward:][next]

<!-- navigation -->
[home]: ../README.md
[back]: authentication.md
[next]: #

<!-- links -->
[0]: http://expressjs.com/en/index.html
[1]: http://passportjs.org/
[2]: http://oauth.net/
[3]: http://openid.net/
[4]: https://www.npmjs.com/package/express-session
[5]: https://www.npmjs.com/package/passport-local
[6]: https://www.npmjs.com/package/passport-local-mongoose
[7]: https://github.com/saintedlama/passport-local-mongoose#options
[8]: https://github.com/saintedlama/passport-local-mongoose#error-messages
