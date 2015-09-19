'use strict';

var _interopRequireDefault = require('babel-runtime/helpers/interop-require-default')['default'];

var _interopRequireWildcard = require('babel-runtime/helpers/interop-require-wildcard')['default'];

exports.__esModule = true;
exports['default'] = resolve;

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

var _errors = require('./errors');

var errors = _interopRequireWildcard(_errors);

/**
 * Resolve Theme for MarkdownDoc.
 *
 * @param  {Object} env
 *
 * @return {Promise}
 */

function resolve(env) {
  var logger = env.logger;

  /**
   * Try to find the default theme.
   *
   * @return {String} default path theme.
   */
  function getDefaultTheme() {
    try {
      require.resolve('markdowndoc-theme-default');
    } catch (err) {
      logger.error(new errors.MarkdownDocError('Holy shit, the default theme was not found! Run!'));
    }

    return 'default';
  }

  /**
   * Check if theme exist, or fallback to default theme.
   *
   * @param  {String} module - module name.
   *
   * @return {String}
   */
  function getValidModuleName(module) {
    try {
      require.resolve(module);
    } catch (err) {
      logger.info(new errors.Warning('Theme `' + module + '` not found.' + 'Falling back to default theme.'));

      return getDefaultTheme();
    }

    return module;
  }

  /**
   * Check if module can use 2 Arguments and is a function.
   *
   * @param  {String} module - module name.
   *
   * @return {Promise}
   */
  function getValidThemeFunction(module) {
    var theme = require(module);
    var str = Object.prototype.toString;

    if (typeof theme !== 'function') {
      logger.error(new errors.Warning('Given theme is ' + str(theme) + ', expected ' + str(str) + '.'));
    }

    if (theme.length !== 2) {
      logger.error('Given theme takes ' + theme.length + ' arguments, expected 2.');
    }

    return theme;
  }

  /**
   * Load given theme module.
   *
   * @param {String} env
   */
  function load() {
    var name = env.get('intern.theme');
    var theme = '';

    if (name.indexOf('/') === -1) {
      theme = getValidModuleName('markdowndoc-theme-' + name);
    } else {
      theme = _path2['default'].resolve(process.cwd(), getValidModuleName(name));
    }

    env.set('intern.displayTheme', _path2['default'].relative(process.cwd(), theme));

    env.log('Given theme ' + name + ' is loaded.');

    return getValidThemeFunction(theme);
  }

  return load(env);
}

module.exports = exports['default'];
