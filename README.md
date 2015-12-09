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

From now on, I'll just have to run `npm run dev` to start nodemon. Check out the `v0.1` tag of the project to see how's it going so far.
