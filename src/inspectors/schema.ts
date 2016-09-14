import Promise     from 'bluebird';
import {IDatabase} from 'pg-promise';
import {mergeAll}  from 'ramda';

import query from '../util/fileQuery';

/**
 * Representation of columns enumerated by the schema query
 */
export interface Column {
  name:     string;
  type:     string;
  nullable: boolean;
  default:  string | number;
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
  [name: string]: {
    type: string
  }
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
    bigserial:   {type: 'integer'},
    boolean:     {type: 'boolean'},
    character:   {type: 'string'},
    date:        {type: 'string'},
    bigint:      {type: 'integer'},
    integer:     {type: 'integer'},
    json:        {type: 'object'},
    jsonb:       {type: 'object'},
    numeric:     {type: 'number'},
    real:        {type: 'number'},
    smallint:    {type: 'integer'},
    smallserial: {type: 'integer'},
    serial:      {type: 'integer'},
    text:        {type: 'string'},

    interval: {
      type: 'object',
      format: 'interval',
      minProperties: 1,
      additionalProperties: false,
      properties: {
        milliseconds: {type: 'integer'},
        seconds: {type: 'integer'},
        minutes: {type: 'integer'},
        hours:   {type: 'integer'},
        days:    {type: 'integer'},
        months:  {type: 'ingeger'},
        years:   {type: 'integer'}
      }
    },

    'character varying':           {type: 'string'},
    'double precision':            {type: 'number'},
    'time without time zone':      {type: 'string', format: 'date-time'},
    'time with time zone':         {type: 'string', format: 'date-time'},
    'timestamp without time zone': {type: 'string', format: 'date-time'},
    'timestamp with time zone':    {type: 'string', format: 'date-time'}
  };

  return {
    [column.name]: TYPES[column.type]
  };
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
