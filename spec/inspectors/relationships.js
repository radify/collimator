import relationships from '../../src/inspectors/relationships';
import mockFileQuery from '../mockFileQuery';

relationships.__Rewire__('query', mockFileQuery);

describe('relationships', () => {
  it('queries db with `name` and returns a promise', (done) => {
    mockFileQuery.and.callFake((db, query) => {
      const queries = {
        './relationships/belongsTo.sql': 'mockBelongsToResult',
        './relationships/has.sql':       'mockHasResult',
      };

      return queries[query];
    });

    relationships('mockDatabase', 'tableName')
      .then((result) => {
        expect(mockFileQuery.calls.count()).toBe(2);
        expect(mockFileQuery)
          .toHaveBeenCalledWith('mockDatabase', './relationships/belongsTo.sql', {name: 'tableName'});
        expect(mockFileQuery)
          .toHaveBeenCalledWith('mockDatabase', './relationships/has.sql', {name: 'tableName'});

        expect(result).toEqual({
          belongsTo: 'mockBelongsToResult',
          has:       'mockHasResult'
        });
      })
      .then(done);
  });
});
