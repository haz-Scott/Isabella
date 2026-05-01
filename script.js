const panels = document.querySelectorAll(".panel");
const dotsWrap = document.getElementById("dots");
const bg = document.getElementById("bg");
const petals = document.getElementById("petals");
const audio = document.getElementById("audio");
const musicBtn = document.getElementById("musicBtn");
const sharedWall = document.getElementById("shared-wall");

// paneles que muestran el fondo de fotos (índices 1,2,3,4)
const WALL_PANELS = new Set([1,2,3,4]);

const fotos = [
"1.jpeg","2.jpeg","3.jpeg","4.jpeg","5.jpeg","6.jpeg","7.jpeg",
"8.jpeg","9.jpeg","ultimajuntos.jpeg","ramo.jpeg",
"navidad.jpeg","navidad2.jpeg","navidad3.jpeg"
];

let current = 0;

/* puntos */
panels.forEach((_,i)=>{
const d=document.createElement("span");
if(i===0)d.classList.add("active");
dotsWrap.appendChild(d);
});

const dots = dotsWrap.querySelectorAll("span");

/* pétalos */
for(let i=0;i<28;i++){
const p=document.createElement("span");
p.className="petal";
p.innerHTML=["🌸","✿","❀","🌷"][Math.floor(Math.random()*4)];
p.style.left=Math.random()*100+"%";
p.style.fontSize=(14+Math.random()*14)+"px";
p.style.animationDuration=(10+Math.random()*12)+"s";
p.style.animationDelay=Math.random()*8+"s";
petals.appendChild(p);
}

/* fondo degradado */
function lerp(a,b,t){
return a+(b-a)*t;
}

function setBg(t){

const c1={r:247,g:233,b:239};
const c2={r:205,g:165,b:184};
const c3={r:70,g:28,b:46};

let r,g,b;

if(t<.5){

let p=t/.5;
r=lerp(c1.r,c2.r,p);
g=lerp(c1.g,c2.g,p);
b=lerp(c1.b,c2.b,p);

}else{

let p=(t-.5)/.5;
r=lerp(c2.r,c3.r,p);
g=lerp(c2.g,c3.g,p);
b=lerp(c2.b,c3.b,p);
}

bg.style.background=`rgb(${r},${g},${b})`;
}

/* mosaico fotos — solo una pared compartida */
function makeWalls(){

sharedWall.innerHTML="";

let total;

if(innerWidth<560) total=42;
else if(innerWidth<900) total=64;
else total=96;

for(let i=0;i<total;i++){

const tile=document.createElement("div");
tile.className="tile";

const img=document.createElement("img");
img.src=fotos[i%fotos.length];

tile.style.setProperty("--r",(-10+Math.random()*20)+"deg");

if(Math.random()>.76) tile.style.gridRow="span 2";
if(Math.random()>.84) tile.style.gridColumn="span 2";

tile.appendChild(img);
sharedWall.appendChild(tile);
}
}

/* mostrar escenas */
function showPanel(n){

panels.forEach(p=>p.classList.remove("active"));
dots.forEach(d=>d.classList.remove("active"));

if(panels[n]) panels[n].classList.add("active");
if(dots[n]) dots[n].classList.add("active");

current = n;
setBg(n/(panels.length-1));

// la pared de fotos se mantiene fija, solo aparece/desaparece suavemente
if(WALL_PANELS.has(n)){
sharedWall.classList.add("visible");
}else{
sharedWall.classList.remove("visible");
}
}

/* scroll estático */
function updateScroll(){

const h = innerHeight;
let n = Math.round(scrollY / h);

if(n < 0) n = 0;
if(n > panels.length-1) n = panels.length-1;

if(n !== current){
showPanel(n);
}
}

/* música */
let playing = false;

musicBtn.onclick = ()=>{

if(!playing){

audio.volume = 0;
audio.play();

let v = 0;

const fade = setInterval(()=>{

v += 0.05;
audio.volume = Math.min(v,.85);

if(v >= .85) clearInterval(fade);

},60);

musicBtn.innerHTML = "♫";
playing = true;

}else{

let v = audio.volume;

const fade = setInterval(()=>{

v -= 0.05;
audio.volume = Math.max(v,0);

if(v <= 0){
clearInterval(fade);
audio.pause();
}

},60);

musicBtn.innerHTML = "♪";
playing = false;
}
};

/* inicio */
addEventListener("load",()=>{

scrollTo(0,0);

makeWalls();
showPanel(0);

});

addEventListener("scroll",updateScroll,{passive:true});

addEventListener("resize",()=>{

makeWalls();
updateScroll();

});