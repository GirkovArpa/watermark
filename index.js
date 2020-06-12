'use strict';

function stringToBits(string) {
  return string.split('')
    .map(char => char.charCodeAt(0))
    .map(int => (int).toString(2).padStart(8, '0').split(''))
    .flat()
    .map(n => +n);
}

function bitsToString(bits) {
  bits = [...bits.map(n => getBit(n, 0))];
  return String.fromCharCode(...Array(Math.ceil(bits.length / 8))
    .fill()
    .map(() => bits.splice(0, 8))
    .map(arr => parseInt(arr.join(''), 2)));
}

function setBit(number, bitPosition, sign) {
  if (sign) return number | (1 << bitPosition);
  const mask = ~(1 << bitPosition);
  return number & mask;
}


function getBit(number, bitPosition) {
  return (number & (1 << bitPosition)) === 0 ? 0 : 1;
}

function createWatermark(imageAsBase64, text) {
  return new Promise(resolve => {
    const image = new Image();
    image.src = imageAsBase64;
    image.onload = () => {
      const canvas = document.createElement('canvas');
      canvas.width = image.width;
      canvas.height = image.height;
      const context = canvas.getContext('2d');
      context.drawImage(image, 0, 0);
      const imageData = context.getImageData(0, 0, canvas.width, canvas.height);
      const bits = stringToBits(text);
      for (let i = 0; i < text.length * 8; i += 4) {
        imageData.data[i] = setBit(imageData.data[i], 0, bits[i]);
        imageData.data[i + 1] = setBit(imageData.data[i + 1], 0, bits[i + 1]);
        imageData.data[i + 2] = setBit(imageData.data[i + 2], 0, bits[i + 2]);
        imageData.data[i + 3] = setBit(imageData.data[i + 3], 0, bits[i + 3]);
      }
      context.putImageData(imageData, 0, 0);
      resolve(canvas.toDataURL());
    }
  });
}

function readWatermark(base64, textLength) {
  return new Promise(resolve => {
    const image = new Image();
    image.src = base64;
    image.onload = () => {
      const canvas = document.createElement('canvas');
      canvas.width = image.width;
      canvas.height = image.height;
      const context = canvas.getContext('2d');
      context.drawImage(image, 0, 0);
      const imageData = context.getImageData(0, 0, canvas.width, canvas.height);
      const bits = imageData.data.slice(0, textLength * 8);
      resolve(bitsToString(bits));
    }
  });
}