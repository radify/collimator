var pg         = require('pg-promise')();
var collimator = require('../lib/collimator.js').default;
var equal      = require('assert').equal;
var diff       = require('deep-diff').diff;

var db = pg({database: 'collimator-integration-test'});

var expected = [{
  name: 'users',
  primaryKeys: ['id'],

  schema: {
    $schema: 'http://json-schema.org/draft-04/schema#',
    title: 'users',
    type: 'object',

    properties: {
      id: {type: 'integer'},
      username: {type: 'string'},
      password: {type: 'string'},
      created_at: {},
      updated_at: {}
    },

    required: ['username', 'password']
  },
  relationships: {
    belongsTo: [],
    has: [{
      name: 'tasks',
      from: 'id',
      to: 'owner'
    }]
  }
},
{
  name: 'tasks',
  primaryKeys: ['id'],
  schema: {
    $schema: 'http://json-schema.org/draft-04/schema#',
    title: 'tasks',
    type: 'object',
    properties: {
      id: {
        type: 'integer'
      },
      title: {
        type: 'string'
      },
      description: {
        type: 'string'
      },
      complete: {
        type: 'boolean'
      },
      created_at: {},
      updated_at: {},
      owner: {
        type: 'integer'
      }
    },
    required: ['title', 'owner']
  },
  relationships: {
    belongsTo: [{
      name: 'users',
      from: 'owner',
      to: 'id'
    }],
    has: []
  }
}];

collimator(db)
  .then(function(result) {
    return diff(result, expected)
  })
  .then(function(diff) {
    equal(diff, undefined);
  })
  .done(process.exit);
