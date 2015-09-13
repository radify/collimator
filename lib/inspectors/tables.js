'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _utilFileQuery = require('../util/fileQuery');

var _utilFileQuery2 = _interopRequireDefault(_utilFileQuery);

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
function tables(db) {
  return (0, _utilFileQuery2['default'])(db, './tables.sql');
}

exports['default'] = tables;
module.exports = exports['default'];
//# sourceMappingURL=../inspectors/tables.js.map