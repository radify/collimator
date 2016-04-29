import relationships from '../../src/inspectors/relationships';

import {IDatabase} from 'pg-promise';
import rewire      from 'jasmine-rewire';

describe('relationships', () => {
  var mocks = Object.assign({}, rewire(relationships, {
    query: jasmine.createSpy('query')
  }), {
    database: 'mockDatabase' as any as IDatabase<any>
  });

  mocks.query.and.callFake((db: IDatabase<any>, query: string) => {
    const queries:any = {
      './relationships/belongsTo.sql': 'mockBelongsToResult',
      './relationships/has.sql':       'mockHasResult',
    };

    return queries[query];
  });

  it('queries db with `name` and returns a promise', done => {
    relationships(mocks.database, 'tableName')
      .then(result => {
        expect(mocks.query.calls.count()).toBe(2);
        expect(mocks.query)
          .toHaveBeenCalledWith(mocks.database, './relationships/belongsTo.sql', {name: 'tableName'});
        expect(mocks.query)
          .toHaveBeenCalledWith(mocks.database, './relationships/has.sql', {name: 'tableName'});

        expect(result).toEqual({
          belongsTo: 'mockBelongsToResult',
          has:       'mockHasResult'
        });
      })
      .then(done);
  });
});
