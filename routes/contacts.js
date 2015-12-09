var express = require('express');
var router = express.Router();

/* GET contacts listing. */
router.get('/', function(req, res) {
  res.send('<h1>'+req.method+' request to <pre>'+req.path+'</pre></h1>');
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
    res.send('<h1>'+req.method+' request to ' + req.baseUrl + req.path + '</h1>');
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
