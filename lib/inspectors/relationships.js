'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _bluebird = require('bluebird');

var _bluebird2 = _interopRequireDefault(_bluebird);

var _utilFileQuery = require('../util/fileQuery');

var _utilFileQuery2 = _interopRequireDefault(_utilFileQuery);

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
function relationships(db, name) {
  var queries = {
    belongsTo: (0, _utilFileQuery2['default'])(db, './relationships/belongsTo.sql', { name: name }),
    has: (0, _utilFileQuery2['default'])(db, './relationships/has.sql', { name: name })
  };

  return _bluebird2['default'].props(queries);
}

exports['default'] = relationships;
module.exports = exports['default'];
//# sourceMappingURL=../inspectors/relationships.js.map