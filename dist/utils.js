'use strict';

var _Promise = require('babel-runtime/core-js/promise')['default'];

var _Object$keys = require('babel-runtime/core-js/object/keys')['default'];

var _interopRequireDefault = require('babel-runtime/helpers/interop-require-default')['default'];

exports.__esModule = true;
exports.denodeify = denodeify;
exports.filter = filter;
exports.merge = merge;
exports.getFirstMatch = getFirstMatch;

var _fs = require('fs');

var _fs2 = _interopRequireDefault(_fs);

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

/**
 * Type checking helpers.
 */
var toString = function toString(arg) {
  return Object.prototype.toString.call(arg);
};

/**
 * Tool to turn functions with Node-style callback APIs
 * into functions that return Promises
 *
 * @param  {Function} fn
 *
 * @return {Object}
 */

function denodeify(fn) {
  return function () {
    for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    /*eslint-disable */
    return new _Promise(function (resolve, reject) {
      fn.apply(undefined, args.concat([function (err) {
        for (var _len2 = arguments.length, args = Array(_len2 > 1 ? _len2 - 1 : 0), _key2 = 1; _key2 < _len2; _key2++) {
          args[_key2 - 1] = arguments[_key2];
        }

        if (err) {
          reject(err);
          return;
        }

        resolve.apply(undefined, args);
      }]));
    });
    /*eslint-enable */
  };
}

var is = {
  undef: function undef(arg) {
    return arg === void 0;
  },
  string: function string(arg) {
    return typeof arg === 'string';
  },
  'function': function _function(arg) {
    return typeof arg === 'function';
  },
  object: function object(arg) {
    return typeof arg === 'object' && arg !== null;
  },
  plainObject: function plainObject(arg) {
    return toString(arg) === '[object Object]';
  },
  array: function array(arg) {
    return Array.isArray(arg);
  },
  error: function error(arg) {
    return is.object(arg) && (toString(arg) === '[object Error]' || arg instanceof Error);
  },
  promise: function promise(arg) {
    return arg && is['function'](arg.then);
  },
  stream: function stream(arg) {
    return arg && is['function'](arg.pipe);
  }
};

exports.is = is;
/**
 * Filter files in array on regex.
 *
 * @param  {String} regex
 * @param  {String} dir
 * @param  {Array} array
 *
 * @return {Array}
 */

function filter(dir, array) {
  var regex = arguments.length <= 2 || arguments[2] === undefined ? null : arguments[2];

  if (regex === null) {
    return array;
  }

  var newList = [];

  array.forEach(function (file) {
    var filePath = _fs2['default'].lstatSync(_path2['default'].resolve(dir, file));

    if (filePath.isDirectory()) {
      newList.push(file);
    } else if (filePath.isFile() && regex.test(file)) {
      newList.push(file);
    }
  });

  return newList;
}

/**
  * Merge given object.
  *
  * @param {Object} target
  * @param {Object} src
  *
  * @return {Object}
  */

function merge(target, src) {
  var dst = {};

  if (target && is.object(target)) {
    _Object$keys(target).forEach(function (key) {
      dst[key] = target[key];
    });
  }

  _Object$keys(src).forEach(function (key) {
    if (!is.object(src[key]) || !src[key]) {
      dst[key] = src[key];
    } else {
      if (!target[key]) {
        dst[key] = src[key];
      } else {
        dst[key] = merge(target[key], src[key]);
      }
    }
  });

  return dst;
}

/**
 * Get first match from regex
 *
 * @param  {String} string
 * @param  {String} regex
 * @param  {Integer} index
 *
 * @return {String}
 */

function getFirstMatch(string, regex) {
  var index = arguments.length <= 2 || arguments[2] === undefined ? 1 : arguments[2];

  var matches = undefined;

  matches = regex.exec(string);

  return matches ? matches[index] : '';
}
