module.exports = {
  'test' : [
    'newer:jsonlint:dev',
    'newer:jscs:dev',
    'newer:jshint:dev',
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
