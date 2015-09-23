'use strict';

var _interopRequireWildcard = require('babel-runtime/helpers/interop-require-wildcard')['default'];

var _interopRequireDefault = require('babel-runtime/helpers/interop-require-default')['default'];

exports.__esModule = true;
exports.ensureEnvironment = ensureEnvironment;
exports.createDataTree = createDataTree;
exports.addFileData = addFileData;
exports['default'] = markdowndoc;

var _utils = require('./utils');

var _errors = require('./errors');

var errors = _interopRequireWildcard(_errors);

var _environment = require('./environment');

var _environment2 = _interopRequireDefault(_environment);

var _platformInfos = require('./platform-infos');

var _platformInfos2 = _interopRequireDefault(_platformInfos);

var _themeResolver = require('./theme-resolver');

var _themeResolver2 = _interopRequireDefault(_themeResolver);

var _parserResolver = require('./parser-resolver');

var _parserResolver2 = _interopRequireDefault(_parserResolver);

var _tree = require('./tree');

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

var _rmdir = require('rmdir');

var _rmdir2 = _interopRequireDefault(_rmdir);

var _mkdirp = require('mkdirp');

var _mkdirp2 = _interopRequireDefault(_mkdirp);

/**
 * Expose lower API blocks.
 */
exports.Environment = _environment2['default'];
exports.errors = errors;

/**
 * Ensure a proper Environment Object and events.
 *
 * @param {Object} config - can be falsy.
 *
 * @return {Object}
 */

function ensureEnvironment(config) {
  var onError = arguments.length <= 1 || arguments[1] === undefined ? function (e) {
    throw e;
  } : arguments[1];

  var env = '';
  var modus = undefined;

  if (config instanceof _environment2['default']) {
    env = config;
  } else {
    if (config.debug) {
      modus = 'debug';
    } else if (config.verbose) {
      modus = 'verbose';
    }

    env = new _environment2['default'](undefined, modus);

    env.load(config);
  }

  env.on('error', onError);

  _platformInfos2['default'](env);

  return env;
}

function createDataTree(env, done) {
  var re = new RegExp(env.get('file-type') + '\\b');

  _tree.createTree(env.get('src'), function (treeError, res) {
    if (treeError) {
      env.log(new errors.MarkdownDocError(treeError), 'error');
    }

    if (typeof done === 'function') {
      done(res[0]);
    }
  }, re);
}

function addFileData(env, dirData) {
  var i = undefined;
  var l = undefined;

  // loop through files
  l = dirData.files.length;

  for (i = 0; i < l; i++) {
    var html = _parserResolver2['default'](env);

    var fileName = _path2['default'].basename(dirData.files[i].fileName, env.get('file-type'));

    html = html(env.get('intern.plugins'), dirData.files[i].fileName);

    dirData.files[i].html = html;

    var title = _utils.getFirstMatch(html, /<h1>(.*)<\/h1>/g);

    dirData.files[i].title = title.length !== 0 ? title : fileName;
  }

  // loop through directories
  l = dirData.directories.length;

  for (i = 0; i < l; i++) {
    dirData.directories[i] = addFileData(env, dirData.directories[i]);
  }

  return dirData;
}

/**
 * Default public API method.
 *
 * @param {Object} env
 */

function markdowndoc(config) {
  var env = ensureEnvironment(config);

  /**
   * Warn user on empty documentation.
   *
   * @param {Array} data
   * @param {Object} env
   */
  function checkIfDataNotEmpty(data) {
    var message = 'MarkdownDocs could not find anything to document.\n';

    if (!_utils.is.object(data)) {
      env.log(new errors.Warning(message), 'warning');
    }
  }

  /**
   * Log final success message.
   *
   * @param {Object} env
   */
  function okay() {
    env.log('Process over. Everything okay!', 'info');
  }

  /**
   * Ensures that a directory is empty.
   * If the directory does not exist, it is created.
   * The directory itself is not deleted.
   * Checks if the dir is empyt, if not delte.
   *
   * @param  {Object} env
   */
  function createEmptyOutputDirectory(cb) {
    var dest = env.get('intern.dest');

    _rmdir2['default'](dest, function () {
      _mkdirp2['default'](dest, function (error) {
        if (error) {
          env.log(error, 'error');
        } else {
          env.log('Folder `' + dest + '` successfully refreshed.');

          cb();
          okay();
        }
      });
    });
  }

  /**
   * Render theme with parsed data context.
   *
   * @return {Promise}
   */
  function renderTheme() {
    var theme = _themeResolver2['default'](env);
    var displayTheme = env.get('intern.displayTheme') || 'anonymous';
    var dest = env.get('destAbsolute');

    // Delete internal config, no need for the theme to know about it.
    delete env.parsedConf.intern;

    theme(dest, env.parsedConf);

    env.log('Theme `' + displayTheme + '` successfully rendered.');
  }

  function executeDocs() {
    createDataTree(env, function (data) {
      var dataTree = addFileData(env, data);

      checkIfDataNotEmpty(dataTree, env);

      env.set('datatree', dataTree);

      try {
        createEmptyOutputDirectory(renderTheme);
      } catch (err) {
        env.emit('error', err);
        throw err;
      }
    });
  }

  return executeDocs(env);
}
