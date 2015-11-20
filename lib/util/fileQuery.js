'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});
exports['default'] = fileQuery;

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _path = require('path');

var _bluebird = require('bluebird');

var _fs = require('fs');

var _callsite = require('callsite');

var _callsite2 = _interopRequireDefault(_callsite);

var readFileP = (0, _bluebird.promisify)(_fs.readFile);

function fileQuery(db, file, params, resultMask) {
  var path = resolvePath(file);
  resultMask = resultMask || global.queryResult.manyOrNone;

  return readFileP(path, 'utf-8').then(function (query) {
    return db.query(query, params, resultMask);
  });
}

function resolvePath(file) {
  var stack = (0, _callsite2['default'])();
  var caller = stack[2];
  return (0, _path.resolve)(caller.getFileName(), '..', file);
}
module.exports = exports['default'];
//# sourceMappingURL=../util/fileQuery.js.map