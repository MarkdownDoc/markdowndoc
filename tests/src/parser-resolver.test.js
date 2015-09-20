'use strict';

var expect      = require('chai').expect;
var assert      = require('chai').assert;
var resolver    = require('../specs/parser-resolver');
var Environment = require('../specs/environment');

describe('#parser-resolver', function () {
  var env;

  beforeEach(function () {
    env = new Environment();
  });

  it('Check if we get a function back for markdown parser', function () {
    var parser = resolver(env);

    assert.isFunction(parser);
    assert.isNotNull(parser);
  });

  describe('#resolver', function () {
    var env;

    beforeEach(function () {
      env = new Environment();
      env.set('parser', 'test');
    });

    it('Check if we get a null back for test parser', function () {
      var parser = resolver(env);

      assert.isNotFunction(parser);
      assert.isNull(parser);
    });
  });
});
