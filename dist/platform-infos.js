'use strict';

var _interopRequireDefault = require('babel-runtime/helpers/interop-require-default')['default'];

exports.__esModule = true;
exports['default'] = setRuntimeInfos;

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

function setRuntimeInfos(env) {
  var prefix = _path2['default'].resolve(process.execPath, '../../lib');
  var pkg = _path2['default'].resolve(prefix, 'node_modules/npm/package.json');
  var pkgVersion = '';

  try {
    pkgVersion = require(pkg).version;
  } catch (e) {
    pkgVersion = 'unknown';
  }

  if (env.get('debug')) {
    env.log({ 'process.argv': JSON.stringify(process.argv) }, 'debug');
    env.log('markdowndoc version: ' + require('../package.json').version, 'debug');
    env.log('node version: ' + process.version.substr(1), 'debug');

    env.log('npm version: ' + pkgVersion, 'debug');

    env.log('platform: ' + process.platform, 'debug');
    env.log('cwd: ' + process.cwd(), 'debug');

    env.log({ 'env:': env.parsedConf }, 'debug');
  }
}

module.exports = exports['default'];
