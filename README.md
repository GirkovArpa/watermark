Does not work for images with transparency.  I don't know why.

```html
<!DOCTYPE html>
<script src="index.js"></script>

<body>
</body>
<script>
  (async () => {
    const base64 = /* some base64 image data goes here */;
    const watermark = await createWatermark(base64, 'John Doe');
    
    const image = new Image();
    image.src = watermark;
    document.body.appendChild(image); // displays watermarked image on screen

    const hiddenText = await readWatermark(watermark, 8);
    console.log(hiddenText); // John Doe
  })();
</script>

</html>
```