'use strict';

var R        = require('ramda');
var path     = require('path');
var bluebird = require('bluebird');
var readFile = bluebird.promisify(require('fs').readFile);
var callsite = require('callsite');

function fileQuery(db, file, params, resultMask) {
  var path = resolvePath(file);

  resultMask = resultMask || global.queryResult.manyOrNone;
  var query = R.partialRight(db.query, params, resultMask);

  return readFile(path, 'utf-8')
    .then(query);
}

function resolvePath(file) {
  var stack = callsite();
  var caller = stack[2];
  return path.resolve(caller.getFileName(), '..', file);
}

module.exports = fileQuery;
