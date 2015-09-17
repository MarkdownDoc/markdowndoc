'use strict';

import path from 'path';
import * as errors from './errors';

/**
 * Resolve Theme for MarkdownDoc.
 *
 * @param  {Object} env
 *
 * @return {Promise}
 */
export default function resolve (env) {
  const logger = env.logger;

  /**
   * Load given theme module.
   *
   * @param {String} env
   */
  function load (env) {
    let name  = env.get('intern.theme');
    let theme = '';

    if (name.indexOf('/') === -1) {
      theme = getValidModuleName(`markdowndoc-theme-${name}`);
    } else {
      theme = path.resolve(process.cwd(), getValidModuleName(name));
    }

    env.set('intern.displayTheme', path.relative(process.cwd(), theme));

    env.log(`Given theme ${name} is loaded.`);

    return getValidThemeFunction(theme);
  }

  /**
   * Check if theme exist, or fallback to default theme.
   *
   * @param  {String} module - module name.
   *
   * @return {String}
   */
  function getValidModuleName (module) {
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
   * @param  {String} module - module name.
   *
   * @return {Promise}
   */
  function getValidThemeFunction (module) {
    let theme = require(module);
    let str   = Object.prototype.toString;

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
   * Try to find the default theme.
   *
   * @return {String} default path theme.
   */
  function getDefaultTheme () {
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

  return load(env);
}
