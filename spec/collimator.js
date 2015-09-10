describe('collimator', function() {
  var collimator = require('../src/collimator');
  var bluebird   = require('bluebird');

  it('exports inspectors', function() {
    expect(collimator.tables).toBe(require('../src/inspectors/tables'));
    expect(collimator.schema).toBe(require('../src/inspectors/schema'));
    expect(collimator.relationships).toBe(require('../src/inspectors/relationships'));
  });

  it('describes the entire database when invoked directly', function(done) {
    var tables        = bluebird.defer();
    var schema        = bluebird.defer();
    var relationships = bluebird.defer();

    spyOn(collimator, 'tables').and.returnValue(tables.promise);
    spyOn(collimator, 'schema').and.returnValue(schema.promise);
    spyOn(collimator, 'relationships').and.returnValue(relationships.promise);

    collimator('mockDb')
      .then(function(result) {
        expect(collimator.tables).toHaveBeenCalledWith('mockDb');
        expect(collimator.schema).toHaveBeenCalledWith('mockDb', 'mockTable');
        expect(collimator.relationships).toHaveBeenCalledWith('mockDb', 'mockTable');

        expect(result).toEqual([
          { name: 'mockTable', schema: 'mockSchema', relationships: 'mockRelationships' }
        ]);
      })
      .then(done);

    tables.resolve([{name: 'mockTable'}]);
    schema.resolve('mockSchema');
    relationships.resolve('mockRelationships');
  });
});
