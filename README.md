# Collimator

Collimator is a JavaScript library that uses reflection techniques to introspect PostgreSQL databases:

- Enumerate tables
- Generate [JSON Schema v4][jsonschema] for a given table
- Extract table relationship information using foreign key constraints

[jsonschema]: http://json-schema.org

# Why?

Traditionally, programmers have defined their schema by writing model definitions in application code. Some kind of migration tool then transforms this schema into SQL, and applies it against a database.

Collimator allows this pattern to be reversed. The database becomes the canonical source of schema and relationship metadata.

# Prior Art

The approach to schema extraction is inspired by [DDL.js][js-ddl]. Collimator's implementation is currently not as robust as DDL.js, and only targets PostgreSQL (an intentional design decision, and unlikely to change). However, Collimator supports the extraction of relationship information.

[js-ddl]: https://github.com/moll/js-ddl

# Installation

For now, clone this Git repository, followed by `npm install`.
