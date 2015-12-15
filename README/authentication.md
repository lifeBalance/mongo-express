# Authentication
Authentication allows us to restrict access to our web-app to people that have logged in (aka signed in). In order to log in, we may require users to register in our database using a username and a password, or use a system that allows them to use the same credentials they use on other social apps such as Facebook, Twitter or even Github.

Even though we could roll up our own authentication system, is preferable to use a reliable third party module. In this case we have chosen a well known module named [Passport][1], for several reasons:

* It supports more than 300 **authentication strategies**, including:

  * Local authentication using User name and password, which is the most widely used way for websites to authenticate users.
  * Delegated authentication using [Oauth/Oauth 2.0][2], which allows users to log in using social media accounts such as Facebook or Twitter.
  * Federated authentication using [OpenID][3].

* It is a well documented and open source project working since 2011.

## Installing requirements
To start using Passport we need to take care of a couple more details:

* Our app needs to support persistent login **sessions** (recommended, but not required), and the [express-session][4] package will take care of that. In older versions of [Express][0] session support was built-in, but in recent versions it has been moved to its own module, so that it can be updated separately.
* We need to choose an authentication strategy, we'll start with saving a user name and password to our database. So the [passport-local][5] and [passport-local-mongoose][6] packages will come in handy.

```bash
$ npm i -S express-session passport passport-local passport-local-mongoose
```

Now, in our main file, `app.js` we'll require:

```js
var session = require('express-session');
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var passportLocalMongoose = require('passport-local-mongoose');
```
## Configuring our session middleware
Then, we are going to to make use of the session middleware, so right below the `cookieParser` we'll add:

```js
app.use(session({
  secret: 'grumpy cat',
  resave: true,
  saveUninitialized: false
}));
```
The session middleware is configured through an options object which in this case has 3 properties:

* A `secret` string which must be **unique** since it's used to help encrypting sessions. Needless to say that this secret string must be kept private and not committed to version control.
* The `resave` property is set to `true` what means that the session is forced to be saved back to the session store for each requested page, even if the session was never modified during the request.
* We have set `saveUnitialized` to `false`, what means that we won't be storing brand new sessions, what is useful since the law requires us to ask the user for permission before setting a cookie.

> Since version **1.5.0**, the `cookie-parser` middleware no longer needs to be used for this module to work. This module now directly reads and writes cookies on req/res. Using `cookie-parser` may result in issues if the `secret` is not the same between this module and `cookie-parser`.

## Configuring passport
We are going to include the passport middleware right below the one for static files:

```js
app.use(passport.initialize());
app.use(passport.session());

var Account = require('./models/accounts');
passport.use(Account.createStrategy());

passport.serializeUser(Account.serializeUser());
passport.deserializeUser(Account.deserializeUser());
```

* First we have initialize it and then enable session support.
* Then we require the model we're gonna use in our **local strategy**. Strategies require what is known as a **verify callback**, which purpose is to find the user that possesses a set of credentials. When Passport authenticates a request, it parses the credentials contained in the request. It then invokes the verify callback with those credentials as arguments, in this case username and password. If the credentials are valid, the verify callback invokes `done` to supply Passport with the user that authenticated. We don't have to write the callback because the `passport-local-mongoose` package adds the `createStrategy()` helper method will take care of it. Note the method is called on the `Account` model, meaning that the method is added as a static method to our schema.
* In order for **persistent sessions** to work, the authenticated user must be serialized to the session, and deserialized when subsequent requests are made. Passport supports persistent login sessions but we must provide functions to Passport which implements the necessary serialization and deserialization logic. The `passport-local-mongoose` package also decorates the model with two more methods to serialize the `Account` object into the session, and deserialize it when needed.


## Defining a user profile model
We just saw how the `passport-local-mongoose` package decorates a model with several useful helper methods that simplifies building username and password login with Passport. Now we need to create the **schema** that will contain the data that users need for authentication. We have saved the following schema in the `account.js` file, inside the `models/` folder:

```js
var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var passportLocalMongoose = require('passport-local-mongoose');

var Account = new Schema({
  nickname: String,
  password: Date
});

Account.plugin(passportLocalMongoose);

module.exports = mongoose.model('Account', Account);
```

It's just a common Mongoose schema which contains two properties: `nickname` and `password`. After the `Account` schema is defined we plug in `passportLocalMongoose` which for starters, automatically takes care of salting and hashing the password. Read next to find out what are we passing in to the plugin.

### Customizing authentication options
As we said before, the **passport-local-mongoose** package takes care of the **verify callback** for us behind the scenes. This callback would return:

1. If authentication succeeds returns the user:
  ```
  return done(null, user);
  ```
2. If it fails returns `false`:
  ```
  return done(null, false);
  ```
3. Finally, if an exception occurred while verifying the credentials, done should be invoked with an error:
  ```
  return done(err);
  ```

Inside these return statements is where we would specify authentication options such as flash-messages such as:

```
return done(null, user, { message: 'Incorrect password.' });
```

But again, **passport-local-mongoose** is taking care of the **verify callback** for us, so if we need to pass in some options, we'll do it in the schema, when we plug in  `passportLocalMongoose`. Check [here][7] for the whole list of options we can pass.

## Routes for registering, and logging in/out
We need to define routes for:

* Registering.
* Log in.
* Log out.

These routes go in a separate file named `auth.js`, inside the `routes/` folder, so before anything let's require it in our main file:

```js
app.use('/auth/', auth);
```

### Registration
This is what the route for registering looks like:

```js
router.route('/register')
  .get(function (req, res, next) {
    res.render('register', {});
  })
  .post(function (req, res, next) {
    Account.register(new Account({ username: req.body.username }),
      req.body.password,
      function(err, account) {
        if(err) {
          return res.render('register', {account: account});
        }

        req.login(account, function(err) {
          res.redirect('/contacts');
        });
      }
    )
  });
```

Notice how we are logging in the user after its successful registration. This is done using the `login()` function on `req` (also aliased as `logIn()`).

### Logging in
The route for **logging in** has two parts:

* One for showing the log in form:

```js
router.get('/login', function(req, res, next) {
  res.render('login', { user: req.user });
});
```

* And another one for handling the `POST` request sent with the form:

```js
router.post('/login', passport.authenticate('local'), function(req, res) {
     res.redirect('/contacts');
 });
```

The `passport.authenticate()` middleware invokes `req.login()` automatically. When the login operation completes, user will be assigned to `req.user`.

* And finally, the route for **logging out**:
```js
router.get('/logout', function(req, res, next) {
  req.logout();
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

That's all for this section. Check out the `v0.7` tag of the project to see how's it going so far:

```
$ git checkout tags/v0.7
```

By the way, **passport-local-mongoose** already offers a default list of authentication error messages [here][8]
---
[:arrow_backward:][back] ║ [:house:][home] ║ [:arrow_forward:][next]

<!-- navigation -->
[home]: ../README.md
[back]: mongo-routes.md
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
