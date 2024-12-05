const canvas = document.getElementById("canvas");
const ratio = document.getElementById("ratio");
const ratio_label = document.getElementById("ratio_label");
const ctx = canvas.getContext("2d");
var drag = false;
var DragStart = 0;
var DragEnd = 0;

const plateau_img = new Image();
plateau_img.src = "Balance_Plateau.png";
const socle_img = new Image();
socle_img.src = "Balance_Socle.png";
const poids_img = new Image();
poids_img.src = "Poids.png";

 ctx.font = "48px serif";
 ctx.textAlign = "center";

const poids = {
  src : poids_img,
  center(pos) {
  return
  }
}
const plateau = {
  img : plateau_img,
  rotate(){},
    pos : {x : 200, y : 400},
  center() { 
    return {
      x : this.pos.x + this.img.width/2 ,
      y : this.pos.y + this.img.height/2 
      }
    },
  draw(scale){
  ctx.drawImage(this.img, this.pos.x,this.pos.y) ;
  ctx.drawImage(poids_img, this.pos.x-poids_img.width/scale/2,this.pos.y-poids_img.height/scale, poids_img.width/scale,poids_img.height/scale);
  
  ctx.drawImage(poids_img, this.pos.x + this.img.width - poids_img.width/2*scale,this.pos.y-poids_img.height*scale, poids_img.width*scale,poids_img.height*scale);
  }
};

const socle = {
  img : socle_img,
  pos() { 
    return {
      x :  plateau.pos.x + plateau.img.width*ratio.value/100 - this.img.width/2,
      y : plateau.pos.y + plateau.img.height
      }
    },
  center() { 
    return {
      x : this.pos().x + this.img.width/2 ,
      y : this.pos().y + this.img.height/2 
      }
    },
  draw(){
  ctx.drawImage(this.img, this.pos().x,this.pos().y) ;
  }
};


canvas.addEventListener('mousedown',function(event){
  drag = true ;
  DragStart = event.pageY - canvas.offsetTop ;
})
canvas.addEventListener('mousemove',function(event){
  if(drag){
  DragEnd = event.pageY - canvas.offsetTop - DragStart ;
  DragEnd = Math.max(-600,DragEnd) ;
  DragEnd = Math.min(DragEnd,600) ;
  DragEnd = DragEnd/600 ;
  }
})
canvas.addEventListener('mouseup',function(event){
  drag = false ;
})
function text(inc){
  if(inc<1){
  ctx.fillText(`${Math.round(100/inc)/100} kg`,plateau.pos.x,100) ;
  ctx.fillText(`1 kg`,plateau.pos.x+plateau.img.width,100) ;
  }
  else {
  ctx.fillText(`${Math.round(100*inc)/100} kg`,plateau.pos.x+plateau.img.width,100) ;
  ctx.fillText(`1 kg`,plateau.pos.x,100) ;
  }
}
function animation(){
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  socle.draw() ;
  inc = ratio.value/(100-ratio.value) ;
  if(!drag){
  DragEnd = DragEnd - 0.08*DragEnd ;
  }
  ctx.translate(socle.center().x,socle.pos().y);
  ctx.rotate(Math.PI*DragEnd*7/18);
  ctx.translate(-socle.center().x,-socle.pos().y) ;
  plateau.draw(Math.pow(inc,1/3)) ;
  ctx.setTransform(1, 0, 0, 1, 0, 0);
  text(inc) ;
  ratio_label.innerText = `ratio : ${inc }` ;
  window.requestAnimationFrame(animation); 
}

function main(){
ratio.value = 50 ;
window.requestAnimationFrame(animation) ;
}

main();
