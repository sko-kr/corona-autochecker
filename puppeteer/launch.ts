import { switchMap } from 'rxjs/operators';
import { from } from 'rxjs';
import puppeteer, { Browser } from 'puppeteer';

interface Params {
  url: string;
  devMode?: boolean;
}

const launchBrowser = ({ devMode }: { devMode?: boolean }) => from<Promise<Browser>>(puppeteer.launch({
  headless: !devMode,
  args: ['--no-sandbox']
}))

const openPage = ({ url }: { url: string }) => switchMap(async (browser: Browser) => {
  /**TODO intercept listener to make sure button click event is bound*/
    // (HTMLButtonElement.prototype as any).realAddEventListener = HTMLButtonElement.prototype.addEventListener;
    // HTMLButtonElement.prototype.addEventListener = function(a: any,b: any,c: any){
    //   //SHOOT CUSTOM EVENT which will be read by puppeteer;
    //   // ...
    //   (this as any).realAddEventListener(a,b,c);
    // };
  const page = await browser.newPage();
  await page.goto(url, { waitUntil: ['load', 'networkidle0'] });
  await wait(1000);
  return { browser, page };
})

const reloadPageIfNoInput = switchMap(async ({ browser, page }) => {
  // TODO: use existence of click event to decide whether page is loaded or not.
  let pageExists = await page.$('#pName');
  let count = 0
  while (!pageExists && count < 10) {
    await page.reload({ waitUntil: ['load', 'networkidle0'] })
    await wait(1000);
    pageExists = await page.$('#pName')
    ++count;
  }
  return { browser, page };
})

export const launchPage = ({ url, devMode }: Params) => launchBrowser({ devMode }).pipe(
  openPage({ url }),
  reloadPageIfNoInput
)

function wait(ms: number) {
  return new Promise(resolve => setTimeout(() => resolve(), ms))
}
