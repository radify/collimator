import schema, {
  table,
  property,
  properties,
  required,
  Column
} from '../../src/inspectors/schema';

import {IDatabase} from 'pg-promise';
import {resolve}   from 'bluebird';
import rewire      from 'jasmine-rewire';

describe('schema', () => {
  var mocks:any = {
    database: 'mockDatabase' as any as IDatabase<any>,
    columns: <Column[]>[
      {name: 'forename', nullable: false, default: null, type: 'character varying'},
      {name: 'surname',  nullable: false, default: null, type: 'character varying'},
      {name: 'age',      nullable: false, default: 30,   type: 'smallint'},
      {name: 'gender',   nullable: true,  default: null, type: 'character'}
    ]
  };

  describe('schema()', () => {
    Object.assign(mocks, rewire(schema, {
      query: jasmine.createSpy('query').and.callFake(() => resolve(mocks.columns)),
      table: jasmine.createSpy('table').and.returnValue('mockSchema')
    }));

    it('queries db with `name`, passes result to .table(), and returns a promise', done => {
      mocks.query.and.callFake(() => resolve(mocks.columns));

      schema(mocks.database, 'tableName')
        .then(result => {
          expect(mocks.query).toHaveBeenCalledWith(mocks.database, './schema.sql', {name: 'tableName'});
          expect(mocks.table).toHaveBeenCalledWith('tableName', mocks.columns);
          expect(result).toBe('mockSchema');
        })
        .then(done);
    });
  });

  describe('.table()', () => {
    Object.assign(mocks, rewire(schema, {
      properties: jasmine.createSpy('properties').and.returnValue('mockPropertyObject'),
      required:   jasmine.createSpy('required').and.returnValue('mockRequiredArray')
    }));

    it('returns a JSON Schema object', () => {
      var result = table('myTable', mocks.columns);

      expect(mocks.properties).toHaveBeenCalledWith(mocks.columns);
      expect(mocks.required).toHaveBeenCalledWith(mocks.columns);

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
    Object.assign(mocks, rewire(schema, {
      property: jasmine.createSpy('property').and.callFake((column:Column) => ({
        [column.name]: 'mockSchemaObject'
      }))
    }));

    it('returns an object representing schema for all columns', () => {
      var result = properties(mocks.columns);

      mocks.columns.forEach((column:Column) => {
        expect(mocks.property).toHaveBeenCalledWith(
          column,
          jasmine.any(Number),
          jasmine.any(Array)
        );
        expect(result[column.name]).toBe('mockSchemaObject');
      });
    });
  });

  describe('.property()', () => {
    it('returns type, keyed by column name', () => {
      var result = property(mocks.columns[0]);

      expect(result).toEqual({
        forename: {
          type: 'string'
        }
      });
    });

    it('converts timestamps to strings with `date-time` format', () => {
      var result = property({
        name:     'date_of_birth',
        nullable: false,
        default:  null,
        type:     'time without time zone'
      });

      expect(result).toEqual({
        date_of_birth: {
          type:   'string',
          format: 'date-time'
        }
      });
    });
  });

  describe('.required()', () => {
    it('returns array of columns that are not nullable and do not have a default', () => {
      var result = required(mocks.columns);
      expect(result).toEqual(['forename', 'surname']);
    });
  });
});
