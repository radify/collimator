import {IDatabase} from 'pg-promise';
import {resolve}   from 'bluebird';
import rewire      from 'jasmine-rewire';

import * as collimator from '../src/collimator';

describe('collimator', () => {
  var mocks = Object.assign({}, rewire(collimator, {
    views: jasmine.createSpy('views').and.callFake(() => resolve([{name: 'mockView'}])),
    tables: jasmine.createSpy('tables').and.callFake(() => resolve([{name: 'mockTable'}])),
    schema: jasmine.createSpy('schema').and.callFake(() => resolve('mockSchema')),
    relationships: jasmine.createSpy('relationships').and.callFake(() => resolve('mockRelationships')),
  }), {
    database: <IDatabase<Object>>{}
  });

  describe('.inspect()', () => {
    it('describes the entire database', done => {
      collimator.inspect(mocks.database)
        .then(result => {
          expect(mocks.views).toHaveBeenCalledWith(mocks.database);
          expect(mocks.tables).toHaveBeenCalledWith(mocks.database);
          expect(mocks.schema).toHaveBeenCalledWith(mocks.database, 'mockView');
          expect(mocks.schema).toHaveBeenCalledWith(mocks.database, 'mockTable');
          expect(mocks.relationships).toHaveBeenCalledWith(mocks.database, 'mockTable');

          expect(result).toEqual({
            tables: [{
              name: 'mockTable',
              schema: 'mockSchema',
              relationships: 'mockRelationships'
            }],
            views: [{
              name: 'mockView',
              schema: 'mockSchema'
            }]
          });
        })
        .then(done);
    });
  });
});
