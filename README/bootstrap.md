# Install Bootstrap Sass
To make use of the Sass version of Bootstrap we're going to need a couple of things:

* The Bootstrap framework itself (Sass version).
* The `node-sass-middleware` package.

### Bootstrap
Here we're going to integrate Bootstrap into the app. For that we're going to copy the sass, scripts and font files into our express app. At the end of the process this is what our `public/` directory should look like:

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
In our `layout.jade` file, we've added a `link` tag for our stylesheet, and a couple of `script` tags for the `bootstrap.js` file, and another one for jQuery. Check its source code [here][4].

This is what we have in our `index.jade`:

```jade
extends layout

block content
  .jumbotron
    h1= title
    p Welcome to #{title}
      span(class="glyphicon glyphicon-thumbs-up" aria-hidden="true")
```
A `div` element with the `.jumbotron` class and a glyphicon should be enough to check that everything is working properly.

Check out the `v0.2` tag of the project to see how's it going so far:

```bash
$ git checkout tags/v0.2
$ npm run dev
```

---
[:arrow_backward:][back] ║ [:house:][home] ║ [:arrow_forward:][next]

<!-- navigation -->
[home]: ../README.md
[back]: routes.md
[next]: static-templates.md

<!-- links -->
[1]: http://expressjs.com/en/index.html
[2]: https://github.com/lifeBalance/mongo-express/blob/v0.1/routes/contacts.js
[3]: https://github.com/remy/nodemon
[4]: https://github.com/lifeBalance/mongo-express/blob/v0.2/views/layout.jade
