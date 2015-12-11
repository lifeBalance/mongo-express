# Setup
In this section we are gonna be installing most of the packages we are going to need. Needless to say you need [Node.js][0] available in your system.

## Express.js
Let's start with [Express.js][1] and the [Express generator][2].

1. We want to install [Express.js][1] **locally**, so run:

  ```bash
  $ express mongo-express
  ```

2. On the other hand, we want [Express generator][2] to be available at any moment in our command line, so it will be installed **globally**:

  ```bash
  $ npm install -g express-generator
  ```

2. Generate the project and install dependencies:

  ```bash
  $ express mongo-express
    ...
    install dependencies:
      $ cd mongo-express && npm install

    run the app:
      $ DEBUG=mongo-express:* npm start
  ```
  When the generator finishes, the bottom of the output shows instructions about what to do next. Before installing the dependencies, I'm gonna add a line to the `scripts` section in my `package.json` file:

  ```json
  "scripts": {
    "start": "node ./bin/www",
    "debug": "DEBUG=mongo-express:* npm start"
  },
  ```

  That way I don't have to remember that long command for debugging my app, just have to run `npm run debug`. Then, let's install the dependencies:

  ```bash
  $ cd mongo-express && npm install
  ```

3. And set up **version control** of of course:

  ```bash
  $ git init
  $ echo 'node_modules/' >> .gitignore
  $ git add .
  $ git commit -m 'Initial commit'
  ```

## Install additional packages
Let's install as `devDependencies` all the testing stuff:

* [chai][3]
* [karma][4]
* [mocha][5]
* [sinon][6]
* [supertest][7]

```bash
$ npm i -D chai karma mocha sinon supertest
```

And as normal `dependencies`:

* [express-session][8]
* [mongoose][9]
* [passport][10]

```bash
$ npm i -S express-session mongoose passport
```

And git it up:

```bash
$ git add .
$ git commit -m 'Add a bunch of modules'
```

---
[:arrow_backward:][back] ║ [:house:][home] ║ [:arrow_forward:][next]

<!-- navigation -->
[home]: ../README.md
[back]: ../README.md
[next]: routes.md

<!-- links -->
[0]: https://nodejs.org/en/
[1]: http://expressjs.com/en/index.html
[2]: https://github.com/expressjs/generator
[3]: https://github.com/chaijs/chai
[4]: https://github.com/karma-runner/karma
[5]: https://github.com/mochajs/mocha
[6]: https://github.com/sinonjs/sinon
[7]: https://github.com/visionmedia/supertest
[8]: https://github.com/expressjs/session
[9]: https://github.com/Automattic/mongoose
[10]: https://github.com/jaredhanson/passport
