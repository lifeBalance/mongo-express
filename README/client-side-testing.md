# Client-side testing
Even though we are using JavaScript both in the server-side and client-side or our app, each side has different testing requirements. For the client-side JavaScript we are going to be using [karma][1], which is in charge of launching a special test environment that is loaded in our browser to run the tests and report back the results.

## Installing karma
We our going to install [karma][1] **locally** and add it to our `devDependencies` list in the `package.json` file:

```bash
$ npm i karma -D
```

To run karma we'll have to type:

```bash
$ ./node_modules/karma/bin/karma start
```

So better if we add a line to our `scripts` in our `package.json` file:

```
"karma": "./node_modules/karma/bin/karma start"
```

This way we'll run `npm run karma`, which is much more typing efficient.

### A folder for our karma tests
We are going to need a folder for our client-side tests, so let's add one at the root of our project named `browser-tests`.

### The karma-cli
Even better than running that npm script, we might find useful to install the [karma-cli][2] package globally:

```bash
$ npm i -g karma-cli
```

When it finishes we can run [karma][1] from anywhere and it will always run the local version. Run `karma start --help` to see all the available options.

### Generating a karma config file
[karma][3] needs some information about our project in order to test it, and we can make this information available by generating a configuration file. Let's run our brand new [karma-cli][2] with the `init` option and follow the instructions on the screen:

```bash
$ karma init

Which testing framework do you want to use ?
Press tab to list possible options. Enter to move to the next question.
> mocha

Do you want to use Require.js ?
This will add Require.js plugin.
Press tab to list possible options. Enter to move to the next question.
> no

Do you want to capture any browsers automatically ?
Press tab to list possible options. Enter empty string to move to the next question.
> Chrome
>

What is the location of your source and test files ?
You can use glob patterns, eg. "js/*.js" or "test/**/*Spec.js".
Enter empty string to move to the next question.
> public/javascripts/**/*.js
> browser-tests/**/*.js
12 12 2015 18:57:04.928:WARN [init]: There is no file matching this pattern.

>

Should any of the files included by the previous patterns be excluded ?
You can use glob patterns, eg. "**/*.swp".
Enter empty string to move to the next question.
>

Do you want Karma to watch all the files and run the tests on change ?
Press tab to list possible options.
> no


Config file generated at "/Users/javi/CODE/NODE/PACKT/mongo-express/karma.conf.js".
```

At the end of the process we'll have a file named `karma.conf.js` at the root of our project. And since we chose **chrome** to run our tests, it will also installs the [karma-chrome-launcher][3] and [karma-mocha][3] plugins.

### Adding chai and sinon
At some point we are going to need an assertions library as well as a mocking library, so let's add [chai][4] and [sinon][5] to the `karma.conf.js`:

```js
frameworks: ['mocha', 'chai', 'sinon'],
```

We installed [chai][4], let's install [sinon][5] and add it to our `devDependencies` list:

```bash
$ npm i -D sinon
```

### Installing some plugins
Now if we run `karma start --single-run` we'll get some errors:

```
Error: No provider for "framework:chai"! (Resolving: framework:chai)
```

This is because having [chai][4] and [sinon][5] installed is not enough, we also need karma plugins to deal with this frameworks:

```bash
$ npm i -D karma-chai karma-sinon
```

Now we have [karma][3] properly running.

### About CDN files
One curious error I found was that having added a CDN script tag to jQuery in my `layout.jade` file, I got:

```
 Uncaught Error: Bootstrap's JavaScript requires jQuery
```

To solve it I added the CDN link to the **beginning** of the `files` array in the `karma.conf.js` file.

### Adding a demo test
Let's add a demo test to our `browser-tests` folder:

```js
describe('Client-side testing', function() {
  it('Should pass', function() {
    assert(true);
  });
});
```

Run it, and it should pass.

That's all for this section. Check out the `v0.6` tag of the project to see how's it going so far:

```
$ git checkout tags/v0.6
```

---
[:arrow_backward:][back] ║ [:house:][home] ║ [:arrow_forward:][next]

<!-- navigation -->
[home]: ../README.md
[back]: testing.md
[next]: database.md

<!-- links -->
[1]: https://github.com/karma-runner/karma
[2]: https://github.com/karma-runner/karma-cli
[3]: https://github.com/karma-runner/karma-mocha
[4]: https://github.com/karma-runner/karma-chrome-launcher
[5]: https://github.com/chaijs/chai
[6]: https://github.com/sinonjs/sinon
