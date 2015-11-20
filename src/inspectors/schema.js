import query from '../util/fileQuery';
import {map, mergeAll, filter, pluck} from 'ramda';

/**
 * Inspects the column definitions for a table specified by `name`, and returns
 * a promise that will resolve to a JSON Schema v4 document. The resulting
 * schema document can be used to validate objects that are candidates for
 * insertion into table `name`.
 *
 * @function collimator.schema
 * @param {Promise.<Database>} db - The pg-promise connection
 * @param {String} name - The name of the table to get the schema of
 * @returns {Promise.<Object>} A promise that will resolve to the schema for the given table
 */
function schema(db, name) {
  return query(db, './schema.sql', {name: name})
    .then(columns => table(name, columns));
}

/**
 * Creates a JSON Schema v4 document for a table `name` comprised of `columns`.
 *
 * @function collimator.schema.table
 * @param {String} name - The name of the column being documented
 * @param {Object[]} columns - The columns being documented
 * @returns {Object} The generated JSON Schema document
 */
function table(name, columns) {
  return {
    $schema:    'http://json-schema.org/draft-04/schema#',
    title:      name,
    type:       'object',
    properties: properties(columns),
    required:   required(columns)
  };
}

/**
 * Maps over an array of `columns` to generate a schema definition for each
 * column, keyed by name.
 *
 * @function collimator.schema.properties
 * @param {Object[]} columns - The columns to document
 * @returns {Object} The generated JSON Schema properties object, keyed by column name
 */
function properties(columns) {
  var columnProperties = map(property, columns);
  return mergeAll(columnProperties);
}

/**
 * Dcouments a single column according to JSON Schema semantics.
 *
 * @function collimator.schema.property
 * @param {Object} column - The column to document
 * @returns {Object} The generated JSON Schema property object
 */
function property(column) {
  const TYPES = {
    bigserial: 'integer',
    boolean: 'boolean',
    'character varying': 'string',
    character: 'string',
    date: 'string',
    bigint: 'integer',
    'double precision': 'number',
    integer: 'integer',
    json: 'object',
    jsonb: 'object',
    numeric: 'number',
    real: 'number',
    smallint: 'integer',
    smallserial: 'integer',
    serial: 'integer',
    text: 'string',
    'time without time zone': 'string',
    'timestamp without time zone': 'string'
  };

  return {
    [column.name]: {
      type: TYPES[column.type]
    }
  };
}

/**
 * Determines the required properties by looking for `columns` that are not
 * nullable and do not specify a default value
 *
 * @function collimator.schema.required
 * @param {Object[]} columns - The columns to document
 * @returns {String[]} Names of required columns
 */
function required(columns) {
  const isRequired = column =>
    column.nullable === false && column.default === null;

  var requiredColumns = filter(isRequired, columns);
  return pluck('name', requiredColumns);
}

export default schema;
export {table, property, properties, required};
