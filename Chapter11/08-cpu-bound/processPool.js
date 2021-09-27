import { fork } from 'child_process';

export class ProcessPool {
  // 실행중인 프로세스 풀
  // 여기에서 워커가 담기고 꺼내진다
  constructor(file, poolMax) {
    this.file = file;
    this.poolMax = poolMax;
    this.pool = [];
    // 사용할 준비가 된 실행중인 프로세스 집합
    this.active = [];
    // 현재 사용중인 프로세스 목록
    this.waiting = [];
    // 즉시 처리할 수 없는 모든 요청들을 넣는 콜백
  }

  acquire() {
    // 프로세스가 사용가능해지면
    // 사용할 준비가 된 프로세스를 반환
    return new Promise((resolve, reject) => {
      let worker;
      if (this.pool.length > 0) {
        worker = this.pool.pop();
        this.active.push(worker);
        return resolve(worker);
      }
      // pool에 사용할 프로세스가 있으면
      // active 목록에 넣고
      // resolve 함수에 넣어서 외부Promise에 반환

      if (this.active.length >= this.poolMax) {
        return this.waiting.push({ resolve, reject });
      }
      // 최대 프로세스에 도달한 경우
      // 외부 Promise의 resolve, reject를
      // waiting 콜백에 넣어두고 대기

      worker = fork(this.file);
      // fork로 프로세스 생성
      worker.once('message', (message) => {
        if (message === 'ready') {
          this.active.push(worker);
          return resolve(worker);
        }
        worker.kill();
        reject(new Error('Improper process start'));
      });
      worker.once('exit', (code) => {
        console.log(`Worker exited with code ${code}`);
        this.active = this.active.filter((w) => worker !== w);
        this.pool = this.pool.filter((w) => worker !== w);
      });
    });
  }
  // 최대 실행중인 프로세스 수에 도달하지 않은 경우
  // fork로 새 프로세스 생성
  // 새 프로세스에게서 ready를 기다림 (processWorker file)

  release(worker) {
    if (this.waiting.length > 0) {
      const { resolve } = this.waiting.shift();
      return resolve(worker);
    }
    // 대기요청이 있는 경우 대기열 앞에 resolve 저달해서
    // release 중인 작업자 재할당
    this.active = this.active.filter((w) => worker !== w);
    this.pool.push(worker);
    // 아니면 release중인 작업자를 active 목록에서 제거
    // pool에 다시 넣음
  }
  // process가 완료되면 pool에 다시 넣음
}

// 프로세스는 중지되지않고 재할당되므로 효율적
