declare namespace NodeJS {
  export interface ProcessEnv {
    /** just to clarify NODE_ENV is used in application logic */
    NODE_ENV: string;
    SCHOOL_NAME: string;
    PUPIL_NAME: string;
    PUPIL_DOB: string;
  }
}
