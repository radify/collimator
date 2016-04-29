import Promise, {props} from 'bluebird';
import {IDatabase} from 'pg-promise';

import query from '../util/fileQuery';

/**
 * Describes the nature of the relationship between two tables
 */
export interface Relationship {
  /**
   * The name of the related table
   */
  name: string;
  /**
   * The name of the linking field in the table being inspected (ie, the foreign key in *this* table)
   */
  from: string;
  /**
   * The name of the linking field in the related table (ie, the primary key in *that* table)
   */
  to:   string;
};

/**
 * Describes the inward and outward relationships for this table
 */
export interface Relationships {
  /**
   * References to *this* table in *other* tables
   */
  belongsTo: Relationship[];
  /**
   * References to *other* tables from *this* table
   */
  has:       Relationship[];
}

/**
 * Inspects the foreign key constraints definted in the table specified by
 * `name`, and returns a promise that will resolve to relationship information
 * about that table.
 *
 * @param db   A pg-promise database instance
 * @param name The name of the table to get the relationship definitions for
 * @returns    A promise that will resolve to the relationship definitions for the given table
 */
export default function relationships(db: IDatabase<any>, name: string): Promise<Relationships> {
  return <Promise<Relationships>> props({
    belongsTo: query(db, './relationships/belongsTo.sql', {name}),
    has:       query(db, './relationships/has.sql', {name})
  });
}
