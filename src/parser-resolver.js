import path from 'path';
import * as errors from './errors';

/**
 * Resolve parser for MarkdownDoc.
 *
 * @param {Object} env
 *
 * @return {Promise}
 */
export default function(env) {
  const logger = env.logger;

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
      logger.info(
        new errors.Warning(`parser \`${module}\` not found.`
        )
      );

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
    const parser = module !== '' ? require(module) : '';
    const str = Object.prototype.toString;

    if (typeof parser !== 'function') {
      logger.error(new errors.Warning(
        `Given parser is ${str(parser)}, expected ${str(str)}.`
      ));

      return null;
    }

    if (parser.length !== 2) {
      logger.error(
        `Given parser takes ${parser.length} arguments, expected 2.`
      );

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
    const name = env.get('parser');
    let parser = '';

    if (name.indexOf('/') === -1) {
      parser = getValidedModuleName(`markdowndoc-${name}-parser`);
    } else {
      parser = path.resolve(process.cwd(), getValidedModuleName(name));
    }

    if (env.get('debug')) {
      env.log(`Given parser ${name} is loaded.`, 'debug');
    }

    return getValidedParserFunction(parser);
  }

  return load(env);
}
