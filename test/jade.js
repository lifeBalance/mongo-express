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
