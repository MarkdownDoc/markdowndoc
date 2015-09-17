module.exports = {
  'dev:test' : [
    'newer:jsonlint:dev',
    'newer:jscs:dev',
    // 'newer:jshint:dev',
    'babel:test',
    'mochacli'
  ],
  'default': [
    'clean',
    'dev:test',
    'newer:babel:dist'
  ],
  'build': [
    'bump',
    'default'
  ]
};
