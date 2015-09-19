'use strict';

var _Object$keys = require('babel-runtime/core-js/object/keys')['default'];

var _getIterator = require('babel-runtime/core-js/get-iterator')['default'];

var _interopRequireDefault = require('babel-runtime/helpers/interop-require-default')['default'];

exports.__esModule = true;
exports['default'] = cli;

var _environment = require('./environment');

var _environment2 = _interopRequireDefault(_environment);

var _markdowndoc = require('./markdowndoc');

var _markdowndoc2 = _interopRequireDefault(_markdowndoc);

// import * as errors from './errors';

var _docopt = require('docopt');

var _packageJson = require('../package.json');

var _packageJson2 = _interopRequireDefault(_packageJson);

/**
 * Ensure that CLI options take precedence over configuration values.
 *
 * For each name/option tuple, if the option is set, override configuration
 * value.
 */
var doc = '\nUsage:\n  markdowndoc - [options]\n  markdowndoc --src=... [options]\nArguments:\n  --src=<path>  Path to your Markdown folder.\nOptions:\n  -c, --config=<path>   Path to JSON/YAML configuration file.\n  -d, --dest=<dir>      Documentation folder.\n  -h, --help            Bring help.\n  -s, --style=<dir>     Choose between Single or Multisite.\n  -t, --theme=<name>    Themeleon theme to be required.\n  -v, --verbose         Enable verbose mode.\n  --debug               Output debugging information.\n  --no-update-notifier  Disable update notifier check.\n  --strict              Turn warnings into errors.\n  --version             Show version.\n';

function ensure(env, options, names) {
  for (var _iterator = _Object$keys(names), _isArray = Array.isArray(_iterator), _i = 0, _iterator = _isArray ? _iterator : _getIterator(_iterator);;) {
    var _ref;

    if (_isArray) {
      if (_i >= _iterator.length) break;
      _ref = _iterator[_i++];
    } else {
      _i = _iterator.next();
      if (_i.done) break;
      _ref = _i.value;
    }

    var k = _ref;

    var v = names[k];

    if (options[v]) {
      if (v === '--src') {
        env.set(k, options[v][0]);
      } else if (v === '--theme' || v === '--no-update-notifier') {
        env.set('intern.' + k, options[v]);
      } else {
        env.set(k, options[v]);
      }
    }
  }
}

function parseConfig(env, options) {
  // Ensure CLI options.
  ensure(env, options, {
    src: '--src',
    dest: '--dest',
    theme: '--theme',
    'no-update-notifier': '--no-update-notifier',
    style: '--style',
    verbose: '--verbose',
    debug: '--debug'
  });
}

function getModus(options) {
  if (options['--verbose']) {
    return 'verbose';
  } else if (options['--debug']) {
    return 'debug';
  } else if (options['--strict']) {
    return 'error';
  }
}

function cli() {
  var argv = arguments.length <= 0 || arguments[0] === undefined ? process.argv.slice(2) : arguments[0];

  var options = _docopt.docopt(doc, { version: _packageJson2['default'].version, argv: argv });
  var newConfig = undefined;

  // Check for src and options
  if (!options['-'] && !options['--src'].length) {
    // Trigger help display.
    _docopt.docopt(doc, { version: _packageJson2['default'].version, argv: ['--help'] });
  }

  if (options['--config'] && !(options['--config'] instanceof _environment2['default'])) {
    newConfig = options['--config'];
  }

  var env = new _environment2['default'](newConfig, getModus(options));

  // env.on('error', error => {
  //   if (error instanceof errors.Warning) {
  //     process.exit(2);
  //   }

  //   process.exit(1);
  // });

  parseConfig(env, options);

  // Run update notifier if not explicitely disabled.
  if (!env.get('intern.no-update-notifier')) {
    require('./notifier')(_packageJson2['default'], env.logger);
  }

  return _markdowndoc2['default'](env);
}

module.exports = exports['default'];
