import { EventEmitter } from 'events';
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';
import { ThreadPool } from './threadPool.js';

const __dirname = dirname(fileURLToPath(import.meta.url));
const workerFile = join(__dirname, 'workers', 'subsetSumThreadWorker.js');
const workers = new ThreadPool(workerFile, 2);

export class SubsetSum extends EventEmitter {
  constructor(sum, set) {
    super();
    this.sum = sum;
    this.set = set;
  }

  async start() {
    const worker = await workers.acquire();
    worker.postMessage({ sum: this.sum, set: this.set });
    // thread - postMessage
    const onMessage = (msg) => {
      if (msg.event === 'end') {
        worker.removeListener('message', onMessage);
        workers.release(worker);
      }

      this.emit(msg.event, msg.data);
    };

    worker.on('message', onMessage);
  }
}

// 기본 프로세스내에서 실행하지만
// 다른 쓰레드에서 실행되므로 메모리공간이 더 작고 시작시간이 빠르다
// 작업자스레드를 기본스레드와 격리하면 언어의 무결성이 유지됨
// 작업자쓰레드는 Nodejs 런타임과 이벤트루프를 사용하여
// 자체 v8 인스턴스 내에서 실행됨.
