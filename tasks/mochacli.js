'use strict';
//mochacli config

module.exports = {
  options: {
    require: ['chai'],
    compilers: ['js:babel/register'],
    // reporter: 'nyan',
    bail: true
  },
  all: ['tests/src/**/*.test.js']
};
