(function() {
  'use strict';

  // init body
  var body = document.body;
  
  // Permet au poster de rester dans un ratio “A3” 
  var atrois = {
    w : 3508,
    h : 4961,
    getRatio : function(){ return this.w / this.h }
  };

  var poster = document.querySelector("#poster");
  var padding = 100;

  function resize(){
    var ww = window.innerWidth - padding, 
        wh = window.innerHeight - padding,
        ratio = ww/wh, 
        scale = 1;
    if(ratio > atrois.getRatio()){
        scale = wh / atrois.h;
    } else {
        scale = ww / atrois.w;    
    }
    document.documentElement.style.setProperty('--scale', scale);
    poster.style.transform = 'translate(-50%, -50%) scale(' + scale + ')';
  }
  window.addEventListener('resize', resize);
  resize();

  // init canvas
  var canvas = document.createElement('canvas'), w, h;
  w = canvas.width = 1280;
  h = canvas.height = 720;

  var context = canvas.getContext('2d');
  


  var video = document.querySelector('video');

  /**
   *  generates a still frame image from the stream in the <video>
   *  appends the image to the <body>
   */
  function takeSnapshot() {
    var img = document.querySelector('img') || document.createElement('img');
    
    body.classList.remove('tryagain');
    context.drawImage(video, 0, 0, w, h);

    img.src = canvas.toDataURL('image/png');
    
  }

  var takesnapshot_button = document.querySelector("#takesnapshot");
  var tryagain_button = document.querySelector("#tryagain");

  tryagain_button.addEventListener('click', function(){
    body.classList.add('tryagain')
  });

  // use MediaDevices API
  // docs: https://developer.mozilla.org/en-US/docs/Web/API/MediaDevices/getUserMedia
  if (navigator.mediaDevices) {
    // access the web cam
    navigator.mediaDevices.getUserMedia({video: { facingMode: "user", width: 1280, height: 720 }})
    // permission granted:
      .then(function(stream) {
        video.srcObject = stream;
        setTimeout(function(){
          threshold(30);
        }, 100)
        takesnapshot_button.addEventListener('click', takeSnapshot);
      })
      // permission denied:
      .catch(function(error) {
        document.body.textContent = 'Could not access the camera. Error: ' + error.name;
      });
  }

  function getPixelData(v, w, h) {
    // Draw the video onto the backing canvas
    context.drawImage(v, 0, 0, w, h);
    // Grab the pixel data and work on that directly
    return context.getImageData(0, 0, w, h);
  }

  function threshold(t) {
    var pixelData = getPixelData(video, w, h);
    for (var i = 0; i < pixelData.data.length; i += 4 ) {
      // Get the RGB values for this pixel
      var r = pixelData.data[i];
      var g = pixelData.data[i+1];
      var b = pixelData.data[i+2];
      // Compare each pixel's greyscale value to the threshold value...
      var value = (0.2126 * r + 0.7152 * g + 0.0722 * b >= t) ? 255 : 0;
      // ...and set the colour based on the result
      pixelData.data[i] = pixelData.data[i+1] = pixelData.data[i+2] = value;
    }
    // Draw the data on the visible canvas
    context.putImageData(pixelData, 0, 0);
  }
  
})();
