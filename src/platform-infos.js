import path from 'path';

export default function(env) {
  const prefix = path.resolve(process.execPath, '../../lib');
  const pkg = path.resolve(prefix, 'node_modules/npm/package.json');
  let pkgVersion = '';

  try {
    pkgVersion = require(pkg).version;
  } catch (e) {
    pkgVersion = 'unknown';
  }

  if (env.get('debug')) {
    env.log({ 'process.argv': JSON.stringify(process.argv) }, 'debug');
    env.log(
      'markdowndoc version: ' + require('../package.json').version,
      'debug'
    );
    env.log('node version: ' + process.version.substr(1), 'debug');

    env.log('npm version: ' + pkgVersion, 'debug');

    env.log('platform: ' + process.platform, 'debug');
    env.log('cwd: ' + process.cwd(), 'debug');

    env.log({ 'env:': env.parsedConf }, 'debug');
  }
}
