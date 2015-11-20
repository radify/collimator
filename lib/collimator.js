'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});
exports['default'] = collimator;

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _bluebird = require('bluebird');

var _bluebird2 = _interopRequireDefault(_bluebird);

var _ramda = require('ramda');

var _inspectorsTables = require('./inspectors/tables');

var _inspectorsTables2 = _interopRequireDefault(_inspectorsTables);

var _inspectorsSchema = require('./inspectors/schema');

var _inspectorsSchema2 = _interopRequireDefault(_inspectorsSchema);

var _inspectorsRelationships = require('./inspectors/relationships');

var _inspectorsRelationships2 = _interopRequireDefault(_inspectorsRelationships);

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
  var inspect = function inspect(table) {
    return _bluebird2['default'].props((0, _ramda.merge)(table, {
      schema: (0, _inspectorsSchema2['default'])(db, table.name),
      relationships: (0, _inspectorsRelationships2['default'])(db, table.name)
    }));
  };

  return (0, _inspectorsTables2['default'])(db).map(inspect);
}

exports.tables = _inspectorsTables2['default'];
exports.schema = _inspectorsSchema2['default'];
exports.relationships = _inspectorsRelationships2['default'];
//# sourceMappingURL=collimator.js.map