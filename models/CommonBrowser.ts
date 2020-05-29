import { Browser, Page } from 'puppeteer';

export interface CommonBrowser {
  browser: Browser;
  page: Page;
}