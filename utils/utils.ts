import { format, getHours, getMinutes } from "date-fns";
import { LowDb } from '../models/Database';

export function randomHumanDelay({ maxMs, minMs }: { maxMs: number; minMs: number } = { minMs: 600, maxMs: 2000 }) {
  return Math.round(Math.random() * (maxMs - minMs) + minMs)
}

export function coronaCheckCondition(db: LowDb) {
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

export function updateCheckedDate(db: LowDb) {
  const date = new Date();
  const dateStr = format(date, 'yyyy-MM-dd');
  const checkedDate = db.get('checkedDate').value();
  checkedDate[dateStr] = true;
  db.set('checkedDate', checkedDate).write();
}
