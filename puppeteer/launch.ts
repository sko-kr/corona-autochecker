import { switchMap } from 'rxjs/operators';
import { from } from 'rxjs';
import { Browser } from 'puppeteer';

const puppeteer = require('puppeteer');

interface Params {
  url: string;
  devMode?: boolean;
}

const launchBrowser = ({ devMode }: { devMode?: boolean }) => from<Promise<Browser>>(puppeteer.launch({ headless: !devMode }))

const openPage = ({ url }: { url: string }) => switchMap(async (browser: Browser) => {
  const page = await browser.newPage()
  await page.goto(url, { waitUntil: 'networkidle2' });
  return { browser, page };
})

const reloadPageIfNoInput = switchMap(async ({ browser, page }) => {
  let pageExists = await page.$('#pName');
  let count = 0
  while (!pageExists && count < 10) {
    await page.reload({ waitUntil: ['load', 'networkidle0'] })
    pageExists = await page.$('#pName')
    ++count;
  }
  return { browser, page };
})

export const launchPage = ({ url, devMode }: Params) => launchBrowser({ devMode }).pipe(
  openPage({ url }),
  reloadPageIfNoInput
)
