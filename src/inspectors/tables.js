import query from '../util/fileQuery';

/**
 * Inspects the tables defined in a database, and returns a promise that will
 * resolve to information about those tables.
 *
 * This table information consists of an array of objects. Each element has the
 * following properties:
 *
 * `name` - The name of the enumerated table
 * `primaryKeys` - An array of column names that are primary keys
 *
 * @function collimator.tables
 * @param {Promise.<Database>} db - The pg-promise connection
 * @returns {Promise.<Array<Object>>} A promise that will resolve to table
 * information for the given database
 */
export default function tables(db) {
  return query(db, './tables.sql');
}
