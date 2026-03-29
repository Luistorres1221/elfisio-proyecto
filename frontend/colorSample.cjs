const { createCanvas, loadImage } = require('canvas');
(async () => {
  const img = await loadImage('public/elfisio-logo.png');
  const canvas = createCanvas(img.width, img.height);
  const ctx = canvas.getContext('2d');
  ctx.drawImage(img, 0, 0);
  const { data } = ctx.getImageData(10, 10, 1, 1);
  console.log(data.slice(0,3));
})();