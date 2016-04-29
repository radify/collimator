import Promise, {promisify} from 'bluebird';
import callsite    from 'callsite';
import {IDatabase} from 'pg-promise';
import {resolve}   from 'path';
import {readFile}  from 'fs';

type readFileP  = (path: string, encoding: string) => Promise<Buffer>;
const readFileP = <readFileP>promisify(readFile);

function resolvePath(file: string) {
  var stack = callsite();
  var caller = stack[2];
  return resolve(caller.getFileName(), '..', file);
}

export default function fileQuery(db: IDatabase<any>, file: string, params?: any, resultMask?: number) {
  var path = resolvePath(file);

  return readFileP(path, 'utf-8')
    .then(query => db.query(query.toString(), params, resultMask));
}
