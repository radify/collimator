(function() {
  'use strict';

  var Promise = require('bluebird');

  /**
   * Get the relationship definitions for a given table
   *
   * @param {Promise.<Database>} db - The pg-promise connection
   * @param {String} name - The name of the table to get the relationship definitions for
   * @returns {Promise.<Object>} A promise that will resolve to the relationship definitions for the given table
   */
  function relationships(db, name) {
    var query = require('../util/fileQuery');

    var queries = {
      belongsTo: query(db, './relationships/belongsTo.sql', {name: name}),
      has:       query(db, './relationships/has.sql', {name: name})
    };

    return Promise.props(queries);
  }

  module.exports = relationships;
}());
