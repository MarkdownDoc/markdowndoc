'use strict';

var expect      = require('chai').expect;
var assert      = require('chai').assert;

var errors      = require('../specs/errors');
var tree        = require('../specs/tree');
var Environment = require('../specs/environment');
var utils       = require('../specs/utils');

describe('#tree', function () {
  var env,
  list;

  beforeEach(function (done) {
    env = new Environment();
    env.set('src', './tests/fixture');
    var re = /.md\b/;

    tree.createTree(
      env.get('src'),
      function (err, res) {
        if (err) {
          console.error(err);
        }

        list = res;

        // complete the async beforeEach
        done();
      },
      re
    );
  });

  it('If folder path is passed, get a object with all data.', function () {
    expect(Array.isArray(list)).to.equal(true);
    expect(list.length).to.equal(1);

    var testdir = function(dir, path, numfiles, numdirs) {
        expect(dir.path.substring(dir.path.length - path.length)).to.equal(path);
        expect(dir.files.length).to.equal(numfiles);
        expect(dir.directories.length).to.equal(numdirs);
    };

    testdir(list[0], 'fixture', 3, 1);
    testdir(list[0].directories[0], 'mdchildfolder', 2, 1);
    testdir(list[0].directories[0].directories[0], 'mdsubchildfolder', 1, 0);

    expect(utils.is.object(list[0])).to.equal(true);
  });
});
