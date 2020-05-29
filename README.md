# Corona Auto Checker.
매일 아침 8시 전에 초등학생 부모가 아이들 열이 없는지 등 교육부에 보고를 해야 합니다.

의도는 알겠는데요~ 왜 8시 전이냐고요~! :sob: 

형식적인 루틴, 아침 일찍 일어나 하는 것이 너무 싫어 자동화를 해봤습니다. 

매일 7시30분에서 8시에 자동 체크를 해주며 하루에 한번만 체크해줍니다.

(쓰실 분은 책임감 있게 8시 전이 아닌 등교 전에 체크해주세요 :bow:)

## Setup
* Node.js 14과 PM2를 설치해야합니다.
* OS time이 한국 시간이어야합니다.
* 다니는 학교, 학생이름, 학생생년월일을 .env에 설정해야합니다. .env 예;
```dotenv
SCHOOL_NAME=강남초등학교
PUPIL_NAME=홍길동
PUPIL_DOB=090530
```

## TODO:
1. Send Screenshot of a successful check.
2. Docker
3. Make Public Web Interface
