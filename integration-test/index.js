var pg      = require('pg-promise')();
var inspect = require('../lib/collimator').inspect;
var equal   = require('assert').equal;
var diff    = require('deep-diff').diff;

var db = pg({database: 'collimator-integration-test'});

var expected = {
  tables: [{
    name: 'users',
    primaryKeys: ['id'],

    schema: {
      $schema: 'http://json-schema.org/draft-07/schema#',
      title: 'users',
      type: 'object',

      properties: {
        id: {type: 'number', readOnly: true},
        username: {type: 'string'},
        password: {type: 'string'},
        created_at: {
          type: 'string',
          format: 'date-time'
        },
        updated_at: {
          type: 'string',
          format: 'date-time'
        },
      },

      required: ['username', 'password']
    },
    relationships: {
      belongsTo: [],
      has: [{
        name: 'tasks',
        from: 'id',
        to: 'owner'
      }, {
        name: 'task_watchers',
        from: 'id',
        to: 'user_id'
      }]
    }
  }, {
    name: 'tasks',
    primaryKeys: ['id'],
    schema: {
      $schema: 'http://json-schema.org/draft-07/schema#',
      title: 'tasks',
      type: 'object',
      properties: {
        id: {
          type: 'number',
          readOnly: true
        },
        title: {
          type: 'string'
        },
        description: {
          type: 'string'
        },
        status: {
          type: 'string',
          enum: ['new', 'started', 'complete']
        },
        created_at: {
          type: 'string',
          format: 'date-time'
        },
        updated_at: {
          type: 'string',
          format: 'date-time'
        },
        owner: {
          type: 'number'
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
      has: [{
        name: 'task_watchers',
        from: 'id',
        to: 'task_id'
      }]
    }
  }, {
    name: 'task_watchers',
    primaryKeys: ['task_id', 'user_id'],
    schema: {
      $schema: 'http://json-schema.org/draft-07/schema#',
      title: 'task_watchers',
      type: 'object',
      properties: {
        user_id: {
          type: 'number'
        },
        task_id: {
          type: 'number'
        }
      },
      required: ['user_id', 'task_id']
    },
    relationships: {
      belongsTo: [{
        name: 'users',
        from: 'user_id',
        to: 'id'
      }, {
        name: 'tasks',
        from: 'task_id',
        to: 'id'
      }],
      has: []
    }
  }],
  views: [{
    name: 'completed_tasks',
    schema: {
      $schema: 'http://json-schema.org/draft-07/schema#',
      title: 'completed_tasks',
      type: 'object',

      properties: {
        id: {
          type: 'number'
        },
        username: {
          type: 'string'
        },
        completed: {
          type: 'string',
          pattern: '^\\d+$'
        }
      },

      required: []
    },
    uses: [{
      name: 'tasks'
    }, {
      name: 'users'
    }]
  }]
};

inspect(db)
  .then(function(result) {
    return diff(result, expected);
  })
  .then(function(diff) {
    equal(diff, undefined);
  })
  .done(process.exit);
