import { switchMap } from 'rxjs/operators';
import { CommonBrowser } from '../models/CommonBrowser';
import { randomHumanDelay } from '../utils/utils';

export function input(selector: string, text = '', options = {
  maxTypingDelay: 60,
  minTypingDelay: 20
}) {
  return switchMap(async ({ page, browser }: CommonBrowser) => {
    if (text === '') {
      console.warn(`${selector} 의 값을 써주세요.`);
    }
    const randomTypeDelay = randomHumanDelay({ maxMs: options.maxTypingDelay, minMs: options.minTypingDelay });
    await page.type(selector, text, { delay: randomTypeDelay })
    return { page, browser }
  })
}

export function click(selector: string) {
  return switchMap(async ({ page, browser }: CommonBrowser) => {
    await page.click(selector)
    return { page, browser };
  })
}

export function clickComplete(selector: string, options = { navigationTimeout: 60000 }) {
  return switchMap(async ({ page, browser }: CommonBrowser) => {
    const nextPageLoaded = new Promise((resolve, reject) => {
      const timeoutId = setTimeout(() => {
        browser.close()
        reject()
      }, options.navigationTimeout)
      page.once('load', () => {
        clearTimeout(timeoutId);
        resolve()
      })
    })
    await Promise.all([
      page.click(selector),
      nextPageLoaded
    ]);
    return { page, browser };
  })
}

