import { SubsetSum } from '../subsetSum.js';
// 원래의 subsetsum을 사용하므로
// 모든 HTTP요청은 메인애플리케이션의 루프에서 계속 처리됨

process.on('message', (msg) => {
  const subsetSum = new SubsetSum(msg.sum, msg.set);
  // 부모 프로세스한테 오는 메세지 수신
  // message 수신되면 SubsetSum 인스턴스 만들고

  subsetSum.on('match', (data) => {
    process.send({ event: 'match', data: data });
  });
  // match 리스너 등록

  subsetSum.on('end', (data) => {
    process.send({ event: 'end', data: data });
  });
  // end 리스너 등록

  subsetSum.start();
  // 계산 시작
});
// 이벤트 수신될때마다 {event, data}형식의 객체로 감싸서
// 상위프로세스로 전달
// 이 메세지는 subsetSumFork.js에서 처리

process.send('ready');

// 부분집합 합계 알고리즘을 실행하고
// 결과를 상위 프로세스로 전달하는 worker
