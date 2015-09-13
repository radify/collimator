import schema        from '../../src/inspectors/schema';
import MockFileQuery from '../MockFileQuery';

import { table, property, properties, required } from '../../src/inspectors/schema';

describe('schema', () => {
  const columns = [
    {name: 'forename', nullable: false, default: null, type: 'character varying'},
    {name: 'surname',  nullable: false, default: null, type: 'character varying'},
    {name: 'age',      nullable: false, default: 30,   type: 'smallint'},
    {name: 'gender',   nullable: true,  default: null, type: 'character'}
  ];

  describe('schema()', () => {
    it('queries db with `name`, passes result to .table(), and returns a promise', (done) => {
      var query = new MockFileQuery();
      var table = jasmine.createSpy('table').and.returnValue('mockSchema');
      schema.__Rewire__('query', query);
      schema.__Rewire__('table', table);

      schema('mockDatabase', 'tableName')
        .then((result) => {
          expect(query).toHaveBeenCalledWith('mockDatabase', './schema.sql', {name: 'tableName'});
          expect(table).toHaveBeenCalledWith('tableName', columns);
          expect(result).toBe('mockSchema');
        })
        .then(done);

      query.deferred.resolve(columns);
    });
  });

  describe('.table()', () => {
    it('returns a JSON Schema object', () => {
      var properties = jasmine.createSpy('properties').and.returnValue('mockPropertyObject');
      var required   = jasmine.createSpy('required').and.returnValue('mockRequiredArray');

      schema.__Rewire__('properties', properties);
      schema.__Rewire__('required',   required);

      var result = table('myTable', columns);

      expect(properties).toHaveBeenCalledWith(columns);
      expect(required).toHaveBeenCalledWith(columns);

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
      var property = jasmine.createSpy('property').and.callFake(column => ({
        [column.name]: 'mockSchemaObject'
      }));

      schema.__Rewire__('property', property);

      var result = properties(columns);

      columns.forEach((column) => {
        expect(property).toHaveBeenCalledWith(column);
        expect(result[column.name]).toBe('mockSchemaObject');
      });
    });
  });

  describe('.property()', () => {
    it('returns type, keyed by column name', () => {
      var result = property(columns[0]);
      
      expect(result).toEqual({
        forename: {
          type: 'string'
        }
      });
    });
  });

  describe('.required()', () => {
    it('returns array of columns that are not nullable and do not have a default', () => {
      var result = required(columns);
      expect(result).toEqual(['forename', 'surname']);
    });
  });
});
