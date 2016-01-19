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
export default function schema(db, name) {
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
export function table(name, columns) {
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
export function properties(columns) {
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
export function property(column) {
  const TYPES = {
    bigserial:   {type: 'integer'},
    boolean:     {type: 'boolean'},
    character:   {type: 'string'},
    date:        {type: 'string'},
    bigint:      {type: 'integer'},
    integer:     {type: 'integer'},
    json:        {type: 'object'},
    jsonb:       {type: 'object'},
    numeric:     {type: 'number'},
    real:        {type: 'number'},
    smallint:    {type: 'integer'},
    smallserial: {type: 'integer'},
    serial:      {type: 'integer'},
    text:        {type: 'string'},

    'character varying':           {type: 'string'},
    'double precision':            {type: 'number'},
    'time without time zone':      {type: 'string', format: 'date-time'},
    'time with time zone':         {type: 'string', format: 'date-time'},
    'timestamp without time zone': {type: 'string', format: 'date-time'},
    'timestamp with time zone':    {type: 'string', format: 'date-time'}
  };

  return {
    [column.name]: TYPES[column.type]
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
export function required(columns) {
  const isRequired = column =>
    column.nullable === false && column.default === null;

  var requiredColumns = filter(isRequired, columns);
  return pluck('name', requiredColumns);
}
