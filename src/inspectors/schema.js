'use strict';
var R = require('ramda');

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
  var query = require('../util/fileQuery');

  return query(db, './schema.sql', {name: name})
    .then(R.partial(schema.table, name));
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
    properties: schema.properties(columns),
    required:   schema.required(columns)
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
  var columnProperties = R.map(schema.property, columns);
  return R.mergeAll(columnProperties);
}

/**
 * Dcouments a single column according to JSON Schema semantics.
 *
 * @function collimator.schema.property
 * @param {Object} column - The column to document
 * @returns {Object} The generated JSON Schema property object
 */
function property(column) {
  var TYPES = {
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

  var schema = {
    type: TYPES[column.type]
  };

  return R.createMapEntry(column.name, schema);
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
  var isRequired = function(column) {
    return column.nullable === false && column.default === null;
  };

  var requiredColumns = R.filter(isRequired, columns);
  return R.pluck('name', requiredColumns);
}

schema.table      = table;
schema.property   = property;
schema.required   = required;
schema.properties = properties;

module.exports = schema;
