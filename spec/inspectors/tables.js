import tables        from '../../src/inspectors/tables';
import mockFileQuery from '../mockFileQuery';

tables.__Rewire__('query', mockFileQuery);

describe('tables', () => {
  it('queries db with a query read from a file', (done) => {
    tables('mockDatabase')
      .then((result) => {
        expect(mockFileQuery).toHaveBeenCalledWith('mockDatabase', './tables.sql');
        expect(result).toBe('mockTables');
      })
      .then(done);

      mockFileQuery.deferred.resolve('mockTables');
  });
});
