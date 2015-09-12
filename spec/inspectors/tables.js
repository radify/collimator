import tables        from '../../src/inspectors/tables';
import MockFileQuery from '../MockFileQuery';

describe('tables', () => {
  it('queries db with a query read from a file', (done) => {
    var query = new MockFileQuery();
    tables.__Rewire__('query', query);

    tables('mockDatabase')
      .then((result) => {
        expect(query).toHaveBeenCalledWith('mockDatabase', './tables.sql');
        expect(result).toBe('mockTables');
      })
      .then(done);

      query.deferred.resolve('mockTables');
  });
});
