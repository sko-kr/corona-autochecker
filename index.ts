import dotenv from 'dotenv';
import FileSync from 'lowdb/adapters/FileSync'
import low from 'lowdb';
import { format, getHours, getMinutes } from 'date-fns'
import { timer } from 'rxjs';
import { filter, switchMap, tap } from 'rxjs/operators';
import { coronaCheckEpic } from './epics/coronaCheckEpic';

dotenv.config();

const adapter = new FileSync('db.json')
const db = low(adapter)

const TEN_MINUTES = 1000 * 60 * 10

timer(0, TEN_MINUTES).pipe(
  filter(coronaCheckCondition),
  switchMap(coronaCheckEpic),
  tap(updateCheckedDate)
).subscribe(() => {
  /**TODO: notify successful check*/
}, () => {
  /**TODO: notify failed check*/
})


function coronaCheckCondition() {
  const date = new Date();
  const hours = getHours(date);
  const minutes = getMinutes(date);
  /** 8시 이후, 7시 30분전은 무시한다.*/
  if (hours >= 8 || hours < 7 || (hours === 7 && minutes < 30)) {
    return false;
  }
  const dateStr = format(date, 'yyyy-MM-dd');
  const checkedDate = db.get('checkedDate').value();
  return !checkedDate[dateStr];
}

function updateCheckedDate() {
  const date = new Date();
  const dateStr = format(date, 'yyyy-MM-dd');
  const checkedDate = db.get('checkedDate').value();
  checkedDate[dateStr] = true;
  db.set('checkedDate', checkedDate).write();
}
