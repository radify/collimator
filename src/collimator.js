import bluebird from 'bluebird';
import {merge}  from 'ramda';

import tables        from './inspectors/tables';
import schema        from './inspectors/schema';
import relationships from './inspectors/relationships';

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
  const inspect = table => bluebird.props(merge(table, {
    schema:        schema(db, table.name),
    relationships: relationships(db, table.name)
  }));

  return tables(db).map(inspect);
}

export {tables, schema, relationships};
export default collimator;
