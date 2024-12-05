const cvs = document.getElementById("canvas");
const cvs_ctx = cvs.getContext("2d");
const graph = document.getElementById("graph");
const graph_ctx = graph.getContext("2d");

const frot = document.getElementById("frot");
const frot_label = document.getElementById("frot_label");

const string_l = document.getElementById("string_l");
const string_label = document.getElementById("string_label");

const period = document.getElementById("period")

const reset = document.getElementById("reset");
const forces = document.getElementById("forces")

let theta = 0;
let L = string_l.value;
let k = frot.value;
let puls = Math.sqrt(981/L);
let Delta =0;
let t0;

let dragStart = 0;
let drag = false;

let raf;

ball = new Image();
ball.src = "Pendule_Balle.svg";
arrow_P = new Image();
arrow_P.src = "Pendule_ArrowP.svg"
arrow_T = new Image();
arrow_T.src = "Pendule_ArrowT.svg"
arrow_Ar = new Image();
arrow_Ar.src = "Pendule_ArrowAr.svg"
arrow_Al = new Image();
arrow_Al.src = "Pendule_ArrowAl.svg"
cvs_ctx.strokeStyle = "#000000";
cvs_ctx.lineWidth = 2;


graph_ctx.lineWidth = 3;
graph_ctx.strokeStyle = "#1c71d8";

const pend = {
  x  : cvs.width/2,
  y  : 60,
  draw(){
    let pos = {
      x : this.x+Math.sin(theta)*L,
      y : this.y+Math.cos(theta)*L
    }
    cvs_ctx.clearRect(0,0,cvs.width,cvs.height);
    cvs_ctx.beginPath();
    cvs_ctx.moveTo(this.x,this.y);
    cvs_ctx.lineTo(pos.x,pos.y);
    cvs_ctx.stroke();
    cvs_ctx.drawImage(ball,pos.x-ball.width/2,pos.y-ball.height/2);
    if(forces.checked){
      cvs_ctx.drawImage(arrow_P,pos.x - arrow_P.width/2,pos.y)
      cvs_ctx.translate(pos.x,pos.y);
      cvs_ctx.rotate(-theta);
      cvs_ctx.translate(-pos.x,-pos.y);
      cvs_ctx.drawImage(arrow_T,pos.x - arrow_T.width/2,pos.y-arrow_T.height)
      if(theta<0){
        cvs_ctx.drawImage(arrow_Ar,pos.x-arrow_Ar.width*theta,pos.y-arrow_Ar.height*theta/2,arrow_Ar.width*theta,arrow_Ar.height*theta);
      }
      else {
        cvs_ctx.drawImage(arrow_Al,pos.x-arrow_Al.width*theta,pos.y-arrow_Al.height*theta/2,arrow_Al.width*theta,arrow_Al.height*theta);
      }
      cvs_ctx.setTransform(1, 0, 0, 1, 0, 0);
    }
  }
}

cvs.addEventListener("mousedown",event => {
  drag = true;
  dragStart = event.pageX - cvs.offsetLeft;
  raf = window.cancelAnimationFrame(animation);
});
cvs.addEventListener("mousemove",event =>{
  if(drag){
    theta = (event.pageX - cvs.offsetLeft - dragStart)/100;
    theta = Math.max(-Math.acos(ball.width/2/L),theta);
    theta = Math.min(theta,Math.acos(ball.width/2/L));
    Delta = theta;
    pend.draw()
  }
});

cvs.addEventListener("mouseup",event => {
  drag = false;
  init();
  animation();
});

frot.addEventListener("change",event =>{
  k = parseFloat(frot.value);
  init();
});

string_l.addEventListener("change",event =>{
  L = parseFloat(string_l.value);
  puls = Math.sqrt(981/L)
  init();
});

reset.addEventListener("click", function(){
  Delta = 0;
  theta = 0;
  raf = window.cancelAnimationFrame(animation);
  init();
});

const origin = {x:11,y:98};
function plot(t){
  graph_ctx.lineTo((origin.x+t*75),origin.y-theta*47.75);
  graph_ctx.stroke();
}

function plot_frot(){
  function exp(t){
    return Delta*47.75*Math.exp(-k*t)
  }
  graph_ctx.lineWidth = 1;
  graph_ctx.strokeStyle = "#000000";
  graph_ctx.moveTo(origin.x,origin.y-exp(0));
  graph_ctx.beginPath();
  for (let t=0; t<1000;t++){
    graph_ctx.lineTo(origin.x+0.75*t, origin.y - exp(t/100));
  }
  graph_ctx.stroke();
  graph_ctx.moveTo(origin.x,origin.y-exp(0));
  graph_ctx.beginPath();
  for (let t=0; t<1000;t++){
    graph_ctx.lineTo(origin.x+0.75*t, origin.y + exp(t/100));
  }
  graph_ctx.stroke();
}




function animation(){
  let t = (Date.now()-t0)/1000;
  if(!drag && Delta){
    theta = Delta*Math.cos(puls*t)*Math.exp(-k*t);
    if(t<10){plot(t)}
  }
  pend.draw();

  raf = window.requestAnimationFrame(animation);
}


function init(){
  string_label.innerHTML = `Longueur du fil: L = ${L} cm`;
  frot_label.innerHTML = `Forces de frottements: k = ${k} kg&#xB7s⁻¹`;
  period.innerHTML = `${Math.round(200*Math.PI/puls)/100}`
  pend.draw();
  graph_ctx.clearRect(0,0,graph.width,graph.height);
  plot_frot();
  graph_ctx.lineWidth = 3;
  graph_ctx.strokeStyle = "#1c71d8";
  graph_ctx.moveTo(origin.x,origin.y-theta);
  graph_ctx.beginPath();
  t0 = Date.now();
}
init();


