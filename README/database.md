# Connecting to a database. MongoDB
First step before trying to connect to [MongoDB][1] is gonna be obviously **installing it** in our system. Visit [this other repo][2] for instructions in how to do that in **OS X**.

## Mongoose
To better understand what is [Mongoose][3] and the role it plays in [Node.js][4] applications, let's explain a couple of concepts.

### What is an ORM
When we use [OOP][5] languages to persist data to [Relational databases][6] we have to solve a problem known as the [object-relational impedance mismatch][7]. This means that we have to connect two systems that are build based on two different paradigms:

1. The [relational model][8] invented by **Edgar F. Codd** around 1970.
2. The [OOP][5] paradigm, used in our code base.

These 2 approaches are a bit incompatible, and to make them coexist in a system, we have two options:

* Introduce [SQL][9] statements in our code to communicate with the database.
* Use what is known as [Object Relational Mapping][10], a technique that allows us communicate with the database using a OOP language, no need of writing any [SQL][9] code. Basically all OOP languages have an ORM, Ruby has [ActiveRecord][11] and [DataMapper][12], Python has [SQLAlchemy][13], Java [Hibernate][14], etc.

### What is an ODM
**MongoDB** and other [NoSQL][16] databases are not a relational database, but a [Document-oriented database][15], they don't suffer the aforementioned object-relational impedance mismatch. Nonetheless, in most NoSQL database management systems we can find what can be considered an ORM equivalent, known as **Object Document Mapper**. Every programming language has at least one ODM for MongoDB: Java has [mongolink][17], PHP has [Mandango][18], and Node.js has [Mongoose][3]

[Mongoose][3], the ODM for Node.js, provides several enhancements to [MongoDB][1] such as **data validation**, and other ones. One particularly interesting is the ability to add **schemas**. A schema is what relational databases to enforce structured data in their tables. [MongoDB][1] is not so strict about structure and doesn't have the concept of schema, but the Mongoose library gives us the ability to define schemas also known as **models**. These are the main way to add certain structure when writing and reading from the database. Models makes accessing our data effortless, we'll be creating one a bit later.

### Installing and configuring Mongoose
Installing is as easy as running:

```bash
$ npm i -S mongoose
```
Then we'll have to require the module in our app:

```js
var mongoose = require('mongoose');
```

#### The Mongo URI
During **development**, we are going to run MongoDB from the same computer we are serving our app, but in **production** we'll probably be connecting to an instance of MongoDb running  that is running in another server.

So it would be nice setting a configuration to provide for both case scenarios. A common way to achieve that is adding the following line to our `app.js` file:

```js
var mongoURI = process.env.MONGOURI || 'mongodb://localhost/expressdb'
```

In the above line we are storing our configuration for **production** in an **environment variable** named `MONGOURI`. If this variable is not set, we'll connect to the **development** setting (to the right of the `||` operator).

To connect to the database we just have to use the `connect` method:

```js
mongoose.connect(mongoURI);
```

#### About the database connection
One thing to note about the database connection is that it is an **asynchronous** process, so the connection may be successfully started, but before is established our app maybe already up and the database not ready yet.

To deal with that we can use events to get notified about the state of the connection:

```js
var conn = mongoose.connection;

conn.on('connecting', function () {  
  console.log('Mongoose connecting to ' + mongoURI);
});

conn.on('connected', function () {  
  console.log('Successfully connected to ' + mongoURI);
});

conn.on('error',function (err) {  
  console.log('Mongoose connection error: ' + err);
});

conn.on('disconnected', function () {  
  console.log('Mongoose disconnected!');
});

// If the Node process ends, close the Mongoose connection
process.on('SIGINT', function() {  
  conn.close(function () {
    console.log('Mongoose connection finished. App termination');
    process.exit(0);
  });
});
```

### Creating a model
Now that we have a connection let's create some **schemas**. We mentioned before that schemas are a feature that is not present in MongoDB but made available by Mongoose. Conventionally, schemas are put in a folder named `models`, so let's create one at the root of our project and add our first schema:

```js
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var contactSchema = new Schema({
  // id is created automatically
  name: String,
  job: String,
  nickname: String,
  email: String,
  notes: [{
    postedDate: {
      type: Date,
      'default': Date.now
    },
    note: String
  }]
});

module.exports = mongoose.model('Contact', contactSchema);
```

Once we have defined all the properties of our schema, in the last line we compile it into a **model**, which is a class (in this case `Contact`) with which we construct documents (individual contacts). Each document will have the properties and behaviors we've defined in our schema.

Don't forget to check the documentation about schemas in the [Mongoose API][19].

---
[:arrow_backward:][back] ║ [:house:][home] ║ [:arrow_forward:][next]

<!-- navigation -->
[home]: ../README.md
[back]: client-side-testing.md
[next]: mongo-routes.md

<!-- links -->
[1]: https://www.mongodb.org/
[2]: https://github.com/lifeBalance/notes-mongodb/blob/master/README.md
[3]: http://mongoosejs.com/
[4]: https://nodejs.org/en/
[5]: https://en.wikipedia.org/wiki/Object-oriented_programming
[6]: https://en.wikipedia.org/wiki/Relational_database
[7]: https://en.wikipedia.org/wiki/Object-relational_impedance_mismatch
[8]: https://en.wikipedia.org/wiki/Relational_model
[9]: https://en.wikipedia.org/wiki/SQL
[10]: https://en.wikipedia.org/wiki/Object-relational_mapping
[11]: https://rubygems.org/gems/activerecord
[12]: http://datamapper.org/
[13]: http://www.sqlalchemy.org/
[14]: http://hibernate.org/
[15]: https://en.wikipedia.org/wiki/Document-oriented_database
[16]: https://en.wikipedia.org/wiki/NoSQL
[17]: http://mongolink.org/
[18]: http://mandango.org/
[19]: http://mongoosejs.com/docs/api.html#schema-js
