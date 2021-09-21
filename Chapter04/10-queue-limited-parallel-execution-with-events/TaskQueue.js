import { EventEmitter } from 'events';

export class TaskQueue extends EventEmitter {
  constructor(concurrency) {
    super();
    this.concurrency = concurrency;
    this.running = 0;
    this.queue = [];
  }

  pushTask(task) {
    this.queue.push(task);
    process.nextTick(this.next.bind(this));
    return this;
  }

  next() {
    if (this.running === 0 && this.queue.length === 0) {
      return this.emit('empty');
    }

    while (this.running < this.concurrency && this.queue.length) {
      const task = this.queue.shift();
      task((err) => {
        if (err) {
          this.emit('error', err);
        }
        this.running--;
        process.nextTick(this.next.bind(this));
      });
      this.running++;
    }
  }
}

/*
task를 push 먼저 하고
pushTask할 때 nextTick에 next 넘김

pushTask 끝나고 이벤트루프에 있던 next 호출됨

---

각각의 taskQueue 들어갔을 때(Task 1, Task 2)
subtask를 TaskQueue에 넣어줌
그리고 setTimeout 실행

---

각각 Task에서 subtask 넣을 때마다
queue에 하나씩 쌓임

---

*** running이 처음 빠지는 부분은 뭔지 ?

---

subtask completed 시 running이 하나 빠짐

running이 하나 빠지면
동기코드가 다 끝난것이므로
nextTick이 실행되어 next() 함수 호출

---

error 나오면 emit으로 핸들링해주고 다음 next함수로 넘어감

---

29번줄은 왜 갑자기 실행이 되지
nextTick으로 이벤트루프로 넘긴 부분을 받아오는듯
task -> subtask completed일 때 실행됨

q가 다 비워지면 emit empty 하고서 Que drained 뜸

*/
