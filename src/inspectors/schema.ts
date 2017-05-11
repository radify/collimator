import Promise     from 'bluebird';
import {IDatabase} from 'pg-promise';
import {mergeAll, flatten}  from 'ramda';

import query from '../util/fileQuery';

/**
 * Representation of columns enumerated by the schema query
 */
export interface Column {
  name:     string;
  type:     string;
  nullable: boolean;
  default:  string | number;
  isprimarykey: boolean;
  constraints?: string[];
}

/**
 * Describes an object according to the JSON Schema v4 standard
 */
export interface SchemaDocument {
  $schema:    string;
  title:      string;
  type:       string;
  properties: SchemaProperties;
  required:   string[];
}

/**
 * Describes an object's properties according to the JSON Schema standard
 */
export interface SchemaProperties {
  [name: string]: PropertyAttributes;
}

/**
 * Describes an individual properties' attributes according to the JSON Schema
 * standard
 */
export interface PropertyAttributes {
  type: string;
  readOnly?: boolean;
  enum?: any[];
}

/**
 * Inspects the column definitions for a table specified by `name`, and returns
 * a promise that will resolve to a JSON Schema v4 document. The resulting
 * schema document can be used to validate objects that are candidates for
 * insertion into table `name`
 *
 * @param db   A pg-promise database instance
 * @param name The name of the table to generate a schema for
 * @returns A promise that will resolve to the schema for the given table
 */
export default function schema(db: IDatabase<any>, name: string): Promise<SchemaDocument> {
  return query(db, './schema.sql', {name: name})
    .then(columns => table(name, columns));
}

/**
 * Creates a JSON Schema v4 document for a table `name` comprised of `columns`
 *
 * @param name    The name of the table being documented
 * @param columns The columns being documented
 * @returns       A JSON Schema v4 document that describes the given table
 */
export function table(name: string, columns: Column[]): SchemaDocument {
  return {
    $schema:    'http://json-schema.org/draft-04/schema#',
    title:      name,
    type:       'object',
    properties: properties(columns),
    required:   required(columns)
  };
}

/**
 * Maps over an array of `columns` to generate a schema definition for each
 * column, keyed by name
 *
 * @param columns The columns to document
 * @returns       A map of JSON Schema property definitions, keyed by column name
 */
export function properties(columns: Column[]): SchemaProperties {
  var columnProperties = columns.map(property);
  return mergeAll<SchemaProperties>(columnProperties);
}

/**
 * Dcouments a single column according to JSON Schema semantics
 *
 * @param column The column to document
 * @returns      A JSON Schema property definition
 */
export function property(column: Column): SchemaProperties {
  const TYPES:any = {
    bigserial:   {type: 'number'},
    boolean:     {type: 'boolean'},
    character:   {type: 'string'},
    bigint:      {type: 'number'},
    integer:     {type: 'number'},
    json:        {type: 'object'},
    jsonb:       {type: 'object'},
    numeric:     {type: 'number'},
    real:        {type: 'number'},
    smallint:    {type: 'number'},
    smallserial: {type: 'number'},
    serial:      {type: 'number'},
    text:        {type: 'string'},

    interval: {
      type: 'object',
      format: 'interval',
      minProperties: 1,
      additionalProperties: false,
      properties: {
        milliseconds: {type: 'number'},
        seconds: {type: 'number'},
        minutes: {type: 'number'},
        hours:   {type: 'number'},
        days:    {type: 'number'},
        months:  {type: 'number'},
        years:   {type: 'number'}
      }
    },

    'character varying':           {type: 'string'},
    'double precision':            {type: 'number'},
    'date':                        {type: 'string', format: 'date-time'},
    'time without time zone':      {type: 'string', format: 'date-time'},
    'time with time zone':         {type: 'string', format: 'date-time'},
    'timestamp without time zone': {type: 'string', format: 'date-time'},
    'timestamp with time zone':    {type: 'string', format: 'date-time'}
  };

  return {
    [column.name]: mergeAll<PropertyAttributes>([
      TYPES[column.type],
      isReadOnly(column),
      isEnumConstraint(column)
    ])
  };
}

/**
 * Determines if a column should be declared read-only by determining if the
 * column is a primary key that uses a sequence
 *
 * @param column The column to inspect
 * @returns `{readOnly: true}` if the column should be marked read-only
 */
export function isReadOnly(column: Column) {
  var isPrimary = column.isprimarykey &&
    column.nullable === false &&
    typeof column.default === 'string' &&
    (column.default as string).startsWith('nextval');

  if (isPrimary) {
    return {readOnly: true};
  }
}

/**
 * Determines if a column should be declared an enumeration by determining if
 * the column contains a suitable CHECK constraint
 *
 * @param column the column to inspect
 * @returns `{enum: [values]}` if the column contains a suitable CHECK contraint
 */
export function isEnumConstraint(column: Column) {
  if (!column.constraints || !column.constraints.length) {
    return;
  }

  const ENUM_CHECK_REGEX = /^\(.* = ANY \(ARRAY\[(.*)\]\)\)/;
  const ENUM_EXTRACT_VALUE_REGEX = /^'(.*)'::.*/;

  var values = column.constraints
    .map(constraint => {
      if (!constraint) {
        return;
      }

      var result = constraint.match(ENUM_CHECK_REGEX);
      if (!result || !result[1]) {
        return;
      }

      return result[1].split(', ')
        .map(value => {
          var [match, value] = value.match(ENUM_EXTRACT_VALUE_REGEX);
          return value;
        })
    })
    .filter(values => !!values);

  if (!values.length) {
    return;
  }

  return {enum: flatten(values)};
}

/**
 * Determines the required properties by looking for `columns` that are not
 * nullable and do not specify a default value
 *
 * @param columns The columns to document
 * @returns       A list of property names that are required
 */
export function required(columns: Column[]): string[] {
  function isRequired(column: Column): boolean {
    return column.nullable === false && column.default === null;
  }

  return columns
    .filter(isRequired)
    .map(column => column.name);
}
