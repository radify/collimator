describe('fileQuery', function() {
  var fileQuery = require('../../src/util/fileQuery');
  var db;

  beforeEach(function() {
    queryResult = {
      manyOrNone: 'mockManyOrNoneQueryResult'
    };

    db = jasmine.createSpyObj('db', ['query']);
  });

  it('runs a query from a file', function(done) {
    fileQuery(db, './testQuery.sql')
      .then(function(result) {
        expect(db.query).toHaveBeenCalledWith('SELECT * FROM test_query;\n', undefined, queryResult.manyOrNone);
      })
      .then(done);
  });

  it('specifies params', function(done) {
    fileQuery(db, './testQuery.sql', 'mockParams')
      .then(function(result) {
        expect(db.query).toHaveBeenCalledWith('SELECT * FROM test_query;\n', 'mockParams', queryResult.manyOrNone);
      })
      .then(done);
  });

  it('specifies a query result mask', function(done) {
    fileQuery(db, './testQuery.sql', undefined, 'mockQueryResultMask')
      .then(function(result) {
        expect(db.query).toHaveBeenCalledWith('SELECT * FROM test_query;\n', undefined, 'mockQueryResultMask');
      })
      .then(done);
  });
});
