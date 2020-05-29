import { pipe } from 'rxjs';
import { switchMap } from 'rxjs/operators';

const puppeteer = require('puppeteer');

interface Params {
  url: string;
  devMode?: boolean;
}

export const launchPage = ({ url, devMode }: Params) => pipe(switchMap(async () => {
    const browser = await puppeteer.launch({ headless: !devMode });
    const page = await browser.newPage();
    await page.goto(url, { waitUntil: 'networkidle2' });
    return { browser, page };
  })
)