

<!-- Start src/collimator.js -->

## collimator(db)

Inspect all enumerable table in a database, and return a promise that will
resolve to information about each table.

The resolved value will be an array of objects, each containing the
following properties:

- `name` - The name of the enumerated table
- `primaryKeys` - An array of column names containing primary keys
- `schema` - A JSON Schema v4 document that can be used to validated objects
  that are candidates for insertion into this table
- `relationships` - Relationship information, determined by foreign key
  contraints. See `collimator.relationships` for further information on the
  structure of this data.

### Params:

* **Database** *db* - A pg-promise `Database` instance

### Return:

* **Promise.\<Object>** A promise that will resolve to the information for each table

<!-- End src/collimator.js -->

<!-- Start src/inspectors/relationships.js -->

## collimator.relationships(db, name)

Inspects the foreign key constraints definted in the table specified by
`name`, and returns a promise that will resolve to relationship information
about that table.

This relationship information consists of `has` and `belongsTo` arrays. Each
element is an object with the following properties:

`name` - The name of the related table

`from` - The name of the linking field in the table being enumerated (ie,
         this table's foreign key)

`to`   - The name of the linking field in the related table (ie, that
         table's primary key)

### Params:

* **Database** *db* - A pg-promise `Database` instance
* **String** *name* - The name of the table to get the relationship definitions for

### Return:

* **Promise.\<Object>** A promise that will resolve to the relationship definitions for the given table

<!-- End src/inspectors/relationships.js -->

<!-- Start src/inspectors/schema.js -->

## collimator.schema(db, name)

Inspects the column definitions for a table specified by `name`, and returns
a promise that will resolve to a JSON Schema v4 document. The resulting
schema document can be used to validate objects that are candidates for
insertion into table `name`.

### Params:

* **Database** *db* - A pg-promise `Database` instance
* **String** *name* - The name of the table to get the schema of

### Return:

* **Promise.\<Object>** A promise that will resolve to the schema for the given table

## collimator.schema.table(name, columns)

Creates a JSON Schema v4 document for a table `name` comprised of `columns`.

### Params:

* **String** *name* - The name of the column being documented
* **Array.\<Object>** *columns* - The columns being documented

### Return:

* **Object** The generated JSON Schema document

## collimator.schema.properties(columns)

Maps over an array of `columns` to generate a schema definition for each
column, keyed by name.

### Params:

* **Array.\<Object>** *columns* - The columns to document

### Return:

* **Object** The generated JSON Schema properties object, keyed by column name

## collimator.schema.property(column)

Dcouments a single column according to JSON Schema semantics.

### Params:

* **Object** *column* - The column to document

### Return:

* **Object** The generated JSON Schema property object

## collimator.schema.required(columns)

Determines the required properties by looking for `columns` that are not
nullable and do not specify a default value

### Params:

* **Array.\<Object>** *columns* - The columns to document

### Return:

* **Array.\<String>** Names of required columns

<!-- End src/inspectors/schema.js -->

<!-- Start src/inspectors/tables.js -->

## collimator.tables(db)

Inspects the tables defined in a database, and returns a promise that will
resolve to information about those tables.

This table information consists of an array of objects. Each element has the
following properties:

`name` - The name of the enumerated table
`primaryKeys` - An array of column names that are primary keys

### Params:

* **Database** *db* - A pg-promise `Database` instance

### Return:

* **Promise.\<Array.<Object>>** A promise that will resolve to table information for the given database

<!-- End src/inspectors/tables.js -->

<!-- Start src/util/fileQuery.js -->

<!-- End src/util/fileQuery.js -->

