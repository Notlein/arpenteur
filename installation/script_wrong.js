

// GPS HERE
// 
let GPS_BOX = document.getElementsByClassName("txt-here");
let arr_data = new Array();
let c= 0;
while(c<GPS_BOX.length){
  arr_data.push(GPS_BOX[c].innerHTML);
  c++;
}

// variables globales
var left = 0;
var right = 1; //direction par défaut > droite
var currentNDX = 1; //index de la premiere photo (001)
var currentTraceNDX = 0;
var z = 1;
var menu_status = false;

var ecrit_arr = new Array();

var seq = new Array();

// initialisation de la sequence avec les photos de base
for(let i=0;i<img_Array.length;i++){
  seq.push(img_Array[i]);
}


// tracage offset
const OFFSET_X = 400;
const OFFSET_Y = 100;

// Différentes maps pour displacement
let map = new Array(
  'https://res.cloudinary.com/therealsk/image/upload/v1593860931/heightMap_jjb5ng.png',
  'dist/MAPS/1.jpg',
  'dist/MAPS/2.jpg',
  'dist/MAPS/3.jpg',
  'dist/MAPS/4.jpg',
  'dist/MAPS/5.jpg'
);


function getNbJourInstall() {
  // To set two dates to two variable
  var start = new Date("09/08/2022");
  var now = new Date();
  var then = new Date("10/30/2022"); //??

  // To calculate the time difference of two dates
  var Diff = now.getTime() - start.getTime();

  // To calculate the no. of days between two dates
  var Diff_In_Days = Diff / (1000 * 3600 * 24) % 52; //modulo 52 pour limiter à 52 jours (permet les tests)

  //To display the final no. of days (result)
  var nbDaysRun = Math.ceil(Diff_In_Days);

  return nbDaysRun;
}



// fonction pour displacement map au hasard
function getDispMap() {
  return map[Math.floor(Math.random() * 6)];

}


function getIMG(ndx) {
  return img_Array[ndx - 1];
}

function getTraceIMG() {
  return ecrit_arr[Math.floor(Math.random() * ecrit_arr.length)];
}

function getTraceIMG(ndx) {
  return ecrit_arr[ndx];
}



// mix forward 1->2, 2->3, ...

function createNewMixFwd() {
  var a = new hoverEffect({
    parent: document.querySelector('.distortion'),
    intensity: 0.3,
    angle: Math.PI / (Math.random() * 8),
    speedIn: 20,
    speedOut: 100,
    imagesRatio: 9/16,
    image1: getIMG(currentNDX),
    image2: getIMG(currentNDX + 1),
    displacementImage: getDispMap(),
  })
  // a.next;
  currentNDX++;
  
}

function createNewMixLoop() {
  new hoverEffect({
    parent: document.querySelector('.distortion'),
    intensity: 0.2,
    angle: Math.PI / (Math.random() * 8),
    speedIn: 25,
    speedOut: 100,
    imagesRatio: 9/16,
    image1: getIMG(currentNDX-1), 
    image2: getIMG(1),
    
    displacementImage: getDispMap()
  })
}


function createNewMixTraceIn() {
  
  
  new hoverEffect({
    parent: document.querySelector('.distortion'),
    intensity: 0.2,
    angle: Math.PI / (Math.random() * 8),
    speedIn: 25,
    speedOut: 100,
    imagesRatio: 9/16,
    image1: getIMG(currentNDX), // image svg ici,
    image2: getTraceIMG(currentTraceNDX),
    displacementImage: getDispMap()
  })
}

function createNewMixTraceOut() {
  
  new hoverEffect({
    parent: document.querySelector('.distortion'),
    intensity: 0.2,
    angle: Math.PI / (Math.random() * 8),
    speedIn: 25,
    speedOut: 100,
    imagesRatio: 9/16,
    image1: getTraceIMG(currentTraceNDX), // image svg ici,
    image2: getIMG(currentNDX+1),
    
    displacementImage: getDispMap()
  })
  currentTraceNDX = (currentTraceNDX + 1) % ecrit_arr.length; // a tester
  currentNDX+1;
}

// mix backward 6->5, 5->4, ...
function createNewMixRev() {
  new hoverEffect({
    parent: document.querySelector('.distortion'),
    intensity: 0.3,
    angle: Math.PI / (Math.random() * 8),
    speedIn: 20,
    speedOut: 100,
    imagesRatio: 9/16,
    image1: getIMG(currentNDX + 1),
    image2: getIMG(currentNDX),
    displacementImage: getDispMap(),
  })
  currentNDX--;
}



// Évenements
$("body").keydown(function (e) {
  if (e.keyCode == 37 && currentNDX > 0) { // gauche pour avancer
    // offset
    if (right == 1) {
      currentNDX--
    }
    // changement de direction
    right = 0;
    left = 1;
  } else if (e.keyCode == 39 && currentNDX < 76) { // droite pour avancer
    // offset
    if (left == 1) {
      currentNDX++
    }
    // changement de direction
    left = 0;
    right = 1;
  }
});


