var pg = require('pg-promise')();
var db = pg({user: 'postgres', password: 'password', database: 'dvdrental'});
var collimator = require('../src/collimator.js');

collimator
	.tables(db)
	.then(console.log)
	.done(pg.end);
