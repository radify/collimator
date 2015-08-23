'use strict';

var bluebird = require('bluebird');

function mockFileQuery(db, file, params, resultMask) {
  module.exports.deferred = bluebird.defer();
  return module.exports.deferred.promise;
}

delete require.cache[__filename];
module.exports = jasmine.createSpy('mockFileQuery').and.callFake(mockFileQuery);
