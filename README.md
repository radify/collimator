<div id="badges" align="center"></div>

# Collimator

## Reflection & Introspection for PostgreSQL Databases

### What is Collimator?

Collimator is a JavaScript library that uses reflection techniques to introspect PostgreSQL databases:

- Enumerate table names and identify primary keys
- Generate [JSON Schema v4][jsonschema] for a given table
- Extract table relationship information using foreign key constraints

[jsonschema]: http://json-schema.org

### Design Motivations

Traditionally, programmers have defined their schema by writing model definitions in application code. Some kind of migration tool then transforms this schema into SQL, and applies it against a database.

Collimator allows this pattern to be reversed. The database now becomes the canonical source of your application's schema and relationship metadata.

### Installation

Install as a dependency in your application with `npm install --save collimator`.

### Usage

Enumerate table names and primary keys with `collimator.tables(db)`.

Generate JSON Schema with `collimator.schema(db, 'tableName')`.

Extract relationship information with `collimator.relationships(db, 'tableName')`.

The top-level Collimator functions (`tables`, `schema` and `relationships`) accept a [pg-promise][pg-promise] `Database` instance as their first argument, and return a promise. For further guidance, please refer to the [examples][examples] and [API Documentation][api-docs].

[pg-promise]: https://www.npmjs.com/package/pg-promise
[examples]: https://github.com/radify/collimator/tree/master/examples
[api-docs]: https://github.com/radify/collimator/blob/master/docs/API.md

### Changelog

This project adheres to [Semantic Versioning](http://semver.org/). For a list of detailed changes, please refer to [CHANGELOG.md](CHANGELOG.md).

### Contributing

Please see [CONTRIBUTING.md](CONTRIBUTING.md).

### Prior Art

The approach to schema extraction is inspired by [DDL.js][js-ddl]. Collimator's implementation is currently not as robust as DDL.js, and only targets PostgreSQL (an intentional design decision, and unlikely to change). However, Collimator supports the extraction of relationship information.

[js-ddl]: https://github.com/moll/js-ddl

### License

collimator is released under the [BSD 3-clause “New” License](LICENSE).
