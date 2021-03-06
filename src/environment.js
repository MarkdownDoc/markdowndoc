import path from 'path';
import loadFile from 'config-file';
import { is, merge } from './utils';
import { EventEmitter } from 'events';
import Logger from 'log';
import setValue from 'set-value';

const defaults = {
  'debug': false,
  'style': 'multisite',
  'file-type': '.md',
  'parser': 'markdown',
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
      'checkbox': true,
    },
  },
};

export default class Environment extends EventEmitter {

  /**
   * @param {String|Object|Undefined} config
   * @param {String}                  modus
   */
  constructor(config = undefined, modus = false) {
    super();

    this.modus      = this.getModus(modus);

    this.logger     = new Logger(this.modus);
    this.parsedConf = undefined;

    if (this.parsedConf === undefined) {
      this.parsedConf = this.parseConfig(config);
    }
  }

  getModus(modus) {
    if (modus === undefined) {
      return 'warning';
    }

    if (modus === 'verbose') {
      return 'warning';
    }

    return modus;
  }

  parseConfig(config) {
    const packageDetails     = this.fetchPackageDetails();
    const packageMarkdownDoc = packageDetails.markdowndoc;

    delete packageDetails.markdowndoc;

    let data = merge(
      this.getDefaultConfig(),
      packageDetails
    );

    if (is.plainObject(config) || is.string(config)) {
      const fetchedConfig = this.fetchConfig(config);

      data.intern = this.mergeExternalMarkdownDocConfig(data, fetchedConfig);
    }

    data.intern = this.mergePackageMarkdownConfig(data, packageMarkdownDoc);

    data = this.checkIfDestIsSet(data);

    return data;
  }

  mergeExternalMarkdownDocConfig(data, fetchedConfig) {
    const config = (
      fetchedConfig.markdowndoc !== undefined &&
      is.plainObject(fetchedConfig.markdowndoc)
    ) ?
      fetchedConfig.markdowndoc :
      fetchedConfig;

    data.style  = config.style;
    delete config.style;

    return merge(data.intern, config);
  }

  mergePackageMarkdownConfig(data, fetchedPackageConfig) {
    if (
      fetchedPackageConfig !== undefined &&
      !is.string(fetchedPackageConfig)
    ) {
      this.emit('warning', 'package.json MarkdownDoc config loaded.');

      data.style  = fetchedPackageConfig.style;
      delete fetchedPackageConfig.style;

      return merge(data.intern, fetchedPackageConfig);
    }

    return data.intern;
  }

  fetchConfig(config) {
    if (is.string(config)) {
      const load = loadFile(config, { parse: 'json' });

      if (!load) {
        return {};
      }

      return load;
    }

    return config;
  }

  fetchPackageDetails() {
    const packageFile = loadFile('package.json');

    if (packageFile) {
      return {
        name: packageFile.name,
        version: packageFile.version,
        description: packageFile.description,
        license: packageFile.license,
        markdowndoc: packageFile.markdowndoc,
      };
    }

    this.emit('warning', 'No package information.');
    return {};
  }

  getDefaultConfig() {
    const markdowndocrc = loadFile('.markdowndocrc', { parse: 'json' });

    if (markdowndocrc) {
      const config = {};

      config.style = markdowndocrc.style;
      delete markdowndocrc.style;

      config.intern = markdowndocrc;

      return config;
    }

    return defaults;
  }

  checkIfDestIsSet(data) {
    data.intern.dest  = data.dest ? data.dest : 'markdowndoc';
    data.destAbsolute = path.resolve(process.cwd(), data.intern.dest);

    return data;
  }

  /**
   * Get environment config from key
   *
   * @param  {String} mode
   * @param  {String} key
   *
   * @return {String}
   */
  get(key) {
    if (this.parsedConf[key] !== undefined) {
      return this.parsedConf[key];
    } else if (key.indexOf('.') !== -1) {
      const parts = key.split('.');
      let i = 0;
      let part;
      let obj = this.parsedConf;

      for (;parts[i];) {
        part = parts[i];
        obj  = obj[part];
        i++;
      }

      return obj;
    }

    return this.emit('error', new Error(
      `Key \`${key}\` dont exist.`
    ));
  }

  /**
   * Set a new key with a value.
   *
   * @param {String}  key
   * @param {*}  value
   */
  set(key, value) {
    setValue(this.parsedConf, key, value);
  }

  /**
   * Log some error/warnings/...
   *
   * @param  {String|Error} message
   * @param  {String}       type
   *
   * @return {Logger}
   */
  log(message, type = 'info') {
    this.logger[type](message);
  }
}
