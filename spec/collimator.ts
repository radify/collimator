import {IDatabase} from 'pg-promise';
import {resolve}   from 'bluebird';
import rewire      from 'jasmine-rewire';

import * as collimator from '../src/collimator';

describe('collimator', () => {
  var mocks = Object.assign({}, rewire(collimator, {
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
          expect(mocks.tables).toHaveBeenCalledWith(mocks.database);
          expect(mocks.schema).toHaveBeenCalledWith(mocks.database, 'mockTable');
          expect(mocks.relationships).toHaveBeenCalledWith(mocks.database, 'mockTable');

          expect(result).toEqual([
            { name: 'mockTable', schema: 'mockSchema', relationships: 'mockRelationships' }
          ]);
        })
        .then(done);
    });
  });
});
