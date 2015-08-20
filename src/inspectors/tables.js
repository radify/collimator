(function() {
  'use strict';

  /**
   * Get names for all enumberable tables
   *
   * @param {Promise.<Database>} db - The pg-promise connection
   * @returns {Promise.<Object[]>} A promise that will resolve to the tables that were enumerated
   */
  function tables(db) {
    var query = require('../util/fileQuery');
    return query(db, './tables.sql');
  }

  module.exports = tables;
}());