$("#overlay-droit").on("click",function () {
  if (currentNDX < (getNbJourInstall() * 2)+arr_data.length) {

    if (left == 1) {
      currentNDX++
    }
    // changement de direction
    left = 0;
    right = 1;

    createNewMixFwd();
    setTimeout(clickButton, 1);
    let canvas_arr = $(".distortion canvas").toArray();
    if (canvas_arr.length > 2) {
      
      $(".distortion canvas:first-child").remove();
    }
    
  }
})

$("#overlay-gauche").on("click", function () {
  if (currentNDX > 0) {
    if (right == 1) {
      currentNDX--
    }
    // changement de direction
    right = 0;
    left = 1;

    createNewMixRev();
    setTimeout(clickButton, 1);
    let canvas_arr = $(".distortion canvas").toArray();
    if (canvas_arr.length > 2) {
      
      $(".distortion canvas:first-child").remove();
    }
    
  }
})



function openMenu(){
  $("#splash").fadeIn();
  $("#fs-icone, #trace-icone").fadeOut();
}

function closeMenu(){
  $("#splash").fadeOut();
  $("#fs-icone, #trace-icone").fadeIn();
}


$("#menu-icone").on("click", 
  function(){
    if(menu_status){
      closeMenu();
      menu_status = false;
    } else {
      openMenu();
      menu_status = true;
    }
  }
);

$("#trace-icone").on("click", 
  function(){transTrace()}
);








function createTrace(el) {

  let gpx = new tcxParser(); //Create tcxParser Object
  gpx.parse(el); //parse gpx file from string data

  let allPts = gpx.tracks[0].points;
  let lats = new Array(); //toutes les latitudes
  let lons = new Array(); //toutes les longitudes
  let dates = new Array();

  for (let j = 0; j < allPts.length; j++) {

    dates.push(allPts[j].time);

    lats.push((allPts[j].lat * 1000000)); // multiplication pour retirer la décimale
    lons.push((allPts[j].lon * 1000000)); //

  }

  let startTime;
  let endTime;
  

  for (let m = 0; m < allPts.length; m++) {
    if (m + 1 == allPts.length) {
      endTime = dates[m];
    } else if (m == 0) {
      startTime = dates[0];
    }
  }



  let diffT = ((endTime - startTime));
  let incrAnim = Math.trunc(diffT / dates.length); //en ms
  let minLat = Math.min.apply(Math, lats);
  let maxLat = Math.max.apply(Math, lats);
  let minLon = Math.min.apply(Math, lons);
  let maxLon = Math.max.apply(Math, lons);
  let diffLat = maxLat - minLat;
  let diffLon = maxLon - minLon;


  let listeDePoints = new Array();

  // Construction de la liste de points
  for (let k = 0; k < lats.length; k++) {
    let y = lats[k] - minLat;
    let x = lons[k] - minLon;
    listeDePoints.push([x, y]);
  }

//   Inversion des points en x de 0 -> (max - min) | (max-min) -> 0
  for (let n = 0; n < lons.length; n++) {
    let max = Math.max.apply(Math, lons);
    listeDePoints[n][0] = max - lons[n];
  }


  // Fonction pour doubler le ratio d'affichage (magnitude 2)
  let ratio = 1;
  let _diff = diffLon;
  while (_diff > 2000) {
    _diff = Math.floor(_diff / 2);
    ratio *= 2;
  }

  let _diff2 = diffLat;
  while (_diff2 > 1000 && ratio == 1) {
    _diff2 = Math.floor(_diff2 / 2);
    ratio *= 2;
  }

  // CRÉATION DU CANVAS
  function setRandomColor() {
    let colors = [
      "#ffffff",
      "#00ff00",
      "#ffff00",
      "#ff58b1",
      "#000000"
    ];
    // return colors[4]; //noir
    return colors[Math.floor(Math.random() * 4)];
  }

  //RATIO ANIMATION
  let _ratioV = 1; //multiplicateur de vitesse
  let ratioAnim = 1 / _ratioV; // conversion du ratio en ms

  // Initialisation du Canvas de traçage
  var canvas = new fabric.Canvas("trace");
  let trcURL = trc_Array[Math.floor(Math.random() * trc_Array.length)];
  let BG_Img = new Image();

  //@TODO responsiveness (optimisé pour affichage 1440p)
  // set to true ratio
  let w = $(window).width()*devicePixelRatio;
  let v = $(window).width()/1920; // ratio to 1080p img
  canvas.setWidth(w);
  canvas.setHeight(w / 16 * 9);
  // BG_Img.onload = function (img) {
    let bg = new fabric.Image(BG_Img, {
      width: w*devicePixelRatio,
      height: w / 16 * 9*devicePixelRatio,
      left: 0,
      top: 0,
      scaleX:v,
      scaleY:v
      
    });
    bg.selectable = false;
    bg.hoverCursor = "default";
    canvas.add(bg);

 
  // };
  BG_Img.src = trcURL;

  // Initie le traçage
  function initiate() {
    let l = 1;
    let clr = setRandomColor();
    let ecrit = setInterval(function () {
      if (l + 1 >= listeDePoints.length) {
        clearInterval(ecrit);
        setTimeout(document.querySelector("#trace-icone").click() ,30000);
        // var svg = canvas.toSVG({suppressPreamble: true});
        // $(".wrap-trace")
        // ecrit_arr.push(svg);
        
        l = 1;
        // setTimeout(function(){carousel()}, 10000);
      }
      // 0&1, 1&2, 2&3, ... n-1&n
      let y = (Math.floor(listeDePoints[l - 1][1] / ratio)*1.3 + OFFSET_Y) / 1.25 *v;
      let x = (Math.floor(listeDePoints[l - 1][0] / ratio) + OFFSET_X) / 1.25 *v;
      let nxt_y = (Math.floor(listeDePoints[l][1] / ratio) *1.3+ OFFSET_Y) / 1.25 *v;
      let nxt_x = (Math.floor(listeDePoints[l][0] / ratio) + OFFSET_X) / 1.25 *v;

      //construction de la ligne
      let line = new fabric.Line([x, y, nxt_x, nxt_y], {
        stroke: clr, // couleur
        strokeLineCap: 'round',
        strokeWidth: 6
      });
      line.selectable = false;
      line.hoverCursor = "default";
      canvas.add(line);
      // désactivation des interactions
      

      
      l+=1;
    }, 1000); //1s
  }

  initiate();
  return canvas;
}



