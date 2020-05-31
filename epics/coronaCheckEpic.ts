import { pipe } from 'rxjs';
import { launchPage } from '../puppeteer/launch';
import {
  clickPupilInputComplete,
  clickSurveyComplete,
  inputPupilDob,
  inputPupilName,
  inputSchoolName,
  selectNoRelativeHasCorona,
  selectNoRelativeHasTraveled,
  selectNoSelfTraveled,
  selectNoSymptom,
  selectUnder37p5
} from '../puppeteer/steps';
import { User } from '../models/Database';
import { delay, map, tap } from 'rxjs/operators';
import { Browser, Page } from 'puppeteer';
import { randomHumanDelay } from '../utils/utils';

export function coronaCheckEpic(user: User) {
  return launchPage({ url: 'https://eduro.sen.go.kr/stv_cvd_co00_002.do', devMode: process.env.NODE_ENV === 'development' }).pipe(
    pipe(
      inputSchoolName(user.schoolName),
      inputPupilName(user.name),
      inputPupilDob(user.dob),
      clickPupilInputComplete(),
    ),
    pipe(
      selectUnder37p5(),
      selectNoSymptom(),
      selectNoSelfTraveled(),
      selectNoRelativeHasTraveled(),
      selectNoRelativeHasCorona(),
      clickSurveyComplete(),
    ),
    pipe(
      tap(({ page }) => {
        page.screenshot({ path: `${user.name}${new Date().getTime()}` })
      }),
      delay(randomHumanDelay({ minMs: 3000, maxMs: 6000 })),
      map(({ browser, page }: { browser: Browser; page: Page }): { browser: Browser, page: Page, user: User } => ({
        browser,
        page,
        user
      }))
    )
  )
}
