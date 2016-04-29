import tables      from '../../src/inspectors/tables';
import rewire      from 'jasmine-rewire';
import {resolve}   from 'bluebird';
import {IDatabase} from 'pg-promise';

describe('tables', () => {
  var mocks = Object.assign({}, rewire(tables, {
    query: jasmine.createSpy('query').and.callFake(() => resolve('mockTables'))
  }), {
    database: 'mockDatabase' as any as IDatabase<any>
  });

  it('queries db with a query read from a file', done => {
    tables(mocks.database)
      .then(result => {
        expect(mocks.query).toHaveBeenCalledWith(mocks.database, './tables.sql');
        expect(result).toBe('mockTables');
      })
      .then(done);
  });
});
