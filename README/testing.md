# Automated testing
Automated testing has become an essential part of software development. Tests can be written at different levels:

1. **Micro-testing** is focused on small pieces or units of code such as functions or modules, as a result these tests run very fast. These tests are known as **unit tests**.
2. **Full-stack testing** tries to be more comprehensive, focusing in whole parts of our application. These tests are much more complex, involving several components of our app such as:

  * HTML.
  * CSS.
  * Client-side JavaScript.
  * Databases.
  * Infrastructure.

  As a result these tests run much slower and are harder to write. At this level [Selenium][1] is a popular testing framework for web-apps. It takes control of a web-browser to perform the same operations a user would

## TDD vs BDD
Now that we are familiar with how much our tests can cover, the question is when to write our tests. According to **Test Driven Development**, the test must be written before the code we are testing. Naturally, a test written this way will fail at least the first time is run, since the code it's testing doesn't even exist yet. Then we write just enough code to make the test pass. Once the test passes, the code can be refactored having the safety net of the test, that's why this approach is described as **red, green, refactor**.

Another common TDD practice is, once the test passes, it is rewritten again to add more functionality, as well as the tested code, to adapt to the new requirements of the test. When we're satisfied with the functionality, we refactor.

**Behaviour Driven Development** can be seen as an evolution of TDD that prescribes a particular syntax that makes our text more human-readable. BDD tools often use a Domain Specific Language (DSL) that makes possible the use of natural english-like sentences.

## Test Client
Between the micro-testing and full-stack testing levels we are going to use what is known as a **test client**. This is just a tool to test the full server side stack (including middleware), but contrary to full-stack testing, it will not launch our whole app in a browser. Instead it will run our app as Node.js would do, using some set-up some hooks for making some of the harder to test parts of our application testable. This way we gain the speed benefits of micro-testing while allowing us to test multiple components at once.

## Setting up the test tools
Next we are going to take care of installing all the packages needed for testing:

* [mocha][2], which is our test-framework,
* [chai][3], an assertion library.
* [supertest][4] will be the **test client** we mentioned in the previous section, to help us test our middleware and routes.

### Mocha
[mocha][2] has to be installed globally:

```bash
$ npm i -g mocha
```

Next thing we could do is adding a line to the `scripts` section of our `package.json` file:

```json
"test": "mocha -ui tdd"
```
This line will allow us to run `npm run test` to execute our test suite. Notice the use of the `--ui tdd` option (which stands for "user interface") to make use of the `tdd` style. It defaults to `bdd`.

Adding a line to scripts is useful when we are using a lot of options, but actually is enough to run: `$ mocha` at our command line to get our tests running.

### The rest of the bunch
The rest of the packages will be installed as `devDependencies`, so run:

```bash
$ npm i -D karma chai sinon supertest
```

### Writing our first test
Next order of business is creating a folder for our tests, which we're gonna do creating one named `test` at the root of our application directory.

Inside we are gonna create a file named `demo.js` (the name doesn't matter as long as it ends with the `.js` extension). These are its contents:

```js
var assert = require('assert');

describe('First test suite', function () {
  it('Should pass', function() {
    assert(true);
  });
});
```

* In the first line we are requiring the [assert module][5]. This module is part of the Node.js core, which makes it easy to access. It has minimal functionality, but it is convenient to use as first sanity-check, to see that the test-suite is properly installed. After that, is recommended to use another assertion library.

* The `describe` function is used to group tests into **suites**. Typically, suites are in their own file and named the same the module it will be testing, this way we'll only have one `describe` function per file. We can nest `describe` functions to help with test organization, and get a nice output in the terminal.
* The `it` function is used for create a proper **test**. This function takes 2 arguments:

  * The first one is the **label** that describes what the test does, and that is gonna show in the terminal output when running the suite. Usually starts with the word "Should".
  * The second argument is a function where we'll put our assertions, in this case we are asserting that `true` is `true`. You could try with `false` to see our test failing.

### Our first real test
In our first real test we are gonna check that our Jade templates are rendering properly:

```js
var chai = require('chai');
var assert = chai.assert;
var jade = require('jade');

describe('First test suite', function () {
  it('tests Jade rendering', function() {
    var template = '#container Hello world';
    var expected = '<div id="container">Hello world</div>';
    var render = jade.render(template);

    assert.equal(render, expected);
  });
});
```

Notice how we are importing the [assert][5] module that comes with the [Chai][3] library. This module works similarly to the one packaged with Node.js, although it provides several additional tests and is browser compatible. (Check the [Chai assert API][6] for a complete feature list)

### Testing our routes
Let's write another suite for our `contacts.js` route. It goes in a file named `test/contacts.js` this is what it looks like:

```js
var request = require('supertest');
var app = require('../app');

describe('Routes test suite', function () {
  it('tests Jade rendering', function(done) {
    request(app).get('/contacts')
    .expect(200, done);
  });
});
```

Here we require [supertest][4] since we are gonna use it for testing HTTP requests. It supports `expect()` assertions out of the box, so we don't even need to require any other module for that.

> It's a convention to require `supertest` with the name `request`. Note we also have to include our `app` file.

The anonymous function can contain **asynchronous code**, so we need to accept a `done` argument. This is a technique used for any code that is asynchronous.


That's all for this section. Check out the `v0.5` tag of the project to see how's it going so far:

```
$ git checkout tags/v0.5
$ mocha
```

---
[:arrow_backward:][back] ║ [:house:][home] ║ [:arrow_forward:][next]

<!-- navigation -->
[home]: ../README.md
[back]: dynamic-templates.md
[next]: client-side-testing.md

<!-- links -->
[1]: http://www.seleniumhq.org/
[2]: https://github.com/mochajs/mocha
[3]: https://github.com/chaijs/chai
[4]: https://github.com/visionmedia/supertest
[5]: https://nodejs.org/api/assert.html
[6]: http://chaijs.com/api/assert/
