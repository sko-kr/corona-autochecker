import { pipe } from 'rxjs';
import { click, clickComplete, input } from './operators';
import { delay } from 'rxjs/operators';
import { randomHumanDelay } from './utils';

export const inputSchoolName = (schoolName?: string) => pipe(
  input('#schulNm', schoolName),
  delay(randomHumanDelay()),
)

export const inputPupilName = (pupilName?: string) => pipe(
  input('#pName', pupilName),
  delay(randomHumanDelay()),
)

export const inputPupilDob = (pupilDob?: string) => pipe(
  input('#frnoRidno', pupilDob),
  delay(randomHumanDelay()),
)

export const clickPupilInputComplete = () => pipe(
  delay(randomHumanDelay({ minMs: 2000, maxMs: 4000 })),
  clickComplete('#btnConfirm'),
  delay(randomHumanDelay({ minMs: 3000, maxMs: 6000 }))
);

export const selectUnder37p5 = () => pipe(
  click('#rspns011'),
  delay(randomHumanDelay())
)

export const selectNoSymptom = () => pipe(
  click('#rspns02'),
  delay(randomHumanDelay())
)

export const selectNoSelfTraveled = () => pipe(
  click('#rspns070'),
  delay(randomHumanDelay())
)

export const selectNoRelativeHasTraveled = () => pipe(
  click('#rspns080'),
  delay(randomHumanDelay())
)

export const selectNoRelativeHasCorona = () => pipe(
  click('#rspns090'),
  delay(randomHumanDelay())
)

export const clickSurveyComplete = () => pipe(
  delay(randomHumanDelay({ minMs: 500, maxMs: 1000 })),
  clickComplete('#btnConfirm'),
  delay(randomHumanDelay({ minMs: 3000, maxMs: 6000 }))
);
