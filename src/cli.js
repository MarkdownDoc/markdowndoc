'use strict';

let doc = `
Usage:
  markdowndoc - [options]
  markdowndoc --src=... [options]
Arguments:
  --src=<path>  Path to your Markdown folder.
Options:
  -c, --config=<path>   Path to JSON/YAML configuration file.
  -d, --dest=<dir>      Documentation folder.
  -h, --help            Bring help.
  -s, --style=<dir>     Choose between Single or Multisite.
  -t, --theme=<name>    Themeleon theme to be required.
  -v, --verbose         Enable verbose mode.
  --debug               Output debugging information.
  --no-update-notifier  Disable update notifier check.
  --strict              Turn warnings into errors.
  --version             Show version.
`;

import Environment from './environment';
import markdowndoc from './markdowndoc';
import * as errors from './errors';

import { docopt } from 'docopt';
import pkg from '../package.json';

/**
 * Ensure that CLI options take precedence over configuration values.
 *
 * For each name/option tuple, if the option is set, override configuration
 * value.
 */
function ensure(env, options, names) {
  for (let k of Object.keys(names)) {
    let v = names[k];

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

export default function cli(argv = process.argv.slice(2)) {
  let options   = docopt(doc, { version: pkg.version, argv: argv });
  let newConfig;
  let modus     = '';

  // Check for src and options
  if (!options['-'] && !options['--src'].length) {
    // Trigger help display.
    docopt(doc, { version: pkg.version, argv: ['--help'] });
  }

  if (
    options['--config'] &&
    !(options['--config'] instanceof Environment)
  ) {
    newConfig = options['--config'];
  }

  if (options['--verbose']) {
    modus = 'verbose';
  } else if (options['--debug']) {
    modus = 'debug';
  } else if (options['--strict']) {
    modus = 'error';
  }

  let env = new Environment(newConfig, modus);

  // env.on('error', error => {
  //   if (error instanceof errors.Warning) {
  //     process.exit(2);
  //   }

  //   process.exit(1);
  // });

  parseConfig(env, options);

  // Run update notifier if not explicitely disabled.
  if (!env.get('intern.no-update-notifier')) {
    require('./notifier')(pkg, env.logger);
  }

  return markdowndoc(env);
}
