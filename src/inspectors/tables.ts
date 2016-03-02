import Promise     from 'bluebird';
import {IDatabase} from 'pg-promise';
import query       from '../util/fileQuery';

/**
 * Describes properties of a table
 */
export interface TableDescription {
  /**
   * The name of the enumerated table
   */
  name:        string;
  /**
   * An array of column names that are primary keys
   */
  primaryKeys: string[];
}

/**
 * Inspects the tables defined in a database, and returns a promise that will
 * resolve to information about those tables.
 *
 * @param db - A pg-promise Database object
 * @returns A promise that will resolve to table information for the given
 * database
 */
export default function tables(db: IDatabase<any>): Promise<TableDescription[]> {
  return query(db, './tables.sql');
}
