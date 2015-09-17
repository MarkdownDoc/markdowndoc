'use strict';

var expect      = require('chai').expect
var assert      = require('chai').assert;

var markdowndoc = require('../specs/markdowndoc');
var Environment = require('../specs/environment');
var utils       = require('../specs/utils');

describe('#createDataTree', function () {
  var env,
  list;

  beforeEach(function (done) {
    env = new Environment();
    env.set('src', './tests/fixture');
    markdowndoc.createDataTree(env, function(data) {
      env.set('ctx', markdowndoc.addFileData(env, data));

      done();
    });
  });

  it('It should output a full list.', function () {
    expect(utils.is.object(env.get('ctx'))).to.equal(true);
    expect(utils.is.object(env.get('ctx').files)).to.equal(true);
    expect(typeof env.get('ctx').path === 'string').to.equal(true);
    expect(typeof env.get('ctx').files[0].title === 'string').to.equal(true);
    expect(typeof env.get('ctx').files[0].html === 'string').to.equal(true);

    var testdir = function(dir, path, numfiles, numdirs) {
        expect(dir.path.substring(dir.path.length - path.length)).to.equal(path);
        expect(dir.files.length).to.equal(numfiles);
        expect(dir.directories.length).to.equal(numdirs);
    };

    testdir(env.get('ctx'), 'fixture', 3, 1);
    testdir(env.get('ctx').directories[0], 'mdchildfolder', 2, 1);
    testdir(env.get('ctx').directories[0].directories[0], 'mdsubchildfolder', 1, 0);
  });
});
