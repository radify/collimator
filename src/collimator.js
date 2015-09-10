'use strict';

var bluebird = require('bluebird');
var R        = require('ramda');

/**
 * Inspect all enumerable table in a database, and return a promise that will
 * resolve to information about each table.
 *
 * The resolved value will be an array of objects, each containing the
 * following properties:
 *
 * - `name` - The name of the enumerated table
 * - `primaryKeys` - An array of column names containing primary keys
 * - `schema` - A JSON Schema v4 document that can be used to validated objects
 *   that are candidates for insertion into this table
 * - `relationships` - Relationship information, determined by foreign key
 *   contraints. See `collimator.relationships` for further information on the
 *   structure of this data.
 *
 * @function collimator
 * @param {Promise.<Database>} db - The pg-promise connection
 * @returns {Promise.<Object>} A promise that will resolve to the information for each table
 */
function collimator(db) {
  return collimator.tables(db)
    .map(function(table) {
      return bluebird.props(R.merge(table, {
        schema:        collimator.schema(db, table.name),
        relationships: collimator.relationships(db, table.name)
      }));
    });
}

collimator.tables        = require('./inspectors/tables');
collimator.schema        = require('./inspectors/schema');
collimator.relationships = require('./inspectors/relationships');

module.exports = collimator;
