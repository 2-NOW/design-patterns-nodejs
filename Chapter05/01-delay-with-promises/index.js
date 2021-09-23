function delay(milliseconds) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve(new Date());
    }, milliseconds);
  });
}

console.log(`Delaying...${new Date().getSeconds()}s`);

delay(1000).then((newDate) => {
  console.log(`Done ${newDate.getSeconds()}s`);
});

// resolve는 fulfillment value를 받는 값
// 성공하면 뭐 한다 ~ 라는 뜻
