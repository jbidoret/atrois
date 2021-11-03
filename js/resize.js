
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