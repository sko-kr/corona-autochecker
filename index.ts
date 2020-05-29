import dotenv from 'dotenv';
import { coronaCheckEpic } from './epics/coronaCheckEpic';

dotenv.config();

coronaCheckEpic().subscribe(x => console.log(x), err => console.log(err))
