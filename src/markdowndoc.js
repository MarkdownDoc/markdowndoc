import { is, getFirstMatch } from './utils';
import * as errors from './errors';
import Environment from './environment';
import setRuntimeInfos from './platform-infos';
import getResolvedTheme from './theme-resolver';
import getResolvedParser from './parser-resolver';
import { createTree } from './tree';

import path from 'path';
import rmdir from 'rmdir';
import mkdirp from 'mkdirp';

/**
 * Expose lower API blocks.
 */
export { Environment, errors };

/**
 * Ensure a proper Environment Object and events.
 *
 * @param {Object} config - can be falsy.
 *
 * @return {Object}
 */
export function ensureEnvironment(config, onError = e => { throw e; }) {
  let env = '';
  let modus;

  if (config instanceof Environment) {
    env = config;
  } else {
    if (config.debug) {
      modus = 'debug';
    } else if (config.verbose) {
      modus = 'verbose';
    }

    env = new Environment(undefined, modus);

    env.load(config);
  }

  env.on('error', onError);

  setRuntimeInfos(env);

  return env;
}

export function createDataTree(env, done) {
  const re = new RegExp(env.get('file-type') + '\\b');

  createTree(
    env.get('src'),
    function(treeError, res) {
      if (treeError) {
        env.log(new errors.MarkdownDocError(treeError), 'error');
      }

      if (typeof done === 'function') {
        done(res[0]);
      }
    },
    re
  );
}

export function addFileData(env, dirData) {
  let i;
  let l;

  // loop through files
  l = dirData.files.length;

  for (i = 0; i < l; i++) {
    const html = getResolvedParser(env);
    const title = getFirstMatch(html, /<h1>(.*)<\/h1>/g);
    const fileName = path.basename(
      dirData.files[i].fileName,
      env.get('file-type')
    );

    dirData.files[i].html = html(
      env.get('intern.plugins'),
      dirData.files[i].fileName
    );
    dirData.files[i].title = title !== '' ? title : fileName;
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
export default function markdowndoc(config) {
  const env = ensureEnvironment(config);

  /**
   * Warn user on empty documentation.
   *
   * @param {Array} data
   * @param {Object} env
   */
  function checkIfDataNotEmpty(data) {
    const message = `MarkdownDocs could not find anything to document.\n`;

    if (!is.object(data)) {
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
    const dest = env.get('intern.dest');

    rmdir(dest, function() {
      mkdirp(dest, function(error) {
        if (error) {
          console.error(error);
        } else {
          env.log(
            `Folder \`${dest}\` successfully refreshed.`
          );

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
    const theme        = getResolvedTheme(env);
    const displayTheme = env.get('intern.displayTheme') || 'anonymous';
    const dest         = env.get('destAbsolute');

    // Delete internal config, no need for the theme to know about it.
    delete env.parsedConf.intern;

    theme(dest, env.parsedConf);

    env.log(`Theme \`${displayTheme}\` successfully rendered.`);
  }

  function executeDocs() {
    createDataTree(env, function(data) {
      const dataTree = addFileData(env, data);

      checkIfDataNotEmpty(dataTree, env);

      env.set('datatree', dataTree);

      try {
        createEmptyOutputDirectory(
          renderTheme
        );
      } catch (err) {
        env.emit('error', err);
        throw err;
      }
    });
  }

  return executeDocs(env);
}
