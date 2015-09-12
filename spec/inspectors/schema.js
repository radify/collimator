import schema        from '../../src/inspectors/schema';
import mockFileQuery from '../mockFileQuery';

schema.__Rewire__('query', mockFileQuery);

describe('schema', () => {
  const columns = [
    {name: 'forename', nullable: false, default: null, type: 'character varying'},
    {name: 'surname',  nullable: false, default: null, type: 'character varying'},
    {name: 'age',      nullable: false, default: 30,   type: 'smallint'},
    {name: 'gender',   nullable: true,  default: null, type: 'character'}
  ];

  describe('schema()', () => {
    it('queries db with `name`, passes result to .table(), and returns a promise', (done) => {
      spyOn(schema, 'table').and.returnValue('mockSchema');

      schema('mockDatabase', 'tableName')
        .then((result) => {
          expect(mockFileQuery).toHaveBeenCalledWith('mockDatabase', './schema.sql', {name: 'tableName'});
          expect(schema.table).toHaveBeenCalledWith('tableName', columns);
          expect(result).toBe('mockSchema');
        })
        .then(done);

      mockFileQuery.deferred.resolve(columns);
    });
  });

  describe('.table()', () => {
    it('returns a JSON Schema object', () => {
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

  describe('.properties()', () => {
    it('returns an object representing schema for all columns', () => {
      spyOn(schema, 'property').and.callFake(column => ({
        [column.name]: 'mockSchemaObject'
      }));

      var result = schema.properties(columns);

      columns.forEach((column) => {
        expect(schema.property).toHaveBeenCalledWith(column);
        expect(result[column.name]).toBe('mockSchemaObject');
      });
    });
  });

  describe('.property()', () => {
    it('returns type, keyed by column name', () => {
      var result = schema.property(columns[0]);
      
      expect(result).toEqual({
        forename: {
          type: 'string'
        }
      });
    });
  });

  describe('.required()', () => {
    it('returns array of columns that are not nullable and do not have a default', () => {
      var required = schema.required(columns);
      expect(required).toEqual(['forename', 'surname']);
    });
  });
});
