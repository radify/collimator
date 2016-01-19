import * as collimator from '../src/collimator';
import bluebird        from 'bluebird';

describe('collimator.inspect', () => {
  it('describes the entire database', (done) => {
    var deferred = {
      tables:        bluebird.defer(),
      schema:        bluebird.defer(),
      relationships: bluebird.defer()
    };

    var spy = {
      tables:        jasmine.createSpy('tables').and.returnValue(deferred.tables.promise),
      schema:        jasmine.createSpy('schema').and.returnValue(deferred.schema.promise),
      relationships: jasmine.createSpy('relationships').and.returnValue(deferred.relationships.promise)
    };

    collimator.__Rewire__('tables', spy.tables);
    collimator.__Rewire__('schema', spy.schema);
    collimator.__Rewire__('relationships', spy.relationships);

    collimator.inspect('mockDb')
      .then((result) => {
        expect(spy.tables).toHaveBeenCalledWith('mockDb');
        expect(spy.schema).toHaveBeenCalledWith('mockDb', 'mockTable');
        expect(spy.relationships).toHaveBeenCalledWith('mockDb', 'mockTable');

        expect(result).toEqual([
          { name: 'mockTable', schema: 'mockSchema', relationships: 'mockRelationships' }
        ]);
      })
      .then(done);

    deferred.tables.resolve([{name: 'mockTable'}]);
    deferred.schema.resolve('mockSchema');
    deferred.relationships.resolve('mockRelationships');
  });
});
