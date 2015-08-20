(function() {
  'use strict';

  var R        = require('ramda');
  var path     = require('path');
  var Promise  = require('bluebird');
  var readFile = Promise.promisify(require('fs').readFile);

  function fileQuery(db, file, params, resultMask) {
    var filePath = path.resolve(module.parent.filename, '..', file);

    resultMask = resultMask || queryResult.manyOrNone;
    var query = R.partialRight(db.query, params, resultMask);

    return readFile(filePath, 'utf-8')
      .then(query);
  }

  module.exports = fileQuery;
}());
