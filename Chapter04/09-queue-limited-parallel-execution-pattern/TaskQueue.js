export class TaskQueue {
  constructor(concurrency) {
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
    while (this.running < this.concurrency && this.queue.length) {
      const task = this.queue.shift();
      task(() => {
        this.running--;
        process.nextTick(this.next.bind(this));
      });
      this.running++;
    }
  }
}

// nextTick은 이벤트루프에 nextTickqueue에 넣어줌
// 이벤트루프가 돌면서 Timer queue나 등등 쭉 돌고
// nextTickQueue 돌때 실행이 되는듯

/*
queue를 쓰는 이유는
spider v2의 예시코드를 보면
cuncurruncy로 병렬처리를 하는데
재귀로 스택을 쌓기 때문에
컨텍스트가 유지되어 자원이 낭비된다

queue로 하면
queue에 task를 다 넣어버리니까
재귀로 부르지않고 task에 들어온걸
FIFO으로 실행해버리니까
컨텍스트의 유지 없이 실행순서를 정할 수 있음
*/
