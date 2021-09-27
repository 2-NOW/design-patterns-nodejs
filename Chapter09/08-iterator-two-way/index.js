function* twoWayGenerator() {
  try {
    const what = yield 1;
    const test;
    console.log(what[0])
    console.log(test)
    yield 'Hello ' + what;
  } catch (err) {
    yield 'Hello error: ' + err.message;
  }
}

console.log('Passing a value back to the generator:');
const twoWay = twoWayGenerator();

console.log(twoWay.next());
console.log(twoWay.next('world'));

console.log('Using throw():');
const twoWayException = twoWayGenerator();
twoWayException.next();
console.log(twoWayException.throw(new Error('Boom!')));

console.log('Using return():');
const twoWayReturn = twoWayGenerator();
console.log(twoWayReturn.return('myReturnValue'));
