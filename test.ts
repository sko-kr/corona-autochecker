import { of } from 'rxjs';
import { switchMap, tap } from 'rxjs/operators';
import { launchPage } from './puppeteer/launch';
import FileSync from 'lowdb/adapters/FileSync';
import low from 'lowdb';

const adapter = new FileSync('db.json')
const db = low(adapter)

of(1).pipe(
  switchMap(() => {
    return launchPage({
      url: 'https://eduro.sen.go.kr/stv_cvd_co00_002.do',
      devMode: process.env.NODE_ENV === 'development',
    });
  }),
  tap(({ page }) => {
    page.screenshot({ path: `${new Date().getTime()}.png` })
  }),
  tap(() => db.set('test', 'Written').write())
).subscribe(x => console.log('success'), err => console.dir('err'))