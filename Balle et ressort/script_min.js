const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");
const graph = document.getElementById("graph");
const ctx_g = graph.getContext("2d")

let raf;
const masse = document.getElementById("masse");
const m_label = document.getElementById("m_label");
const k_ressort = document.getElementById("k_ressort");
const k_label = document.getElementById("k_label");
const reset = document.getElementById("reset");
const frot = document.getElementById("frot");
const frot_label = document.getElementById("frot_label");
const k_frot = document.getElementById("k_frot");
const period = document.getElementById("period")

var drag = false ;
var dragStart;
var DeltaX = 0;
var scale = 1 ;
var t0;
var t_frot;
var puls = 1 ;
ctx_g.lineWidth = 3;
ctx_g.strokeStyle = "#1c71d8";


function preloadImages(urls) {
  const promises = urls.map((url) => {
    return new Promise((resolve, reject) => {
      const image = new Image();

      image.src = url;

      image.onload = () => resolve(image);
      image.onerror = () => reject(`Image failed to load: ${url}`);
    });
  });

  return Promise.all(promises);
}

const [ressort_img, balle_img] = await preloadImages([
"BR_Ressort.svg",
"BR_Balle.svg"
])
const ressort_img = new Image();
ressort_img.src = "BR_Ressort.svg";
const balle_img = new Image();
balle_img.src = "BR_Balle.svg";

const ressort = {
  w : ressort_img.width,
  h : ressort_img.height,
  draw(){
  ctx.drawImage(ressort_img,65,(canvas.height-this.h)/2,this.w*scale/2,this.h);
  }
}

const balle = {
  w : balle_img.width,
  h : balle_img.height,
  draw(){
  let t = Math.pow(masse.value,1/3) ;
  ctx.drawImage(balle_img,65+ressort.w*scale/2,(canvas.height-this.h*t)/2,this.w*t,this.h*t);
  }
}





canvas.addEventListener("mousedown",function(event){
  drag = true;
  init_graph();
  dragStart = event.pageX - canvas.offsetLeft;
})
canvas.addEventListener("mousemove",function(event){
  if(drag){
    DeltaX = (event.pageX - canvas.offsetLeft - dragStart)*2/ressort.w ;
    DeltaX = Math.min(DeltaX,1) ;
    DeltaX = Math.max(-1,DeltaX) ;
    scale = DeltaX + 1
    raf = window.requestAnimationFrame(animation) ;
    
  }
})
canvas.addEventListener("mouseup",function(event){
  drag = false;
  t0 = Date.now();
  t_frot = t0 ;
  init_graph();
})


masse.addEventListener("change",function (){
  puls = Math.sqrt(k_ressort.value/masse.value);
  init();
})
k_ressort.addEventListener("change",function (){
  puls = Math.sqrt(k_ressort.value/masse.value);
  k_label.innerHTML = `Raideur du ressort : k = ${k_ressort.value} N&#xB7m⁻²`;
  period.innerHTML = `${Math.round(2*Math.PI/puls*100)/100}`;
})

frot.addEventListener("change",function(){
  if(frot.checked){
    k_frot.disabled = false ;
    t_frot = Date.now() ;
    frot_label.innerHTML = `Forces de frottements : ${k_frot.value} kg&#xB7s⁻¹`;
  }
  else{
    k_frot.disabled = true ;
    frot_label.innerHTML = `Forces de frottements`;
  }
})

k_frot.addEventListener("change", function(){
  frot_label.innerHTML = `Forces de frottements : ${k_frot.value} kg&#xB7s⁻¹`;
})

reset.addEventListener("click",function (){
  DeltaX = 0;
  scale = 1;
  window.cancelAnimationFrame(raf);
  init_graph();
})
function oscillations(){
  t = (Date.now()-t0)/1000 ;
  if (frot.checked){
    return DeltaX*Math.cos(puls*t)*Math.exp(-k_frot.value*(Date.now()-t_frot)/1000) + 1;
    }
  return  DeltaX*Math.cos(puls*t) + 1;
}
function animation(){
  let t = (Date.now()-t0)/1000
  if(!drag && DeltaX){
    scale = oscillations()
    if (t<12 && Math.floor(t*50)%2) { 
    plot_scale(t);
    }
  }
  
  ctx.clearRect(0,0,canvas.width,canvas.height);
//  mur.draw();
  ressort.draw();
  balle.draw();
  raf = requestAnimationFrame(animation);
}

const origin = {x:11,y:98};
function plot_scale(t){
  ctx_g.lineTo(origin.x+t*75,origin.y-(scale-1)*75);
  ctx_g.stroke();
}
function plot_frot(){
  ctx_g.lineWidth = 1;
  ctx_g.strokeStyle = "#808080";
  ctx.setLineDash([5,15]);
  let t = 0 ;
  ctx_g.beginPath();
  ctx_g.moveTo(origin.x,origin.y-75*DeltaX*Math.exp(-t*k_frot.value));
  while(t < 12){
    ctx_g.lineTo(origin.x+t*75,origin.y - 75*DeltaX*Math.exp(-t*k_frot.value));
    t += 0.05 ;
  }
  ctx_g.stroke()
  t = 0 ;
  ctx_g.beginPath();
  ctx_g.moveTo(origin.x,origin.y+75*DeltaX*Math.exp(-t*k_frot.value));
  while(t < 12){
    ctx_g.lineTo(origin.x+t*75,origin.y + 75*DeltaX*Math.exp(-t*k_frot.value));
    t += 0.05 ;
  }
  ctx_g.stroke()
}


frot.checked = false;
k_frot.disabled = true ;
puls = Math.sqrt(k_ressort.value/masse.value);
function init(){
  m_label.innerHTML = `Masse de la balle : m = ${masse.value} kg`;
  k_label.innerHTML = `Raideur du ressort : k = ${k_ressort.value} N&#xB7m⁻²`;
  period.innerHTML = `${Math.round(2*Math.PI/puls*100)/100}`;
  ctx.clearRect(0,0,canvas.width,canvas.height);
//  mur.draw();
  ressort.draw();
  balle.draw();
}
function init_graph(){
  t0 = Date.now()
  ctx_g.clearRect(0,0,graph.width,graph.height);
  if (frot.checked){
    console.log('hey')
    plot_frot();
  }
  ctx_g.lineWidth = 3;
  ctx_g.strokeStyle = "#1c71d8";
  ctx.setLineDash([]);
  ctx_g.moveTo(origin.x,origin.y-scale);
  ctx_g.beginPath();

}
init();
init_graph();
