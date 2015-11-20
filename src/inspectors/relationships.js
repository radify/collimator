import bluebird from 'bluebird';
import query    from '../util/fileQuery';

/**
 * Inspects the foreign key constraints definted in the table specified by
 * `name`, and returns a promise that will resolve to relationship information
 * about that table.
 *
 * This relationship information consists of `has` and `belongsTo` arrays. Each
 * element is an object with the following properties:
 *
 * `name` - The name of the related table
 *
 * `from` - The name of the linking field in the table being enumerated (ie,
 *          this table's foreign key)
 *
 * `to`   - The name of the linking field in the related table (ie, that
 *          table's primary key)
 *
 * @function collimator.relationships
 * @param {Promise.<Database>} db - The pg-promise connection
 * @param {String} name - The name of the table to get the relationship definitions for
 * @returns {Promise.<Object>} A promise that will resolve to the relationship definitions for the given table
 */
export default function relationships(db, name) {
  var queries = {
    belongsTo: query(db, './relationships/belongsTo.sql', {name}),
    has:       query(db, './relationships/has.sql', {name})
  };

  return bluebird.props(queries);
}
