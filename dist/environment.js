'use strict';

var _inherits = require('babel-runtime/helpers/inherits')['default'];

var _classCallCheck = require('babel-runtime/helpers/class-call-check')['default'];

var _interopRequireDefault = require('babel-runtime/helpers/interop-require-default')['default'];

exports.__esModule = true;

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

var _configFile = require('config-file');

var _configFile2 = _interopRequireDefault(_configFile);

var _utils = require('./utils');

var _events = require('events');

var _log = require('log');

var _log2 = _interopRequireDefault(_log);

var _setValue = require('set-value');

var _setValue2 = _interopRequireDefault(_setValue);

var defaults = {
  'debug': false,
  'style': 'multisite',
  'file-type': '.md',
  'intern': {
    'html': false,
    'xhtmlOut': false,
    'breaks': false,
    'langPrefix': 'language-',
    'linkify': true,
    'typography': true,
    'dest': 'markdowndoc',
    'theme': 'default',
    'noUpdateNotifier': true,
    'plugins': {
      'highlight': true,
      'linkscheme': true,
      'responsiveimage': true,
      'checkbox': true
    }
  }
};

var Environment = (function (_EventEmitter) {
  _inherits(Environment, _EventEmitter);

  /**
   * @param {String|Object|Undefined} config
   * @param {String}                  modus
   */

  function Environment() {
    var config = arguments.length <= 0 || arguments[0] === undefined ? undefined : arguments[0];
    var modus = arguments.length <= 1 || arguments[1] === undefined ? false : arguments[1];

    _classCallCheck(this, Environment);

    _EventEmitter.call(this);

    this.modus = this.getModus(modus);

    this.logger = new _log2['default'](this.modus);
    this.parsedConf = undefined;

    if (this.parsedConf === undefined) {
      this.parsedConf = this.parseConfig(config);
    }
  }

  Environment.prototype.getModus = function getModus(modus) {
    if (modus === undefined) {
      return 'warning';
    }

    if (modus === 'verbose') {
      return 'warning';
    }

    return modus;
  };

  Environment.prototype.parseConfig = function parseConfig(config) {
    var packageDetails = this.fetchPackageDetails();
    var packageMarkdownDoc = packageDetails.markdowndoc;

    delete packageDetails.markdowndoc;

    var data = _utils.merge(this.getDefaultConfig(), packageDetails);

    if (_utils.is.plainObject(config) || _utils.is.string(config)) {
      var fetchedConfig = this.fetchConfig(config);

      data.intern = this.mergeExternalMarkdownDocConfig(data, fetchedConfig);
    }

    data.intern = this.mergePackageMarkdownConfig(data, packageMarkdownDoc);

    data = this.checkIfDestIsSet(data);

    return data;
  };

  Environment.prototype.mergeExternalMarkdownDocConfig = function mergeExternalMarkdownDocConfig(data, fetchedConfig) {
    var config = fetchedConfig.markdowndoc !== undefined && _utils.is.plainObject(fetchedConfig.markdowndoc) ? fetchedConfig.markdowndoc : fetchedConfig;

    data.style = config.style;
    delete config.style;

    return _utils.merge(data.intern, config);
  };

  Environment.prototype.mergePackageMarkdownConfig = function mergePackageMarkdownConfig(data, fetchedPackageConfig) {
    if (fetchedPackageConfig !== undefined && !_utils.is.string(fetchedPackageConfig)) {
      this.emit('warning', 'package.json MarkdownDoc config loaded.');

      data.style = fetchedPackageConfig.style;
      delete fetchedPackageConfig.style;

      return _utils.merge(data.intern, fetchedPackageConfig);
    }

    return data.intern;
  };

  Environment.prototype.fetchConfig = function fetchConfig(config) {
    if (_utils.is.string(config)) {
      var load = _configFile2['default'](config, { parse: 'json' });

      if (!load) {
        return {};
      }

      return load;
    }

    return config;
  };

  Environment.prototype.fetchPackageDetails = function fetchPackageDetails() {
    var packageFile = _configFile2['default']('package.json');

    if (packageFile) {
      return {
        name: packageFile.name,
        version: packageFile.version,
        description: packageFile.description,
        markdowndoc: packageFile.markdowndoc
      };
    }

    this.emit('warning', 'No package information.');
    return {};
  };

  Environment.prototype.getDefaultConfig = function getDefaultConfig() {
    var markdowndocrc = _configFile2['default']('.markdowndocrc', { parse: 'json' });

    if (markdowndocrc) {
      var config = {};

      config.style = markdowndocrc.style;
      delete markdowndocrc.style;

      config.intern = markdowndocrc;

      return config;
    }

    return defaults;
  };

  Environment.prototype.checkIfDestIsSet = function checkIfDestIsSet(data) {
    data.intern.dest = data.dest ? data.dest : 'markdowndoc';
    data.destAbsolute = _path2['default'].resolve(process.cwd(), data.intern.dest);

    return data;
  };

  /**
   * Get environment config from key
   *
   * @param  {String} mode
   * @param  {String} key
   *
   * @return {String}
   */

  Environment.prototype.get = function get(key) {
    if (this.parsedConf[key] !== undefined) {
      return this.parsedConf[key];
    } else if (key.indexOf('.') !== -1) {
      var parts = key.split('.');
      var i = 0;
      var part = undefined;
      var obj = this.parsedConf;

      // while (obj && (part = parts[i++])) {
      //   obj = obj[part];
      // }

      for (; parts[i];) {
        part = parts[i];
        obj = obj[part];
        i++;
      }

      return obj;
    }

    return this.emit('error', new Error('Key `' + key + '` dont exist.'));
  };

  /**
   * Set a new key with a value.
   *
   * @param {String}  key
   * @param {*}  value
   */

  Environment.prototype.set = function set(key, value) {
    _setValue2['default'](this.parsedConf, key, value);
  };

  /**
   * Log some error/warnings/...
   *
   * @param  {String|Error} message
   * @param  {String}       type
   *
   * @return {Logger}
   */

  Environment.prototype.log = function log(message) {
    var type = arguments.length <= 1 || arguments[1] === undefined ? 'info' : arguments[1];

    this.logger[type](message);
  };

  return Environment;
})(_events.EventEmitter);

exports['default'] = Environment;
module.exports = exports['default'];
