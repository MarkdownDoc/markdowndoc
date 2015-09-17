'use strict';

var expect      = require('chai').expect
var assert      = require('chai').assert;
var resolver    = require('../specs/theme-resolver');
var Environment = require('../specs/environment');

describe('#resolver', function () {
  var env;

  beforeEach(function () {
    env = new Environment();
  });

  it('Check if we get a function back, from default theme', function () {
    var defaultTheme = resolver(env);

    assert.isFunction(defaultTheme);
  });
});
