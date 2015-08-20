describe('tables', function() {
  var tables = require('../../src/inspectors/tables');

  var query;
  var queryResult;
  var spyOnModule = require('../spyOnModule');

  beforeEach(function() {
    var Promise = require('bluebird');
    queryResult = Promise.defer();
    query = spyOnModule(__dirname + '/../../src/util/fileQuery').and.returnValue(queryResult.promise);
  });

  afterEach(function() {
    spyOnModule.removeSpy(__dirname + '/../../src/util/fileQuery');
  });

  it('queries db', function(done) {
    tables('mockDatabase')
      .then(function(result) {
        expect(query).toHaveBeenCalledWith('mockDatabase', './tables.sql');
        expect(result).toBe('mockTables');
      })
      .then(done);

      queryResult.resolve('mockTables');
  });
});
