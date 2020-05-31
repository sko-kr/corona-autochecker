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

export const launchPage = ({ url, devMode }: Params) => launchBrowser({ devMode }).pipe(openPage({ url }))
