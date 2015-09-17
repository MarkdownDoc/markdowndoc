'use strict';

var assert = require('chai').assert;
var errors = require('../specs/errors');

describe('#errors', function () {
  var MarkdownDocError;
  var Warning;
  var errMess = 'An Error message from test';
  var warnMess = 'A Warning message from test';

  before(function () {
    MarkdownDocError = new errors.MarkdownDocError(errMess);
    Warning = new errors.Warning(warnMess);
  });

  it('should have the proper constructor', function () {
    assert.ok(MarkdownDocError instanceof errors.MarkdownDocError);
    assert.ok(Warning instanceof errors.Warning);
  });

  it('should have the proper super constructor', function () {
    assert.ok(MarkdownDocError instanceof Error);
    assert.ok(Warning instanceof errors.MarkdownDocError);
  });

  it('should properly output `name` getter', function () {
    assert.ok(MarkdownDocError.name === 'MarkdownDocError');
    assert.ok(Warning.name === 'Warning');
  });

  it('should properly output `message` property', function () {
    assert.ok(MarkdownDocError.message === errMess);
    assert.ok(Warning.message === warnMess);
  });
});
