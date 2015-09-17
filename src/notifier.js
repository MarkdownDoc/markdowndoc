'use strict';

import updateNotifier from 'update-notifier';
import chalk from 'chalk';

/**
 * Sometimes check for update and notify the user.
 *
 * @param {Object} pkg Package definition.
 * @param {Logger} logger
 */
export default function notify (pkg, logger) {
  // Checks for available update and returns an instance
  const notifier = updateNotifier({
    packageName: pkg.name,
    packageVersion: pkg.version
  });

  if (!notifier.update) {
    return;
  }

  let latest  = chalk.yellow(notifier.update.latest);
  let current = chalk.grey(`(current: ${notifier.update.current})`);
  let command = chalk.blue(`npm update -g ${pkg.name}`);

  logger.info(`Update available: ${latest} ${current}`);
  logger.info(`Run ${command} to update.`);
}
