import usedTables  from '../../src/inspectors/usedTables';
import rewire      from 'jasmine-rewire';
import {resolve}   from 'bluebird';
import {IDatabase} from 'pg-promise';

describe('usedTables', () => {
  var mocks = Object.assign({}, rewire(usedTables, {
    query: jasmine.createSpy('query').and.callFake(() => resolve('mockUsedTables'))
  }), {
    database: 'mockDatabase' as any as IDatabase<any>
  });

  it('queries db with a query read from a file', done => {
    usedTables(mocks.database, 'testView')
      .then(result => {
        expect(mocks.query).toHaveBeenCalledWith(mocks.database, './usedTables.sql', {name: 'testView'});
        expect(result).toBe('mockUsedTables');
      })
      .then(done);
  });
});
