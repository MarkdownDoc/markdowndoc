import path from 'path';
import * as errors from './errors';

/**
 * Resolve Theme for MarkdownDoc.
 *
 * @param  {Object} env
 *
 * @return {Promise}
 */
export default function(env) {
  const logger = env.logger;

  /**
   * Try to find the default theme.
   *
   * @return {String} default path theme.
   */
  function getDefaultTheme() {
    try {
      require.resolve('markdowndoc-theme-default');
    } catch (err) {
      logger.error(
        new errors.MarkdownDocError(
          'Holy shit, the default theme was not found! Run!'
        )
      );
    }

    return 'default';
  }

  /**
   * Check if theme exist, or fallback to default theme.
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
        new errors.Warning(`Theme \`${module}\` not found.` +
          'Falling back to default theme.'
        )
      );

      return getDefaultTheme();
    }

    return module;
  }

  /**
   * Check if module can use 2 Arguments and is a function.
   *
   * @param {String} module - module name.
   *
   * @return {Promise}
   */
  function getValidedThemeFunction(module) {
    const theme = require(module);
    const str   = Object.prototype.toString;

    if (
      typeof theme !==
      'function'
    ) {
      logger.error(new errors.Warning(
        `Given theme is ${str(theme)}, expected ${str(str)}.`
      ));
    }

    if (theme.length !== 2) {
      logger.error(
        `Given theme takes ${theme.length} arguments, expected 2.`
      );
    }

    return theme;
  }

  /**
   * Load given theme module.
   *
   * @param {String} env
   *
   * @return {Promise}
   */
  function load() {
    const name  = env.get('intern.theme');
    let theme = '';

    if (name.indexOf('/') === -1) {
      theme = getValidedModuleName(`markdowndoc-theme-${name}`);
    } else {
      theme = path.resolve(process.cwd(), getValidedModuleName(name));
    }

    env.set('intern.displayTheme', path.relative(process.cwd(), theme));

    env.log(`Given theme ${name} is loaded.`);

    return getValidedThemeFunction(theme);
  }

  return load(env);
}
