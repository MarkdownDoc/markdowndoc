'use strict';

var _interopRequireDefault = require('babel-runtime/helpers/interop-require-default')['default'];

var _interopRequireWildcard = require('babel-runtime/helpers/interop-require-wildcard')['default'];

exports.__esModule = true;

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

var _errors = require('./errors');

var errors = _interopRequireWildcard(_errors);

/**
 * Resolve parser for MarkdownDoc.
 *
 * @param {Object} env
 *
 * @return {Promise}
 */

exports['default'] = function (env) {
  var logger = env.logger;

  /**
   * Check if parser exist.
   *
   * @param {String} module - module name.
   *
   * @return {String}
   */
  function getValidedModuleName(module) {
    try {
      require.resolve(module);
    } catch (err) {
      logger.info(new errors.Warning('parser `' + module + '` not found.'));

      return '';
    }

    return module;
  }

  /**
   * Check if module can use 2 Arguments and is a function.
   *
   * @param {String} module - module name.
   *
   * @return {function | null}
   */
  function getValidedParserFunction(module) {
    var parser = module !== '' ? require(module) : '';
    var str = Object.prototype.toString;

    if (typeof parser !== 'function') {
      logger.error(new errors.Warning('Given parser is ' + str(parser) + ', expected ' + str(str) + '.'));

      return null;
    }

    if (parser.length !== 2) {
      logger.error('Given parser takes ' + parser.length + ' arguments, expected 2.');

      return null;
    }

    return parser;
  }

  /**
   * Load given resolver module.
   *
   * @param {String} env
   *
   * @return {function | null}
   */
  function load() {
    var name = env.get('parser');
    var parser = '';

    if (name.indexOf('/') === -1) {
      parser = getValidedModuleName('markdowndoc-' + name + '-parser');
    } else {
      parser = _path2['default'].resolve(process.cwd(), getValidedModuleName(name));
    }

    if (env.get('debug')) {
      env.log('Given parser ' + name + ' is loaded.', 'debug');
    }

    return getValidedParserFunction(parser);
  }

  return load(env);
};

module.exports = exports['default'];
