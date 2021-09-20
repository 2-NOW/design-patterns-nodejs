/* eslint handle-callback-err: 0 */
import { readFile } from 'fs';

const cache = new Map();

function inconsistentRead(filename, cb) {
  if (cache.has(filename)) {
    // invoked synchronously
    cb(cache.get(filename));
  } else {
    // asynchronous function
    readFile(filename, 'utf8', (err, data) => {
      cache.set(filename, data);
      cb(data);
    });
  }
}

function createFileReader(filename) {
  const listeners = [];
  inconsistentRead(filename, (value) => {
    listeners.forEach((listener) => listener(value));
  });

  return {
    onDataReady: (listener) => listeners.push(listener),
  };
}

const reader1 = createFileReader('data.txt');
/*
listeners = []

inconsistentRead('data.txt', value => {
  listeners.forEach(listener => listener(value))  
})

비동기로 readFile 하고 data가 cache에 set 됨.
data => listeners.forEach(listener => listener(data))

listener에 
*/
reader1.onDataReady((data) => {
  console.log(`First call data: ${data}`);

  // ...sometime later we try to read again from
  // the same file
  const reader2 = createFileReader('data.txt');
  reader2.onDataReady((data) => {
    console.log(`Second call data: ${data}`);
  });
});

/* 

reader1은 캐싱이 되는동안 listener가 등록됨.
reader2는 캐싱이 되어있어서 리스너 등록 전에 리스너가 호출됨.
createfilereader는 호출 시 리스너를 비움.

*/
