var express = require('express');
var router = express.Router();

/* GET list of contacts. */
router.get('/', function(req, res) {
  res.render('list', {});
});

/* GET Render a form for adding a contact. */
router.get('/add', function(req, res) {
  res.render('add', {});
});

/* POST contacts. */
router.post('/', function(req, res) {
  res.send('<h1>'+req.method+' request to <pre>' + req.path + '</pre></h1>');
});

/* GET, POST, whatever.. to /contacts/contact_id */
router.route('/:contact_id')
  .all(function(req, res, next) {
    var contact_id = req.params.contact_id;
    next();
  })
  .get(function (req, res) {
    res.render('edit', {});
  })
  .post(function (req, res) {
    res.send('<h1>'+req.method+' request to ' + req.baseUrl + req.path + '</h1>');
  })
  .put(function (req, res) {
    res.send('<h1>'+req.method+' request to ' + req.baseUrl + req.path + '</h1>');
  })
  .delete(function (req, res) {
    res.send('<h1>'+req.method+' request to ' + req.baseUrl + req.path + '</h1>');
  });

module.exports = router;
