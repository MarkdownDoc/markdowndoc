'use strict';

var _inherits = require('babel-runtime/helpers/inherits')['default'];

var _createClass = require('babel-runtime/helpers/create-class')['default'];

var _classCallCheck = require('babel-runtime/helpers/class-call-check')['default'];

exports.__esModule = true;

var MarkdownDocError = (function (_Error) {
  _inherits(MarkdownDocError, _Error);

  function MarkdownDocError(message) {
    _classCallCheck(this, MarkdownDocError);

    _Error.call(this, message);
    this.message = message; // rm when native class support.
  }

  _createClass(MarkdownDocError, [{
    key: 'name',
    get: function get() {
      return 'MarkdownDocError';
    }
  }]);

  return MarkdownDocError;
})(Error);

exports.MarkdownDocError = MarkdownDocError;

var Warning = (function (_MarkdownDocError) {
  _inherits(Warning, _MarkdownDocError);

  function Warning(message) {
    _classCallCheck(this, Warning);

    _MarkdownDocError.call(this, message);
    this.message = message; // rm when native class support.
  }

  _createClass(Warning, [{
    key: 'name',
    get: function get() {
      return 'Warning';
    }
  }]);

  return Warning;
})(MarkdownDocError);

exports.Warning = Warning;
