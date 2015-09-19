'use strict';
//babel config

module.exports = {
  options: {
    stage: 1,
    loose: ['all'],
    optional: ['runtime', 'es7.asyncFunctions']
  },
  test: {
    options: {
      sourceMap: true
    },
    files: {
      'tests/specs/cli.js': 'src/cli.js',
      'tests/specs/environment.js': 'src/environment.js',
      'tests/specs/errors.js': 'src/errors.js',
      'tests/specs/markdowndoc.js': 'src/markdowndoc.js',
      'tests/specs/notifier.js': 'src/notifier.js',
      'tests/specs/utils.js': 'src/utils.js',
      'tests/specs/theme-resolver.js': 'src/theme-resolver.js',
      'tests/specs/platform-infos.js': 'src/platform-infos.js',
      'tests/specs/tree.js': 'src/tree.js'
    }
  },
  dist: {
    options: {
      sourceMap: false
    },
    files: {
      'dist/cli.js': 'src/cli.js',
      'dist/environment.js': 'src/environment.js',
      'dist/errors.js': 'src/errors.js',
      'dist/markdowndoc.js': 'src/markdowndoc.js',
      'dist/notifier.js': 'src/notifier.js',
      'dist/utils.js': 'src/utils.js',
      'dist/theme-resolver.js': 'src/theme-resolver.js',
      'dist/platform-infos.js': 'src/platform-infos.js',
      'dist/tree.js': 'src/tree.js'
    }
  }
};
