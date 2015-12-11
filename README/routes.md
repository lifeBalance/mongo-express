# Routes
Since we're not gonna use it, let's rename the `users.js` route file to `contacts.js`, as well as the lines in `app.js` where is required  and  used:

```js
...
var users = require('./routes/contacts');
...
app.use('/contacts/', users);
...
```

Check the [source][2] of `routes/contacts.js` to see the changes. Basically these are gonna be the **endpoints** of our app:

HTTP Verbs  | Path               | Renders
------------|--------------------|-----------
GET         | /                  | index.jade
GET         | /contacts/         | list.jade
POST        | /contacts/         |  --
GET         | /contacts/add      | add.jade
GET         | /contacts/         | edit.jade
POST        | /contacts/         |  --
PUT         | /contacts/         |  --
DELETE      | /contacts/         |  --


We have to restart our app to see the new route working. Let's install [nodemon][3] to avoid all that hassle in the future:

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

From now on, I'll just have to run `npm run dev` to start [nodemon][3]. Check out the `v0.1` tag of the project to see how's it going so far:

```bash
$ git checkout tags/v0.1
$ npm run dev
```

---
[:arrow_backward:][back] ║ [:house:][home] ║ [:arrow_forward:][next]

<!-- navigation -->
[home]: ../README.md
[back]: setup.md
[next]: bootstrap.md

<!-- links -->
[1]: http://expressjs.com/en/index.html
[2]: https://github.com/lifeBalance/mongo-express/blob/v0.1/routes/contacts.js
[3]: https://github.com/remy/nodemon
