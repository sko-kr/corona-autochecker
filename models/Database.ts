import { LowdbSync } from 'lowdb';

export type LowDb = LowdbSync<{ checkedDate: { [dateStr: string]: boolean } }>;
