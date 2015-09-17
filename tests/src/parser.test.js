'use strict';

var expect = require('chai').expect
var assert = require('chai').assert;

var utils  = require('../specs/utils');
var errors = require('../specs/errors');
var parser = require('../specs/parser');
var Environment = require('../specs/environment');

describe('#parser', function () {
  var env;

  beforeEach(function () {
    env = new Environment();
    env.set('src', './tests/fixture');
  });

  it('If env and folder path is set get a html string.', function () {
    var test = parser(env, env.get('src') + '/one.md');

    expect(utils.is.string(test)).to.equal(true);
    expect(test).to.equal('<h1>one</h1>\n<h1>one2</h1>\n');
  });
});
