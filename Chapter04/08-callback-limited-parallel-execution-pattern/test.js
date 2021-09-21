function makeSampleTask(name) {
  return (cb) => {
    console.log(`${name} started`);
    setTimeout(() => {
      console.log(`${name} completed`);
      cb();
    }, Math.random() * 2000);
  };
}

const tasks = [
  makeSampleTask('Task 1'),
  makeSampleTask('Task 2'),
  makeSampleTask('Task 3'),
  makeSampleTask('Task 4'),
  makeSampleTask('Task 5'),
  makeSampleTask('Task 6'),
  makeSampleTask('Task 7'),
];

const concurrency = 2;
let running = 0;
let completed = 0;
let index = 0;

function next() {
  // [1]
  while (running < concurrency && index < tasks.length) {
    const task = tasks[index++];
    task(() => {
      // [2]
      if (++completed === tasks.length) {
        return finish();
      }
      running--;
      next();
    });
    running++;
  }
}
next();

function finish() {
  // all the tasks completed
  console.log('All tasks executed!');
}

/*

makeSampleTask만 하는 부분
동시에 두개 병렬처리는 하는데
전역으로는 관리가 안됨.
이 함수 안에서만 병렬로 처리한다.
spiderGetLinks로 link를 또 받으면서
다시 실행이 되면 다시 병렬로 두개가 실행됨.
그러므로 전역으로 관리하는 queue를 두개 따로 만들어서
link 환경과 따로 관리되는 병렬처리가 되게 함.

*/
