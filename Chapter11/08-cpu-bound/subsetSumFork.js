import { EventEmitter } from 'events';
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';
import { ProcessPool } from './processPool.js';

const __dirname = dirname(fileURLToPath(import.meta.url));
const workerFile = join(__dirname, 'workers', 'subsetSumProcessWorker.js');
const workers = new ProcessPool(workerFile, 2);
// file, poolMax

export class SubsetSum extends EventEmitter {
  // 자식프로세스와 통신하고 (worker와 통신)
  // 현재 애플리케이션에서 가져온것처럼 전달하는 SumFork
  constructor(sum, set) {
    super();
    this.sum = sum;
    this.set = set;
  }

  async start() {
    const worker = await workers.acquire();
    worker.send({ sum: this.sum, set: this.set });
    // 새로운 자식프로세스 획득 - acquire 함수로
    // send로 실행할 작업데이터, 메세지를 자식 프로세스에 보냄
    // send 함수는 child_process 제공함수
    // 이게 커뮤니케이션 채널

    const onMessage = (msg) => {
      if (msg.event === 'end') {
        worker.removeListener('message', onMessage);
        workers.release(worker);
      }
      // onMessage 리스너에서 end이벤트 수신했는지 확인
      // 수신했으면 SubsetSum 작업이 완료된거
      // 수신 후 리스너 제거하고 worker 해제, 풀에 다시 넣음
      this.emit(msg.event, msg.data);
      // 작업자 프로세스는 {event, data} 형식의 메세지를 생성
      // 자식 프로세스에 생성된 모든 이벤트를 전달, 재발송
    };

    worker.on('message', onMessage);
    // 새로운 리스너를 만듬.
    // on 함수도 child_process 제공함수
  }
}

// 이미 만든 알고리즘을 감싼 것
