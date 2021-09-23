import { promises as fsPromises } from 'fs';
import { dirname } from 'path';
import superagent from 'superagent';
import mkdirp from 'mkdirp';
import { urlToFilename, getPageLinks } from './utils.js';
import { promisify } from 'util';

const mkdirpPromises = promisify(mkdirp);
// mkdirp를 프로미스화
// 폴더만드는 module

function download(url, filename) {
  console.log(`Downloading ${url}`);
  let content;
  return superagent
    .get(url)
    .then((res) => {
      content = res.text;
      return mkdirpPromises(dirname(filename));
    })
    .then(() => fsPromises.writeFile(filename, content))
    .then(() => {
      console.log(`Downloaded and saved: ${url}`);
      return content;
    });
}
// 콘텐트가 res.text에 의해서 불러와질때마다 리셋됨
// writeFile, readFile을 프라미스로 쓸 수 있게 프라미스 객체 임포트
// superagent는 http요청을 받는 프라미스객체

function spiderLinks(currentUrl, content, nesting) {
  let promise = Promise.resolve();
  // 체인의 시작점
  if (nesting === 0) {
    return promise;
  }
  const links = getPageLinks(currentUrl, content);
  for (const link of links) {
    promise = promise.then(() => spider(link, nesting - 1));
  }
  // 링크들마다 promise.then 호출해서 넣어줌.
  // 이렇게 하면 동적으로 promise 사용가능

  return promise;
}

export function spider(url, nesting) {
  const filename = urlToFilename(url);
  return fsPromises
    .readFile(filename, 'utf8')
    .catch((err) => {
      if (err.code !== 'ENOENT') {
        throw err;
      }

      // The file doesn't exist, so let’s download it
      return download(url, filename);
    })
    .then((content) => spiderLinks(url, content, nesting));
  // 파일 읽고 없으면 ENOENT 코드로 다운로드
  // readFile에서 생성된 프라미스가 이행되면 바로 제일 아래쪽의 then으로
}
