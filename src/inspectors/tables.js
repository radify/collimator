'use strict';
/**
 * Inspects the tables defined in a database, and returns a promise that will
 * resolve to information about those tables.
 *
 * This table information consists of an array of objects. Each element has the
 * following properties:
 *
 * `name` - The name of the enumerated table
 *
 * @function collimator.tables
 * @param {Promise.<Database>} db - The pg-promise connection
 * @returns {Promise.<Object[]>} A promise that will resolve to table
 * information for the given database
 */
function tables(db) {
  var query = require('../util/fileQuery');
  return query(db, './tables.sql');
}

module.exports = tables;
