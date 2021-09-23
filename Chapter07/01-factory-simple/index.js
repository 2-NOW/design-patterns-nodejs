import { Image } from './image.js';

// Factory function
function createImage(name) {
  return new Image(name);
}

// Factory invocation
const image = createImage('photo.jpeg');

console.log(image);

// image 내부는 안보이게 하고
// createImage 만 오픈시켜놓음
