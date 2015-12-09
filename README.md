# mongo-express

## Setup
1. Install:

  * Node.js
  * Express.js
  * Express generator

2. Generate the project and install dependencies:

  ```
  $ express mongo-express
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
