'use strict';

var expect      = require('chai').expect
var assert      = require('chai').assert;
var utils       = require('../specs/utils');
var Environment = require('../specs/environment');
var path        = require('path');


describe('#environment', function () {
  it('should load look for .markdowndocrc or load default config if no path is set', function () {
    var expected = {
      'name'        : 'MarkdownDoc',
      'version'     : '0.0.0',
      'description' : 'A documentation tool for Markdown.',
      'debug'       : false,
      'style'       : 'single',
      'intern'      : {
        'file-type': '.md',
        'html'        : false,
        'xhtmlOut'    : false,
        'breaks'      : false,
        'langPrefix'  : 'lang-',
        'linkify'     : true,
        'typography'  : true,
        'dest'        : 'markdowndoc',
        'destAbsolute': path.resolve(process.cwd(), 'markdowndoc'),
        'theme'       : 'default',
        'noUpdateNotifier': true,
        'plugins'     : {
          'highlight'       : true,
          'linkscheme'      : true,
          'responsiveimage' : true,
          'checkbox'        : true
        }
      }
    },
    env = new Environment('tests/fixture/.markdowndocrc');

    assert.deepEqual(env.parsedConf, expected);
  });

  /**
   * A config.package is passed but fails.
   */
  describe('#load-default-config', function () {
    it('should render the default config', function () {
      var expected = {
        'name'        : 'MarkdownDoc',
        'version'     : '0.0.0',
        'description' : 'A documentation tool for Markdown.',
        'debug'       : false,
        'style'       : 'multisite',
        'intern'      : {
          'file-type': '.md',
          'html'        : false,
          'xhtmlOut'    : false,
          'breaks'      : false,
          'langPrefix'  : 'language-',
          'linkify'     : true,
          'typography'  : true,
          'dest'        : 'markdowndoc',
          'destAbsolute': path.resolve(process.cwd(), 'markdowndoc'),
          'theme'       : 'default',
          'noUpdateNotifier': true,
          'plugins'     : {
            'highlight'       : true,
            'linkscheme'      : true,
            'responsiveimage' : true,
            'checkbox'        : true
          }
        }
      },
      env = new Environment();

      assert.deepEqual(env.parsedConf, expected);
    });
  });

  /**
   * Check if we load package.json default.
   */
  describe('#package-load', function () {
    it('should render the package config', function () {
      var expected = {
        'name'       : 'MarkdownDoc',
        'version'    : '0.0.0',
        'description': 'A documentation tool for Markdown.',
        'debug'       : false,
        'style'       : 'single',
        'intern'      : {
          'file-type': '.md',
          'html'        : true,
          'xhtmlOut'    : false,
          'breaks'      : true,
          'langPrefix'  : 'lang-',
          'linkify'     : true,
          'typography'  : true,
          'dest'        : 'markdowndoc',
          'destAbsolute': path.resolve(process.cwd(), 'markdowndoc'),
          'theme'       : 'default',
          'noUpdateNotifier': true,
          'plugins'     : {
            'highlight'       : true,
            'linkscheme'      : true,
            'responsiveimage' : true,
            'checkbox'        : true
          }
        }
      },
      env = new Environment('tests/fixture/package.json'),
      target = env.parsedConf;

      assert.deepEqual(target, expected);
    });
  });

  /**
   * A config.package is passed but fails.
   */
  describe('#package-fail', function () {
    it('should warn if package file is not found and load CWD package.json', function () {
      var env = new Environment('should/fail.json');

      assert.ok(env.parsedConf.name === 'MarkdownDoc');
      // assert.notEqual(-1, warnings[0].indexOf('should/fail.json` not found'));
      // assert.notEqual(-1, warnings[1].indexOf('Falling back to `package.json`'));
    });
  });

  describe('#get and set', function () {
    it('Set and get a config', function () {
      var env = new Environment();

      env.set('test-key', 'test');
      assert.equal(env.get('test-key'), 'test');

      env.set('test.key', 'test')
      assert.equal(env.get('test.key'), 'test');

      assert.equal(env.get('intern.html'), false);

      env.set('testa.key', 'value');
      assert.equal(env.get('testa.key'), 'value');
    });
  });
});
