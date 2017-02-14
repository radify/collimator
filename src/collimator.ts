import Promise, {props} from 'bluebird';
import {IDatabase} from 'pg-promise';
import {merge}     from 'ramda';

import views,  {ViewDescription}      from './inspectors/views';
import tables, {TableDescription}     from './inspectors/tables';
import schema, {SchemaDocument}       from './inspectors/schema';
import relationships, {Relationships} from './inspectors/relationships';

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
  //usedTables: string[];
}

export interface InspectResult {
  tables: Array<TableDescription & ExtendedTableDescription>;
  views: Array<ViewDescription & ExtendedViewDescription>;
}

/**
 * Inspect all enumerable table in a database, and return a promise that will
 * resolve to information about each table.
 *
 * @param db A pg-promise database instance
 * @returns  A promise that will resolve to the information for each table
 */
export function inspect(db: IDatabase<any>): Promise<InspectResult> {
  const inspectTable = (table: TableDescription) =>
    (props({
      schema: schema(db, table.name),
      relationships: relationships(db, table.name)
    }) as Promise<ExtendedTableDescription>)
    .then(merge(table));

  const inspectView = (view: ViewDescription) =>
    (props({
      schema: schema(db, view.name)
    }) as Promise<ExtendedViewDescription>)
    .then(merge(view));

  return props({
    tables: tables(db).map(inspectTable),
    views:  views(db).map(inspectView)
  }) as Promise<InspectResult>;
}

export {tables, schema, relationships};
