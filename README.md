[![Build Status](https://magnum.travis-ci.com/radify/collimator.svg?token=3HSekyeuSZHozsotHxz2&branch=master)](https://magnum.travis-ci.com/radify/collimator)

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

# Development

Install dependencies with:

```bash
npm install
```

Run the tests with:

```bash
gulp
```

Run unit test coverage with:

```bash
gulp coverage
```

Enter development mode with:

```bash
gulp dev
```

This will watch the `src` and `spec` directories and run `gulp` automatically when a change is detected. Note that it will not run the tests until it detects a change, so you may prefer to run it with `gulp & gulp dev`.

# Installation

For now, clone this Git repository, followed by `npm install`.
