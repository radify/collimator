(function() {
  'use strict';

  var R = require('ramda');

  /**
   * Get the schema document for a given table
   *
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
   * Create a JSON Schema document for a given table and its columns.
   * This function is curried.
   *
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
   * Document multiple columns according to JSON Schema semantics
   *
   * @param {Object[]} columns - The columns to document
   * @returns {Object} The generated JSON Schema properties object, keyed by column name
   */
  function properties(columns) {
    var columnProperties = R.map(schema.property, columns);
    return R.mergeAll(columnProperties);
  }

  /**
   * Document a single column according to JSON Schema semantics
   *
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
   * Determine required properties by looking for columns that are not nullable
   * and do not specify a default value
   *
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
}());
