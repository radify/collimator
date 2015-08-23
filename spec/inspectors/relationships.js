describe('relationships', function() {

  var rewire = require('rewire');
  var relationships = rewire('../../src/inspectors/relationships');
  var mockQuery = require('../mockFileQuery');
  relationships.__set__('query', mockQuery);

  it('queries db with `name` and returns a promise', function(done) {
    mockQuery.and.callFake(function(db, query) {
      var queries = {
        './relationships/belongsTo.sql': 'mockBelongsToResult',
        './relationships/has.sql':       'mockHasResult',
      };

      return queries[query];
    });

    relationships('mockDatabase', 'tableName')
      .then(function(result) {
        expect(mockQuery.calls.count()).toBe(2);
        expect(mockQuery)
          .toHaveBeenCalledWith('mockDatabase', './relationships/belongsTo.sql', {name: 'tableName'});
        expect(mockQuery)
          .toHaveBeenCalledWith('mockDatabase', './relationships/has.sql', {name: 'tableName'});

        expect(result).toEqual({
          belongsTo: 'mockBelongsToResult',
          has:       'mockHasResult'
        });
      })
      .then(done);
  });
});
