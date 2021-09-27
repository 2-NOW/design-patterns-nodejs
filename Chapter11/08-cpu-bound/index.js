import { createServer } from 'http';
// import { SubsetSum } from './subsetSum.js'
// import { SubsetSum } from './subsetSumDefer.js'
import { SubsetSum } from './subsetSumFork.js';
// import { SubsetSum } from './subsetSumThreads.js'

createServer((req, res) => {
  const url = new URL(req.url, 'http://localhost');
  if (url.pathname !== '/subsetSum') {
    // subsetSum과 다른 url 보내면
    // end 하고 I'm alive 출력
    res.writeHead(200);
    return res.end("I'm alive!\n");
  }

  const data = JSON.parse(url.searchParams.get('data'));
  const sum = JSON.parse(url.searchParams.get('sum'));
  res.writeHead(200);
  const subsetSum = new SubsetSum(sum, data);
  subsetSum.on('match', (match) => {
    res.write(`Match: ${JSON.stringify(match)}\n`);
  });
  subsetSum.on('end', () => res.end());
  // setsum match, end event 등록
  subsetSum.start();
  // setsum 시작
}).listen(8000, () => console.log('Server started'));
