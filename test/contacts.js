var request = require('supertest');
var app = require('../app');

describe('Routes test suite', function () {
  it('tests Jade rendering', function(done) {
    request(app).get('/contacts')
    .expect(200, done);
  });
});
