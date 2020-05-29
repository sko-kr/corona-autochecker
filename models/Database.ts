import { LowdbSync } from 'lowdb';

export interface User {
  id: number;
  name: string;
  schoolName: string;
  dob: string;
  checkedDate: { [dateStr: string]: boolean }
}

export type LowDb = LowdbSync<{
  users: Array<User>
}>;
