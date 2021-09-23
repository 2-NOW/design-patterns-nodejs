function delay(milliseconds) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve(new Date());
    }, milliseconds);
  });
}

async function playingWithDelays() {
  console.log('Delaying...', new Date());

  const dateAfterOneSecond = await delay(1000);
  console.log(dateAfterOneSecond);

  const dateAfterThreeSeconds = await delay(3000);
  console.log(dateAfterThreeSeconds);

  return 'done';
}
// 여기는 async await

playingWithDelays().then((result) => {
  console.log(`After 4 seconds: ${result}`);
});

// 여기는 promise
// async 함수가 promise 객체를 반환한다는 뜻
// -> 함수가 다 끝나고나서 .then을 붙여서 쓸 수 있다는 뜻
