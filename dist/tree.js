'use strict';

var _interopRequireDefault = require('babel-runtime/helpers/interop-require-default')['default'];

exports.__esModule = true;
exports.createTree = createTree;

var _fs = require('fs');

var _fs2 = _interopRequireDefault(_fs);

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

var _utils = require('./utils');

function createTree(dir, done, fileNameRegex) {
  var results = [];
  var files = [];

  _fs2['default'].readdir(dir, function (err, list) {
    if (err) {
      return done(err);
    }

    var filteredList = _utils.filter(dir, list, fileNameRegex);

    var pending = filteredList.length;

    if (!pending) {
      // Folder
      return done(null, {
        dir: dir,
        files: {},
        directories: results
      });
    }

    filteredList.forEach(function (file) {
      var filePath = _path2['default'].resolve(dir, file);

      _fs2['default'].stat(filePath, function (error, stat) {
        if (stat && stat.isDirectory()) {
          createTree(filePath, function (treeError, res) {
            // Folder
            if (! --pending) {
              results.push({
                path: dir,
                files: files,
                directories: res
              });

              done(null, results);
            }
          }, fileNameRegex);
        } else {
          // File
          files.push({
            fileName: filePath
          });

          if (! --pending) {
            results.push({
              path: dir,
              files: files,
              directories: []
            });

            done(null, results);
          }
        }
      });
    });
  });
}
