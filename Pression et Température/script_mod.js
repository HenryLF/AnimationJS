const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

const Temp = document.getElementById("Temp");
const T_label = document.getElementById("T_label");
const Poids= document.getElementById("Poids");
const P_label = document.getElementById("P_label");
const gaz_table = [];
const num_gaz = 25;




var Pression = 1 ;
var Temperature = 293 ;

 ctx.font = "16px serif";
 ctx.textAlign = "center";
 ctx.textBaseline = "alphabetic";

//Gestion des images
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

const [enceinte_img, piston_img, poids_img] = await preloadImages([
"PT_Enceinte.svg",
"PT_Piston.svg",
"PT_Poids.svg"
])



const enceinte = {
  img : enceinte_img ,
  w : enceinte_img.width,
  h : enceinte_img.height,
  pos : { x : 10 , y : 10},
  bot: 10 + enceinte_img.height,
  draw(){
  ctx.drawImage(this.img,this.pos.x,this.pos.y);
  }
}
const piston = {
  img : piston_img ,
  h : piston_img.height,
  pos : {x : enceinte.pos.x, y : enceinte.pos.y + enceinte.h/2 - piston_img.height},
  bot(){
  return this.pos.y + this.h + piston_T() + piston_P()
  },
  draw(){
  ctx.drawImage(this.img,this.pos.x,this.pos.y+piston_P()+ piston_T());
  }
}
const poids = {
  img : poids_img ,
  w : poids_img.width,
  h : poids_img.height,
  pos() { 
    return {x : canvas.width/2  , y : piston.pos.y+ piston_P() + piston_T()}
  },
  draw(){
  let scale = Math.pow(Pression-1,1/3)*1.3
  let pos = this.pos()
  ctx.drawImage(this.img,pos.x - scale*this.w/2,pos.y - scale*this.h ,this.w*scale,this.h*scale);
  }
}
//Evenement chgt poids rajouter Pression et Température
Poids.addEventListener("change",function(){
  Pression = (1+Poids.value/10000)
  P_label.innerText = `Poids exercé : ${Poids.value} kg`;
  init_gaz();
})
Temp.addEventListener("change",function(){
  Temperature = 293 * Temp.value
  T_label.innerText = `Température : ${Math.round(Temperature*10)/10} K`;
  init_gaz();
})
function Volume(){
  return Math.round((enceinte.bot - piston.bot())*200/enceinte.h)/100
}
//impact du poids
function piston_P(){
  return enceinte.h/2*(1 - 1/Pression)
}
//impact de la température
function piston_T(){
  return enceinte.h/2*(1-Temp.value)
}


//Textes
function text(){
  ctx.fillStyle= "#000000" ;
  ctx.fillText(`Pression ${Math.round(Pression*1000)/1000} bar`,canvas.width/2,canvas.height-40);
  ctx.fillText(`Volume ${Volume()} m³`,canvas.width/2,canvas.height-20);
}


//Gaz intérieur
const gaz = {
  radius : 3,
  draw(x,y){
  ctx.beginPath();
  ctx.arc(x, y, gaz.radius, 0, Math.PI * 2);
  ctx.fillStyle = "#0095DD";
  ctx.fill();
  ctx.closePath();
  }
}



function init_gaz(){
  for (let i = 0; i < num_gaz ; i++) {
    let angle = Math.random()*2*Math.PI
    gaz_table[i]= {
      x : Math.floor(Math.random() *  enceinte.w*.99  + enceinte.pos.x*1.01),
      y : Math.floor(Math.random() *  .99*(enceinte.pos.y + enceinte.h - piston.bot())  + piston.bot()*1.01),
      dx : Math.cos(angle),
      dy : Math.sin(angle)
    };
  }
} 



function move_gaz(){
//  if(!gaz_table.lenght){init_gaz();}
  gaz_table.forEach(function(item,index, array){
    let incr_x = Temp.value*5*item.dx;
    if (item.x + incr_x > enceinte.pos.x + enceinte.w - gaz.radius || item.x + incr_x < enceinte.pos.x +  gaz.radius) {
      item.dx = -item.dx;
      incr_x = -incr_x;
    }
    let incr_y = Temp.value*5*item.dy;
    if (item.y + incr_y > enceinte.pos.y + enceinte.h - gaz.radius || item.y + incr_y < piston.bot() + gaz.radius) {
      item.dy = -item.dy;
      incr_y = -incr_y;
  }

    item.x += incr_x;
    item.y += incr_y;
    gaz.draw(item.x,item.y)
  });
}


function animation(){
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  enceinte.draw();
  piston.draw();
  poids.draw(Poids.value);
  move_gaz();
  text()
  window.requestAnimationFrame(animation);
}

Poids.value = 0;
P_label.innerText = `Poids exercé : 0 kg`
Temp.value = 1;
T_label.innerText = `Température : 293 K`


init_gaz();
window.requestAnimationFrame(animation);

