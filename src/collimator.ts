import Promise, {props} from 'bluebird';
import {IDatabase} from 'pg-promise';
import {merge}     from 'ramda';

import tables, {TableDescription}     from './inspectors/tables';
import schema, {SchemaDocument}       from './inspectors/schema';
import relationships, {Relationships} from './inspectors/relationships';

/**
 * Extended description of a Table that includes information about the table
 * schema and relationships to other tables
 */
export interface FullTableDescription extends TableDescription {
  schema: SchemaDocument;
  relationships: Relationships[];
}

/**
 * Inspect all enumerable table in a database, and return a promise that will
 * resolve to information about each table.
 *
 * @param db A pg-promise database instance
 * @returns  A promise that will resolve to the information for each table
 */
export function inspect(db: IDatabase<any>): Promise<FullTableDescription[]> {
  function inspectors(table: TableDescription) {
    var queries = {
      schema: schema(db, table.name),
      relationships: relationships(db, table.name)
    };

    return <Promise<FullTableDescription>> props(queries).then(merge(table));
  }

  return tables(db).map(inspectors);
}

export {tables, schema, relationships};
