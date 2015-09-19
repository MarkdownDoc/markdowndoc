'use strict';

var expect   = require('chai').expect;
var assert   = require('chai').assert;
var fs       = require('fs');
var utils    = require('../specs/utils');
var readFile = utils.denodeify(fs.readFile);
var errors   = require('../specs/errors');

describe('#utils:denodeify', function () {

  it('should catch errors', function () {
    assert.doesNotThrow(function () {
      readFile('fail');
    });
  });

  it('should reject errors', function () {
    return readFile('fail')
      .catch(function (err) {
        assert.ok(utils.is.error(err));
        assert.ok(err.code === 'ENOENT');
      });
  });

  it('should resolve data', function () {
    return readFile('tests/fixture/denodeify.txt', 'utf8')
      .then(function (data) {
        assert.ok(utils.is.string(data));
        assert.ok(/whoot/.test(data));
      });
  });

});

describe('#utils:getFirstMatch', function () {
  it('should output the first h1 match', function () {
    var regex = /<h1>(.*)<\/h1>/g;

    expect(utils.getFirstMatch('<h1>one</h1>\n<h1>one2</h1>\n', regex, 1)).to.equal('one');
    expect(utils.getFirstMatch('<h2>one</h2>\n<h1>one2</h1>\n', regex, 1)).to.equal('one2');
  });

  it('should output always the first h1 match', function () {
    var regex = /<h1>(.*)<\/h1>/g;

    expect(utils.getFirstMatch('<h1>one</h1>\n<h2>one2</h2>\n', regex, 1)).to.equal('one');
  });
});

describe('#filter', function () {
  it('If regex is set, remove files on regex.', function () {
    var list = [
      '.markdowndocrc',
      'denodeify.txt',
      'mdchildfolder',
      'one.md',
      'package.json',
      'three.md',
      'two.md'
    ],
    re = /.md\b/,
    newList = utils.filter('./tests/fixture', list, re),
    expect = [
      'mdchildfolder',
      'one.md',
      'three.md',
      'two.md'
    ];

    assert.deepEqual(expect, newList);
  });

  it('If regex is null, return list.', function () {
    var list = [
      '.markdowndocrc',
      'denodeify.txt',
      'mdchildfolder',
      'one.md',
      'package.json',
      'three.md',
      'two.md'
    ],
    newList = utils.filter('./tests/fixture', list, null);

    assert.deepEqual(list, newList);
  });
});

describe('#utils:is', function () {

  it('should provide utils.is.*', function () {
    // .stream
    expect(utils.is.stream({pipe: function () {}})).to.equal(true);
    expect(utils.is.stream()).to.equal(undefined);
    // .undef
    expect(utils.is.undef(1)).to.equal(false);
    expect(utils.is.undef()).to.equal(true);
    // .error
    expect(utils.is.error(null)).to.equal(false);
    expect(utils.is.error(new errors.MarkdownDocError())).to.equal(true);
    // .string
    expect(utils.is.string()).to.equal(false);
    // .function
    expect(utils.is.function()).to.equal(false);
    expect(utils.is.function(function () {})).to.equal(true);
    // .object
    expect(utils.is.object()).to.equal(false);
    expect(utils.is.object(1)).to.equal(false);
    expect(utils.is.object('')).to.equal(false);
    expect(utils.is.object({})).to.equal(true);
    expect(utils.is.object(new Error())).to.equal(true);
    // .plainObject
    expect(utils.is.plainObject()).to.equal(false);
    expect(utils.is.plainObject(1)).to.equal(false);
    expect(utils.is.plainObject(new Error())).to.equal(false);
    expect(utils.is.plainObject({})).to.equal(true);
    // .array
    expect(utils.is.array()).to.equal(false);
    expect(utils.is.array(1)).to.equal(false);
    expect(utils.is.array('')).to.equal(false);
    expect(utils.is.array([])).to.equal(true);
  });

});
