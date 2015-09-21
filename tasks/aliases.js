module.exports = {
  'test': [
    'jsonlint:dev',
    'jscs:dev',
    'eslint',
    'jshint:dev',
    'babel:test',
    'mochacli'
  ],
  'default': [
    'clean',
    'test',
    'babel:dist'
  ],
  'build': [
    'bump',
    'default'
  ]
};
