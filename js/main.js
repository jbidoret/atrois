(function() {
  'use strict';

  // image mode
  var image_mode = document.body.classList.contains('show-video') ? "video" : "image";

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
    context.drawImage(video, 0, 0, w, h);
    var src = canvas.toDataURL('image/png');
    img.src = src;
    localStorage.setItem('img', src);
    document.body.classList.remove('show-video');
  }

  var takesnapshot_button = document.querySelector("#takesnapshot");
  var tryagain_button = document.querySelector("#tryagain");
  var print_button = document.querySelector("#print");

  tryagain_button.addEventListener('click', function(){
    document.body.classList.add('show-video');
  });
  if (navigator.mediaDevices) {
    navigator.mediaDevices.getUserMedia({video: { facingMode: "user", width: 1280, height: 720 }})
      .then(function(stream) {
        video.srcObject = stream;
        takesnapshot_button.addEventListener('click', takeSnapshot);
      })
      .catch(function(error) {
        document.body.textContent = 'Could not access the camera. Error: ' + error.name;
      });
  }
  

  // shortcut keys
  Mousetrap.bind(['i'], function(e) {
    
    if( editor_mode == false){
      console.log(editor_mode);
      e.preventDefault();
      if(image_mode == "video") { document.body.classList.remove('show-video'); }
      else { document.body.classList.add('show-video'); }
      return false;
    }
  });

  // print
  print_button.addEventListener('click', function(){
    window.print();
  });


})();
