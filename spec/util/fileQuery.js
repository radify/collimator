import fileQuery from '../../src/util/fileQuery';

describe('fileQuery', () => {
  var db;

  beforeEach(() => {
    db = jasmine.createSpyObj('db', ['query']);
  });

  it('runs a query from a file', (done) => {
    fileQuery(db, './testQuery.sql')
      .then((result) => {
        expect(db.query).toHaveBeenCalledWith('SELECT * FROM test_query;\n', undefined, undefined);
      })
      .then(done);
  });

  it('specifies params', (done) => {
    fileQuery(db, './testQuery.sql', 'mockParams')
      .then((result) => {
        expect(db.query).toHaveBeenCalledWith('SELECT * FROM test_query;\n', 'mockParams', undefined);
      })
      .then(done);
  });

  it('specifies a query result mask', (done) => {
    fileQuery(db, './testQuery.sql', undefined, 'mockQueryResultMask')
      .then((result) => {
        expect(db.query).toHaveBeenCalledWith('SELECT * FROM test_query;\n', undefined, 'mockQueryResultMask');
      })
      .then(done);
  });
});
