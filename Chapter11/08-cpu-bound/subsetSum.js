import { EventEmitter } from 'events';

export class SubsetSum extends EventEmitter {
  // event emitter 확장
  // 하위 집단은 event 생성가능
  constructor(sum, set) {
    super();
    this.sum = sum;
    this.set = set;
    this.totalSubsets = 0;
  }

  _combine(set, subset) {
    for (let i = 0; i < set.length; i++) {
      const newSubset = subset.concat(set[i]);
      this._combine(set.slice(i + 1), newSubset);
      // 새 조합을 생성
      this._processSubset(newSubset);
      // 추가적인 처리
    }
  }
  // 동기적으로 작동. 이벤트루프에 제어권을 주지않고
  // 하위 집합을 반복적으로 생성 (재귀)

  _processSubset(subset) {
    console.log('Subset', ++this.totalSubsets, subset);
    const res = subset.reduce((prev, item) => prev + item, 0);
    // res -> 결과합계
    if (res === this.sum) {
      // 결과합계와 찾고자 하는 합계가 같다
      this.emit('match', subset);
      // match event
    }
  }
  // 요소들의 합을 계산하기 위해 reduce 연산을 적용
  // 결과 합계가 찾고자 하는 합계와 같을 때 match. res, this.sum

  start() {
    this._combine(this.set, []);
    this.emit('end');
  }
  // 모든 코드를 모음
  // combine 호출, 부분집합의 조합을 생성, 마지막 end event발생
}
