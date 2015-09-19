module.exports = {
  'test': [
    'newer:jsonlint:dev',
    'jscs:dev',
    'eslint',
    'jshint:dev',
    'babel:test',
    'mochacli'
  ],
  'default': [
    'clean',
    'test',
    'newer:babel:dist'
  ],
  'build': [
    'bump',
    'default'
  ]
};
