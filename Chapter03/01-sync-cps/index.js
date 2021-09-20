/* eslint standard/no-callback-literal: 0 */

function addCps(a, b, callback) {
  callback(((a, b) => a + b)(a, b));
}

// 즉시실행함수

function addCps(a, b, callback) {
  callback(a + b);
}

console.log('before');
addCps(1, 2, (result1, result2) =>
  console.log(`Result1 : ${result1}, ${result2}}`)
);
console.log('after');