// INITIALISATION DE LA PAGE




const now = new Date();
var month = now.getMonth() + 1;
var day = now.getDate();

var year = now.getFullYear();


function resizeCanvas() {
  var winW = $(window).width(),
      winH = $(window).height(),
      curW = canvas.getWidth(),
      curH = canvas.getHeight(),
      canW = winW,
      canH = winH;
      console.log("test");
      canvas.setWidth(canW);
      canvas.setHeight(canH);
      canvas.renderAll();
    };

function traceAll(){
  let i = 0;

// find latest GPX

  let max_d = 0;
  let max_m = 0;
  let max_i = 0;
  let max_h = 0;
  while ( i < GPS_BOX.length){
    
    let gpx = new tcxParser(); //Create tcxParser Object
    let b = gpx.parse(arr_data[i]);

    let allPts = gpx.tracks[0].points;
    let d = allPts[0].time.getDate();
    let m = allPts[0].time.getMonth() + 1;
    let h = allPts[0].time.getHours();

    if(max_d < d && max_m <= m 
      || max_m < m
      || max_d === d && max_m === m && max_h < h){
      max_h = h;
      max_d = d;
      max_m = m;
      max_i = i;
    }
    i++;
  }

  
    let gpx = new tcxParser(); //Create tcxParser Object
    gpx.parse();
    var canvas = createTrace(arr_data[max_i]);
  
  i = 0;
  while (i < GPS_BOX.length) {
    // if(i != max_i){ fastTrace(arr_data[i]) }
    i++;
  }
  clearScript();
  return canvas;
}




// Simulate click function
function clickButton() {
    document.querySelector('#click-here').click();
    
}

// Simulate a click every second


var trans_status = true; //false is trace mode

//functions for transitioning between Jean-Yves Walk and Bleu Diode's mix
function transTrace(){
  if (trans_status){
    $("#trace-icone").attr("src","./dist/ICONES/ARPENTEUR-BACK.svg");
    
    $(".wrap-trace").stop().fadeIn(2000);
    $(".wrapper").stop().fadeOut(2000);
    
    trans_status = false;
  } else {
    $("#trace-icone").attr("src","./dist/ICONES/ARPENTEUR-ECRITURE.svg");
    $(".wrapper").stop().fadeIn(2000);
    $(".wrap-trace").stop().fadeOut(2000);
    
    

    trans_status = true;
  }
}

// cleanup

function clearScript() {
  $(".landing script").remove();
  $(".txt-here").remove();

}


function initDisto(){
  let q = $(window).width();
  let r = $(window).height(); // ratio to 1080p img +"");
  if(($(window).width()*devicePixelRatio)/($(window).height()*devicePixelRatio) > 16/9){
  $(".distortion").css("width", q +"");
  $(".distortion").css("height", q/16*9 +"");
  }else {
  $(".distortion").css("height", r +"");
  $(".distortion").css("width", r/9*16 +"");
  
  }
}

initDisto();

$(document).ready(function(){


  $(".wrap-trace").stop().fadeOut(1);
  setTimeout(function(){
    traceAll();
    resizeCanvas = function() {
      
      var winH = $(window).height()*devicePixelRatio;
      var winW = $(window).width()*devicePixelRatio;
          // console.log(winW + " : " + winH);

      if(($(window).width()*devicePixelRatio)/($(window).height()*devicePixelRatio) > 16/9){
            $("#trace").css("width", winW);
            $("#trace").css("height", winW/16*9);
          } else {
            $("#trace").css("height", winH);
            $("#trace").css("width", winH/9*16);
          }
          // canvas.renderAll();
        };
    $(window).resize(resizeCanvas)}
    ,1500);
  
  setTimeout(function(){$("#splashload").fadeOut(2000)}, 3500, function(){
    console.log("done");
  });
  setTimeout(function(){document.querySelector('#overlay-droit').click();}, 4000);
  
});


//snitches and stitches