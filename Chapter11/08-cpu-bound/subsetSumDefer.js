import { EventEmitter } from 'events';

// setImmediate 사용. 가장 간단한 방법
export class SubsetSum extends EventEmitter {
  constructor(sum, set) {
    super();
    this.sum = sum;
    this.set = set;
    this.totalSubsets = 0;
  }

  _combineInterleaved(set, subset) {
    this.runningCombine++;
    setImmediate(() => {
      this._combine(set, subset);
      if (--this.runningCombine === 0) {
        this.emit('end');
      }
    });
  }
  // combine을 이벤트루프 큐로 보냄. 비동기화
  // 재귀로 반복호출이 아니고 반복호출 할때마다
  // combine보내고 combineInterleaved보내고
  // 다시 combine을 이벤트루프로 보내고 이런식
  // combine 인스턴스를 추적해서 end 이벤트 보냄

  _combine(set, subset) {
    for (let i = 0; i < set.length; i++) {
      const newSubset = subset.concat(set[i]);
      this._combineInterleaved(set.slice(i + 1), newSubset);
      this._processSubset(newSubset);
    }
  }

  _processSubset(subset) {
    console.log('Subset', ++this.totalSubsets, subset);
    const res = subset.reduce((prev, item) => prev + item, 0);
    if (res === this.sum) {
      this.emit('match', subset);
    }
  }

  start() {
    this.runningCombine = 0;
    this._combineInterleaved(this.set, []);
  }
  // combine 함수의 실행중인 인스턴스 수를 0으로 초기화
}

// setImmediate 대신 nextqueue 쓰면
// nextqueue는 대기중인 I/O 이전에 바로 실행되게 해버리므로
// I/O 기아가 발생할 수 있다.
