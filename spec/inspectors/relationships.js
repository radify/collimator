describe('relationships', function() {
  var relationships = require('../../src/inspectors/relationships');

  var query;
  var spyOnModule = require('../spyOnModule');

  beforeEach(function() {
    query = spyOnModule(__dirname + '/../../src/util/fileQuery');
  });

  afterEach(function() {
    spyOnModule.removeSpy(__dirname + '/../../src/util/fileQuery');
  });

  it('queries db with `name` and returns a promise', function(done) {
    query.and.callFake(function(db, query) {
      var queries = {
        './relationships/belongsTo.sql': 'mockBelongsToResult',
        './relationships/has.sql':       'mockHasResult',
      };

      return queries[query];
    });

    relationships('mockDatabase', 'tableName')
      .then(function(result) {
        expect(query.calls.count()).toBe(2);
        expect(query).toHaveBeenCalledWith('mockDatabase', './relationships/belongsTo.sql', {name: 'tableName'});
        expect(query).toHaveBeenCalledWith('mockDatabase', './relationships/has.sql', {name: 'tableName'});

        expect(result).toEqual({
          belongsTo: 'mockBelongsToResult',
          has:       'mockHasResult'
        });
      })
      .then(done);
  });
});
