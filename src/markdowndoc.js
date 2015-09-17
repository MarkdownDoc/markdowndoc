'use strict';

import { is, getFirstMatch } from './utils';
import * as errors from './errors';
import Environment from './environment';
import render from './parser';
import setRuntimeInfos from './platform-infos';
import resolve from './theme-resolver';
import {createTree} from './tree';

import path from 'path';
import fsExtra from 'fs-extra';

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
  let env = '',
  modus;

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

export function createDataTree (env, done) {
  let re = /.md\b/;

  createTree(
    env.get('src'),
    function (err, res) {

      if (err) {
        console.error(err);
      }

      if (typeof done === 'function') {
        done(res[0]);
      }
    },
    re
  );
}

export function addFileData (env, dirData) {
  let i, l;

  // loop through files
  l = dirData.files.length;

  for (i = 0; i < l; i++) {
    let html = render(env, dirData.files[i].fileName);
    let title = getFirstMatch(html, /<h1>(.*)<\/h1>/g);
    let fileName = path.basename(
      dirData.files[i].fileName,
      env.get('intern.file-type')
    );

    dirData.files[i].html = html;
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
export default function markdowndoc (config) {
  const env = ensureEnvironment(config);

  function executeDocs (env) {
    createDataTree(env, function (data) {
      data = addFileData(env, data);

      checkIfDataNotEmpty(data, env);

      env.set('datatree', data);

      try {
        createEmptyOutputDirectory(env);
        renderTheme(env);
        okay(env);
      } catch (err) {
        env.emit('error', err);
        throw err;
      }
    });
  }

  /**
   * Ensures that a directory is empty.
   * If the directory does not exist, it is created.
   * The directory itself is not deleted.
   * Checks if the dir is empyt, if not delte.
   *
   * @param  {Object} env
   */
  function createEmptyOutputDirectory (env) {
    fsExtra.emptyDir(
      env.get('intern.destAbsolute'),
      function (err) {
        if (!err) {
          env.log(
            `Folder \`${env.get('intern.dest')}\` successfully refreshed.`
          );
        }
      }
    );
  }

  /**
   * Render theme with parsed data context.
   *
   * @return {Promise}
   */
  function renderTheme (env) {
    let theme = resolve(env);
    let displayTheme = env.get('intern.displayTheme') || 'anonymous';
    let dest = env.get('intern.destAbsolute');

    // Delete internal config, no need for the theme to know about it.
    delete env.parsedConf.intern;

    theme(dest, env.parsedConf);

    env.log(`Theme \`${displayTheme}\` successfully rendered.`);
  }

  /**
   * Warn user on empty documentation.
   *
   * @param {Array} data
   * @param {Object} env
   */
  function checkIfDataNotEmpty (data, env) {
    let message = `MarkdownDocs could not find anything to document.\n`;

    if (!is.object(data)) {
      env.log(new errors.Warning(message), 'warning');
    }
  }

  /**
   * Log final success message.
   *
   * @param {Object} env
   */
  function okay (env) {
    env.log('Process over. Everything okay!');
  }

  return executeDocs(env);
}
