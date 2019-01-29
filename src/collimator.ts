import Promise, { props } from 'bluebird';
import { IDatabase } from 'pg-promise';
import { merge } from 'ramda';

import views, { ViewDescription } from './inspectors/views';
import tables, { TableDescription } from './inspectors/tables';
import schema, { SchemaDocument } from './inspectors/schema';
import usedTables, { UsedTable } from './inspectors/usedTables';
import relationships, { Relationships } from './inspectors/relationships';

/**
 * Extended description of a Table that includes information about the table
 * schema and relationships to other tables
 */
export interface ExtendedTableDescription {
  schema: SchemaDocument;
  relationships: Relationships;
}

/**
 * Extended description of a View that includes information about the schema and used tables
 */
export interface ExtendedViewDescription {
  schema: SchemaDocument;
  uses: UsedTable[];
}

export interface InspectResult {
  tables: Array<TableDescription & ExtendedTableDescription>;
  views: Array<ViewDescription & ExtendedViewDescription>;
}

/**
 * Options to supply to inspectors
 */
export interface Options {
  /**
   * If `true`, then allow numeric types emitted in schema to be oneOf `number`
   * or `string` with a pattern
   */
  looseNumbers?: boolean;
  /**
   * If `true`, then include columns that have a default value in the `required`
   * array. This is useful for differentiating between the default `schema`
   * inspector behaviour, and creating an additional Schema document that
   * describes the result of a SELECT query, for example.
   */
  requireDefaults?: boolean;
}

/**
 * Inspect all enumerable table in a database, and return a promise that will
 * resolve to information about each table.
 *
 * @param db A pg-promise database instance
 * @param options Options to supply to inspector functions
 * @returns  A promise that will resolve to the information for each table
 */
export function inspect(db: IDatabase<any>, options: Options = {}): Promise<InspectResult> {
  const inspectTable = (table: TableDescription) =>
    (props({
      schema: schema(db, table.name),
      relationships: relationships(db, table.name)
    }) as Promise<ExtendedTableDescription>)
      .then(merge(table));

  const inspectView = (view: ViewDescription) =>
    (props({
      schema: schema(db, view.name),
      uses: usedTables(db, view.name),
    }) as Promise<ExtendedViewDescription>)
      .then(merge(view));

  return props({
    tables: tables(db).map(inspectTable),
    views: views(db).map(inspectView)
  }) as Promise<InspectResult>;
}

export { tables, schema, relationships };
