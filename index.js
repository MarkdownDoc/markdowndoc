var markdowndoc                  = require('./dist/markdowndoc');

module.exports                   = markdowndoc.default;
module.exports.ensureEnvironment = markdowndoc.ensureEnvironment;
module.exports.Environment       = markdowndoc.Environment;
module.exports.errors            = markdowndoc.errors;
