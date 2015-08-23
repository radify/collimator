describe('schema', function() {

  var rewire = require('rewire');
  var schema = rewire('../../src/inspectors/schema');
  var mockQuery = require('../mockFileQuery');
  schema.__set__('query', mockQuery);

  var columns = [
    {name: 'forename', nullable: false, default: null, type: 'character varying'},
    {name: 'surname',  nullable: false, default: null, type: 'character varying'},
    {name: 'age',      nullable: false, default: 30,   type: 'smallint'},
    {name: 'gender',   nullable: true,  default: null, type: 'character'}
  ];

  describe('schema()', function() {
    it('queries db with `name`, passes result to .table(), and returns a promise', function(done) {
      spyOn(schema, 'table').and.returnValue('mockSchema');

      schema('mockDatabase', 'tableName')
        .then(function(result) {
          expect(mockQuery).toHaveBeenCalledWith('mockDatabase', './schema.sql', {name: 'tableName'});
          expect(schema.table).toHaveBeenCalledWith('tableName', columns);
          expect(result).toBe('mockSchema');
        })
        .then(done);

      mockQuery.deferred.resolve(columns);
    });
  });

  describe('.table()', function() {
    it('returns a JSON Schema object', function() {
      spyOn(schema, 'properties').and.returnValue('mockPropertyObject');
      spyOn(schema, 'required').and.returnValue('mockRequiredArray');

      var result = schema.table('myTable', columns);

      expect(schema.properties).toHaveBeenCalledWith(columns);
      expect(schema.required).toHaveBeenCalledWith(columns);

      expect(result).toEqual({
        $schema:    'http://json-schema.org/draft-04/schema#',
        title:      'myTable',
        type:       'object',
        properties: 'mockPropertyObject',
        required:   'mockRequiredArray'
      });
    });
  });

  describe('.properties()', function() {
    it('returns an object representing schema for all columns', function() {
      var R = require('ramda');

      spyOn(schema, 'property').and.callFake(function(column) {
        return R.createMapEntry(column.name, 'mockSchemaObject');
      });

      var result = schema.properties(columns);

      columns.forEach(function(column) {
        expect(schema.property).toHaveBeenCalledWith(column);
        expect(result[column.name]).toBe('mockSchemaObject');
      });
    });
  });

  describe('.property()', function() {
    it('returns type, keyed by column name', function() {
      var result = schema.property(columns[0]);
      
      expect(result).toEqual({
        forename: {
          type: 'string'
        }
      });
    });
  });

  describe('.required()', function() {
    it('returns array of columns that are not nullable and do not have a default', function() {
      var required = schema.required(columns);
      expect(required).toEqual(['forename', 'surname']);
    });
  });
});
