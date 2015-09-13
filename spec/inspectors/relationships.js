import relationships from '../../src/inspectors/relationships';
import MockFileQuery from '../MockFileQuery';

describe('relationships', () => {
  it('queries db with `name` and returns a promise', (done) => {
    var query = new MockFileQuery();
    relationships.__Rewire__('query', query);

    query.and.callFake((db, query) => {
      const queries = {
        './relationships/belongsTo.sql': 'mockBelongsToResult',
        './relationships/has.sql':       'mockHasResult',
      };

      return queries[query];
    });

    relationships('mockDatabase', 'tableName')
      .then((result) => {
        expect(query.calls.count()).toBe(2);
        expect(query)
          .toHaveBeenCalledWith('mockDatabase', './relationships/belongsTo.sql', {name: 'tableName'});
        expect(query)
          .toHaveBeenCalledWith('mockDatabase', './relationships/has.sql', {name: 'tableName'});

        expect(result).toEqual({
          belongsTo: 'mockBelongsToResult',
          has:       'mockHasResult'
        });
      })
      .then(done);
  });
});
