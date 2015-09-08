var pg = require('pg-promise')();
var db = pg({user: 'postgres', password: 'password', database: 'dvdrental'});
var bluebird = require('bluebird');
var collimator = require('../src/collimator.js');

collimator
	.tables(db)
	.map(function(table) {
    return bluebird.props({
      schema: collimator.schema(db, table.name),
      relationships: collimator.relationships(db, table.name)
    });
  })
  .then(console.log)
	.done(pg.end);
