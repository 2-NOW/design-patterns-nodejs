import { TaskQueue } from './TaskQueue.js';

function makeSampleTask(name) {
  return (cb) => {
    console.log(`${name} started`);
    setTimeout(() => {
      console.log(`${name} completed`);
      cb();
    }, Math.random() * 2000);
  };
}

const queue = new TaskQueue(2);
// queue에 concurrency 2
// 두 줄
// running, queue 비워줌

// queue에서는 task들을 담아놨다.

// A task that spawns other 2 sub tasks
// 여기는 task 두개짜리 queue
function task1(cb) {
  console.log('Task 1 started');
  queue
    .pushTask(makeSampleTask('task1 -> subtask 1'))
    .pushTask(makeSampleTask('task1 -> subtask 2'));
  setTimeout(() => {
    console.log('Task 1 completed');
    cb();
  }, Math.random() * 2000);
}

// A task that spawns other 3 sub tasks
// 여기는 task 세개짜리 queue
function task2(cb) {
  console.log('Task 2 started');
  queue
    .pushTask(makeSampleTask('task2 -> subtask 1'))
    .pushTask(makeSampleTask('task2 -> subtask 2'))
    .pushTask(makeSampleTask('task2 -> subtask 3'));
  setTimeout(() => {
    console.log('Task 2 completed');
    cb();
  }, Math.random() * 2000);
}

queue.pushTask(task1).pushTask(task2);
