import { of } from 'rxjs';
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

export const coronaCheckEpic = () => of(`아침에 일어나서 8시 전까지 형식적으로 아프지 않다고 교육부에 말해주는거 자동화 하기`).pipe(
  launchPage({ url: 'https://eduro.sen.go.kr/stv_cvd_co00_002.do', devMode: process.env.NODE_ENV === 'development' }),
  inputSchoolName(process.env.SCHOOL_NAME),
  inputPupilName(process.env.PUPIL_NAME),
  inputPupilDob(process.env.PUPIL_DOB),
  clickPupilInputComplete(),
  /** Next page */
  selectUnder37p5(),
  selectNoSymptom(),
  selectNoSelfTraveled(),
  selectNoRelativeHasTraveled(),
  selectNoRelativeHasCorona(),
  clickSurveyComplete(),
);
