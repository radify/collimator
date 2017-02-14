import Promise     from 'bluebird';
import {IDatabase} from 'pg-promise';
import query       from '../util/fileQuery';

/**
 * Describes properties of a view
 */
export interface ViewDescription {
  /**
   * The name of the enumerated view
   */
  name: string;
}

/**
 * Inspects the views defined in a database, and returns a promise that will
 * resolve to information about those views.
 *
 * @param db - A pg-promise Database object
 * @returns A promise that will resolve to view information for the given
 * database
 */
export default function views(db: IDatabase<any>): Promise<ViewDescription[]> {
  return query(db, './views.sql');
}
