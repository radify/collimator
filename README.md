[![Build Status](https://travis-ci.org/radify/collimator.svg)](https://travis-ci.org/radify/collimator)

# Collimator

Collimator is a JavaScript library that uses reflection techniques to introspect PostgreSQL databases:

- Enumerate table names and identify primary keys
- Generate [JSON Schema v4][jsonschema] for a given table
- Extract table relationship information using foreign key constraints

[jsonschema]: http://json-schema.org

# Why?

Traditionally, programmers have defined their schema by writing model definitions in application code. Some kind of migration tool then transforms this schema into SQL, and applies it against a database.

Collimator allows this pattern to be reversed. The database now becomes the canonical source of your application's schema and relationship metadata.

# Prior Art

The approach to schema extraction is inspired by [DDL.js][js-ddl]. Collimator's implementation is currently not as robust as DDL.js, and only targets PostgreSQL (an intentional design decision, and unlikely to change). However, Collimator supports the extraction of relationship information.

[js-ddl]: https://github.com/moll/js-ddl

# Installation

Install as a dependency in your application with `npm install --save collimator`.

# Usage

Enumerate table names and primary keys with `collimator.tables(db)`.

Generate JSON Schema with `collimator.schema(db, 'tableName')`.

Extract relationship information with `collimator.relationships(db, 'tableName')`.

The top-level Collimator functions (`tables`, `schema` and `relationships`) accept a [pg-promise][pg-promise] connection as their first argument, and return a promise. For further guidance, please refer to the [examples][examples] and [API Documentation][api-docs].

[pg-promise]: https://www.npmjs.com/package/pg-promise
[examples]: https://github.com/radify/collimator/tree/master/examples
[api-docs]: https://github.com/radify/collimator/blob/master/api.md

# Change Log

Please consult the [Change Log][changelog] for detailed notes on each release.

[changelog]: https://github.com/radify/collimator/blob/master/CHANGELOG.md

# Development

Install dependencies with:

```bash
npm install
```

Run the tests and build with:

```bash
gulp
```

Generate unit test coverage with:

```bash
gulp coverage
```

Update API documentation with:

```bash
gulp docs
```

Enter development mode with:

```bash
gulp watch
```

This will watch the `src` and `spec` directories and run `gulp` automatically when a change is detected. Note that it will not run the tests until it detects a change, so you may prefer to run it with `gulp & gulp dev`.
