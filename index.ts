import dotenv from 'dotenv';
import FileSync from 'lowdb/adapters/FileSync'
import low from 'lowdb';
import { timer } from 'rxjs';
import { filter, switchMap, tap } from 'rxjs/operators';
import { coronaCheckEpic } from './epics/coronaCheckEpic';
import { coronaCheckCondition, updateCheckedDate } from './utils/utils';

const TEN_MINUTES = 1000 * 60 * 10

dotenv.config();

const adapter = new FileSync('db.json')
const db = low(adapter)

timer(0, TEN_MINUTES).pipe(
  filter(() => coronaCheckCondition(db)),
  switchMap(coronaCheckEpic),
  tap(() => updateCheckedDate(db))
).subscribe(() => {
  /**TODO: notify successful check*/
}, () => {
  /**TODO: notify failed check*/
})

