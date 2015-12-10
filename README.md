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




[1]: https://github.com/lifeBalance/mongo-express/blob/v0.2/views/layout.jade
