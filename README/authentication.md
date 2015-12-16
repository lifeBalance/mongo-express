# Authentication
Authentication allows us to restrict access to our web-app to people that have logged in (aka signed in). In order to log in, we may require users to register in our database using a username and a password, or use a system that allows them to use the same credentials they use on other social apps such as Facebook, Twitter or even Github.

Authentication is a big and important part in a serious web application. Although a bit difficult and a big responsibility, we could roll up our own authentication system, but most of the times is preferable to rely on a third party module. In this case we have chosen a well known module named [Passport][1], for several reasons:

* There's a wide community of users and developers behind it and constantly releasing updates that fix security issues or introduce new cool features.
* It supports more than 300 **authentication strategies**, including:

  * Local authentication using User name and password, which is the most widely used way for websites to authenticate users.
  * Delegated authentication using [Oauth/Oauth 2.0][2], which allows users to log in using social media accounts such as Facebook or Twitter.
  * Federated authentication using [OpenID][3].

* It is a well documented and open source project working since 2011.

## Installing and configuring
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

## Flash messages
Usually, when a user register, logs in, or authentication fails, she's usually redirected to another page. In those situations it's necessary to let the user know what's going on, otherwise would be confusing.

The way we send the user messages after important interactions is using flash messages. These messages are written to the **session** and cleared after being displayed to the user. The flash is typically used in combination with redirects, ensuring that the message is available to the next page that is to be rendered.

Passport supports these messages but it requires a `req.flash()` function. [Express][0] removed support for the flash messages in **version 3**, so in order to bring it back we need to use an external package, in this case [connect-flash][8]. To install it:

```bash
$ npm i -S connect-flash
```

Then, we have to require it at the top of our main file, and connect it to the middleware after the session one:

```js
var flash = require('connect-flash');
```

Remember that the flash messages are stored in the session, so don't forget to connect the flash middleware **after** the one for sessions:

```js
app.use(flash());
```

Now we are ready to use flash messages.

### Using flash messages
Since we haven't started using authentication yet, let's see how flash messages work when doing things not related to authentication. For example, when we create a contact:

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
      // Send a "flash" message and redirect.
      req.flash('success', 'New contact created');
      res.redirect('/contacts');
    }
  });
});
```

Check the last lines in the else statement, we are setting a success flash message. Now we need to pull it of when redirecting to contacts:

```js
router.get('/', function(req, res) {
  Contact.find(function (err, contacts, count) {

    res.render('list', {
      contacts: contacts,
      user: req.user,
      message: req.flash('success') || req.flash('error')
    });
  });
});
```

In the router that takes care of requests to `/contacts`, we pass to the `render` method an alternative flash message, either success or error.

Finally, in the `layout.jade` we print out the flash messages:

```
if message && message.length > 0
  div(class="alert alert-info alert-dismissible fade-in" role="alert")
    button.close(type="button" data-dismiss="alert" aria-label="Close")
      span(aria-hidden="true") &times;
    p= message
```

---
[:arrow_backward:][back] ║ [:house:][home] ║ [:arrow_forward:][next]

<!-- navigation -->
[home]: ../README.md
[back]: mongo-routes.md
[next]: using_authentication.md

<!-- links -->
[0]: http://expressjs.com/en/index.html
[1]: http://passportjs.org/
[2]: http://oauth.net/
[3]: http://openid.net/
[4]: https://www.npmjs.com/package/express-session
[5]: https://www.npmjs.com/package/passport-local
[6]: https://www.npmjs.com/package/passport-local-mongoose
[7]: https://github.com/saintedlama/passport-local-mongoose#options
[8]: https://github.com/jaredhanson/connect-flash
