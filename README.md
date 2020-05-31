# Corona Auto Checker.
매일 아침 8시 전에 초등학생 부모가 아이들 열이 없는지 등 교육부에 보고를 해야 합니다.

의도는 알겠는데요~ 왜 8시 전이냐고요~! :sob: 

형식적인 루틴, 아침 일찍 일어나 하는 것이 너무 싫어 자동화를 해봤습니다. 

매일 7시30분에서 8시에 자동 체크를 해주며 하루에 한번만 체크해줍니다.

(쓰실 분은 책임감 있게 8시 전이 아닌 등교 전에 체크해주세요 :bow:)

## Setup
* Node.js 12와 PM2를 설치해야합니다.
* OS time이 한국 시간이어야합니다. `sudo timedatectl set-timezone 'Asia/Seoul'`
* 다니는 학교, 학생이름, 학생생년월일을 db.json에 설정해야 합니다. 예)
```json
{
  "users": [
    {
      "id": 1,
      "name": "홍길동",
      "schoolName": "강남초등학교",
      "dob": "111111",
      "checkedDate": {
        "2020-05-29": false
      }
    },
    {
      "id": 2,
      "name": "홍길순",
      "schoolName": "역삼초등학교",
      "dob": "101010",
      "checkedDate": {
        "2020-05-29": false
      }

    }
  ]
}
```

## 실행하기
위 셋업후 `npm start`

## Misc
* setup korean in ubuntu 
```bash
sudo apt-get install language-pack-ko
sudo apt-get install korean*
```

## TIL
### 1. A value returned from `pipe` standalone function can only be used as other `pipe`s' arguments.
The return value of a `pipe` is not an `Observable`, it is an `UnaryFunction`.
More specifically an `UnaryFunction` which receives an `Observable` and returns an `Observable`.
Typically, an input `Observable` is an output of another `UnaryFunction`, for example;
```js
const customUnaryFunction = pipe( map(val => val + 2) );
of(0).pipe(
  map(val => val + 1),
  customUnaryFunction
)
```
`customUnaryFunction` receives a returned `Observable` from `map` (which is an `UnaryFunction`) as an argument, and 
returns `Observable`.

It's worth noting that `UnaryFunction` not being an `Observable` has implementation effects.

For example, one could define a function that receives an argument and returns an `UnaryFunction`. This argument could be;
1. a function,
2. value (object, string, number, etc).

When a `UnaryFunction` returning function receives a function as an argument, it is like defining `map`, `filter`, `switchMap`, etc.
i.e. it works with a value that is streaming down the pipeline.
```js
const customOperator = (callback) => pipe( otherOperators, map(callback) )
// Usage;
of(0).pipe(
  customOperator(val => val * 2)
)
```
In above example we could get access to the flowing data by passing callback to operators.

When a `UnaryFunction` returning function receives a non-function value as an argument, it is like defining `mapTo`, `switchMapTo`, etc.
i.e. the value that is passed as an argument has to exist outside the stream pipeline.
```js
const customOperator = (val) => pipe( map((val) => val * 2), mapTo(val) )
// Usage
of(0).pipe(
  customOperator(3)
)
```
In above example, customOperator is not very flexible as we could not get access to inner pipe's value.

On a side note, We don't really need to use `pipe` function to create a custom operator, we could simply call the builtin
operator and return it. For example, [this](https://github.com/ko-toss/corona-autochecker/blob/594722e4ede7adce67263edb1c326dce6e5b902e/puppeteer/operators.ts#L27).
However, we can work with only one built in an operator. (Sometimes that's all we need).

Most of the time we work with an operator that receives a callback, eg) we work more with `map` than `mapTo`, hence
when defining a function that returns an UnaryFunction, an argument should most likely be a function.
Of course, sometimes what we want is value receiving operator similar to `mapTo`, for example, [this](https://github.com/ko-toss/corona-autochecker/blob/5dd53282cd18d0f61d7c24a4df94f31cc6b72b5d/puppeteer/steps.ts#L6).

Also, it can be confusing at times what we are trying to create is not a custom operator but rather a callback that
gets passed to an operator, for example callback passed to `switchMap`. 
In this case the function should receive streaming value rather than Observable as an argument and return an observable or a value. For example;
```js
//  Receives a value anre returns an observable, 
// can be passed to an operator working with higher order observable
const customCallback = (val) => of(val).pipe( 
  map(val => val * 2)
)
// Usage
of(0).pipe(
  switchMap(customCallback)
)
```

We should make sure we know what we are making (customOperator or customCallback), before we make it. 
To avoid mistakes like, [this](https://github.com/ko-toss/corona-autochecker/commit/5b45e477e7926378a4ad45bbd2574e0f61acf2fc#r39556182)

Note UnaryFunction is one type of OperatorFunction, a function that is passed to `pipe` as an argument.

### 2. type for pipe function breaks after 9 operations. :sob:
[link](https://github.com/ReactiveX/rxjs/issues/4177#issuecomment-424328114)
Reason;
```ts
// type for pipe function with more than 9 parameters.
export function pipe<T, A, B, C, D, E, F, G, H, I>(
  fn1: UnaryFunction<T, A>, 
  fn2: UnaryFunction<A, B>,
  fn3: UnaryFunction<B, C>,
  fn4: UnaryFunction<C, D>,
  fn5: UnaryFunction<D, E>,
  fn6: UnaryFunction<E, F>,
  fn7: UnaryFunction<F, G>,
  fn8: UnaryFunction<G, H>,
  fn9: UnaryFunction<H, I>,
  ...fns: UnaryFunction<any, any>[] // <- ??
): UnaryFunction<T, {}>; // <- Why you return type {} ?
```

## TODO:
1. Send Screenshot of a successful check.
2. Docker
3. Make Public Web Interface
