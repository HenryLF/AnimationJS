const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

ctx.lineWidth = 3;
ctx.strokeStyle = "#1c71d8";

const freq = document.getElementById("freq");
const ampl = document.getElementById("ampl");
const phas = document.getElementById("phas");
const freq_label = document.getElementById("freq_label");
const ampl_label = document.getElementById("ampl_label");
const phas_label = document.getElementById("phas_label");

const graph_img = new Image();
graph_img.src = "Graph.png"
const graph = {
  x : 0,
  y : 0,
  draw(){
  ctx.drawImage(graph_img,this.x,this.y)
  }
}
var Freq = 1/750;
freq.addEventListener("change",function(){
  Freq = freq.value/750
  draw();
  freq_label.innerText = `Frequence : ${freq.value} Hz`;
})
ampl.addEventListener("change",function(){
  draw();
  ampl_label.innerText = `Amplitude : ${ampl.value}`;
})
phas.addEventListener("change",function(){
  draw();
  phas_label.innerHTML = `Phase : ${phas.value} &#xb7 &#x3C0 rad`;
})
const dx = 1 ;
const origin = {x:38,y:295} ;
function plot_curve(func){
  var x = 0;
  var canvas_x = x + origin.x;
  ctx.beginPath();
  ctx.moveTo(origin.x,origin.y-func(x));
  while(canvas_x < canvas.width){
    ctx.lineTo(canvas_x,origin.y - func(x));
    canvas_x += dx
    x += dx ;
  }
  ctx.stroke()
}

function sin(x){
  return 219*ampl.value*Math.cos(2*Math.PI*Freq*x+phas.value*Math.PI)
}
function draw(){
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  plot_curve(sin);
  graph.draw();
}

function init(){
plot_curve(sin);
graph.draw();
}
setTimeout(init,100);
