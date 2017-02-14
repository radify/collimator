import views       from '../../src/inspectors/views';
import rewire      from 'jasmine-rewire';
import {resolve}   from 'bluebird';
import {IDatabase} from 'pg-promise';

describe('views', () => {
  var mocks = Object.assign({}, rewire(views, {
    query: jasmine.createSpy('query').and.callFake(() => resolve('mockViews'))
  }), {
    database: 'mockDatabase' as any as IDatabase<any>
  });

  it('queries db with a query read from a file', done => {
    views(mocks.database)
      .then(result => {
        expect(mocks.query).toHaveBeenCalledWith(mocks.database, './views.sql');
        expect(result).toBe('mockViews');
      })
      .then(done);
  });
});
