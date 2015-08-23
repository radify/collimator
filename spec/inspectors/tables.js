describe('tables', function() {

  var rewire = require('rewire');
  var tables = rewire('../../src/inspectors/tables');
  var mockQuery = require('../mockFileQuery');
  tables.__set__('query', mockQuery);

  it('queries db with a query read from a file', function(done) {
    tables('mockDatabase')
      .then(function(result) {
        expect(mockQuery).toHaveBeenCalledWith('mockDatabase', './tables.sql');
        expect(result).toBe('mockTables');
      })
      .then(done);

      mockQuery.deferred.resolve('mockTables');
  });
});
