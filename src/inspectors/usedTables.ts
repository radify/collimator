import Promise     from 'bluebird';
import {IDatabase} from 'pg-promise';
import query       from '../util/fileQuery';

/**
 * Describes a Table that is used to generate a View
 */
export interface UsedTable {
  name: string;
}

/**
 * Inspects the Tables that are used by a View specified by `name`, and returns
 * a Promise that will resolve to a list of tables.
 *
 * @param db   A pg-promise database instance
 * @param name The name of the View to get used Table names for
 * @returns    A Promise that will resolve to the describe Tables that are used to
 * generate this View
 */
export default function usedTables(db: IDatabase<any>, name: string): Promise<UsedTable[]> {
  return query(db, './usedTables.sql', {name});
}
