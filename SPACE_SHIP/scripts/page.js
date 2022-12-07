// ===================== Fall 2022 EECS 493 Assignment 3 =====================
// This starter code provides a structure and helper functions for implementing
// the game functionality. It is a suggestion meant to help you, and you are not
// required to use all parts of it. You can (and should) add additional functions
// as needed or change existing functions.

// ==================================================
// ============ Page Scoped Globals Here ============
// ==================================================

// Div Handlers
let onScreenAsteroid;
let game_window;
let game_screen;
var volume = 50;
var first_danger_num = 20;
var new_game = true;
let astProjectileSpeed = 3;
// Game Object Helpers
let currentAsteroid = 1;
let AST_OBJECT_REFRESH_RATE = 15;
let maxPersonPosX = 1218;
let maxPersonPosY = 658;
let PERSON_SPEED = 20;                // Speed of the person
let vaccineOccurrence = 20000;       // Vaccine spawns every 20 seconds
let vaccineGone = 5000;              // Vaccine disappears in 5 seconds
let maskOccurrence = 15000;          // Masks spawn every 15 seconds
let maskGone = 5000;                 // Mask disappears in 5 seconds

var isshield = false;
// Movement Helpers
var LEFT = false;
var RIGHT = false;
var UP = false;
var DOWN = false;
var touched = false;


// ==============================================
// ============ Functional Code Here ============
// ==============================================

// Main
$(document).ready(function () {
    // ====== Startup ====== 
    game_window = $('.game-window');
    game_screen = $("#actual_game");
    onScreenAsteroid = $('.curAstroid');
    spaceship = $('#player_img');

    main_menu = $('#menu-top');
    settings = $('#Settings');
    page_finish = $('#page-finish');
    tutorial = $('#Tutorial');
    final_score = $('#final_score');
    page_ready = $('#page_ready');
    score_num = $('#score_num');
    danger_num = $('#danger_num');
    level_num = $('#level_num');
    
    $(window).keydown(istemp2);
    $(window).keyup(istemp);

    but_play = $('#but_play');
    but_start = $('#but_start');
    but_re = $('#but_re');
    but_close = $('#but_close');
    but_setting = $('#but_setting');


    but_easy = $('#but_easy');
    but_normal = $('#but_normal');
    but_hard = $('#but_hard');
    text_vol = $('#volume');
    bar_vol = $('.slider');

    spawn_as = 800;
    speed_as = 30;
    finish = false;

    let b = "border"
    let yellow = "solid 4px yellow"
    let tans = "solid 4px transparent"


    but_normal.css(b,yellow);

    but_easy.on("click",()=>{
      spawn_as = 1000;
      speed_as = 10;
      first_danger_num = 10;
      but_easy.css(b,yellow);
      but_normal.css(b,tans);
      but_hard.css(b,tans);
    });

    but_normal.on("click",()=>{
      spawn_as = 800;
      speed_as = 30;
      first_danger_num = 20;
      but_easy.css(b,tans);
      but_normal.css(b,yellow);
      but_hard.css(b,tans);
    });

    but_hard.on("click",()=>{
      spawn_as = 600;
      speed_as = 50;
      first_danger_num = 30;
      but_easy.css(b,tans);
      but_normal.css(b,tans);
      but_hard.css(b,yellow);
    })



    
    but_setting.on("click",()=>{
      settings.show();
      choosevol = setInterval(()=>{
        volume = bar_vol.val();
        text_vol.html(volume);
      },25) 
    });

    but_close.on("click",()=>{
      settings.hide();
      clearInterval(choosevol);
    });

    function settime (){
      setTimeout(()=>{
        page_ready.hide();
        spaceship.attr("src", "./src/player/player.gif");
        executeGame();
      },2000);
    }


    but_play.on("click",()=>{
      if(new_game){
        main_menu.hide(); 
        tutorial.show(); 

      } else{
        danger_num.html(first_danger_num);
        main_menu.hide();
        game_screen.show();
        page_ready.show(); 
        settime()
      }
    });

    but_start.on("click",()=>{
      danger_num.html(first_danger_num);
      tutorial.hide();
      game_screen.show(); 
      settime()
    });

    but_re.on("click",()=>{
      main_menu.show();
      page_finish.hide();      
      game_screen.hide();
      but_play.show();
      but_setting.show();

      danger_num.html(first_danger_num);
      level_num.html(no_of_level);
      score_num.html(score);
      level = 1;
      no_of_level = 1;    
      score = 0;      

      player_img = "<img id = 'player_img'></img>";
      player = "<div id = 'player'></div>";
      game_screen.append(player);
      player = $("#player");
      player.append(player_img);
      spaceship = $('#player_img');
      new_game = false;
    });


});

function executeGame () {
  //spawn()
  score = 0;
  level = 1;
  no_of_level = 1;
  templist = [];
  // Counters
  noofport = 1;
  noofshield = 1;
  thereshield = false;
  startgame = false;
  finish = false;

  danger_num.html(first_danger_num);
  level_num.html(no_of_level);
  score_num.html(score);

  templist.push(setInterval(makeshield,maskOccurrence));
  templist.push(setInterval(makeport,vaccineOccurrence));
  templist.push(setInterval(astMetSpawnRandomizer,spawn_as));
  templist.push(setInterval(() =>{
    port = $(".port");
    player = $("#player");
    shield = $(".shield");
    curAstroid = $(".curAstroid");
    iscolliding(player,shield,port,curAstroid)
  },1));

  templist.push(setInterval(()=>{
    score += 40;
    score_num.html(score);
  },480));
  

}

function astMetSpawnRandomizer(){
  spawn();
}

function makesound(audio) {
  var sound = new Audio(audio);
  sound.volume = volume/100;
  sound.load();
  sound.play();
  setTimeout(() => {sound.pause(); sound.currentTime=0;},1000);
}

function iscolliding (player,shiled,port,curAstroid) {
  shiled.each(function(){
    if (!isshield && isColliding(player,$(this)) ){
      isshield = true;
      spaceship.attr("src", "./src/player/player_shielded.gif");
      makesound('./src/audio/collect.mp3')
      $(this).remove();
    }    
  });
  port.each(function(){
    if(isColliding(player,$(this))){
      makesound('./src/audio/collect.mp3')
      speed_as *= 1.2;
      no_of_level += 1;
      first_danger_num += 2;
      level_num.html(no_of_level);
      danger_num.html(first_danger_num);
      $(this).remove();
    }
  })
  
  curAstroid.each(function(){
    if(!thereshield && isColliding(player,$(this))){
      if(!isshield) {
        spaceship.attr("src","./src/player/player_touched.gif");
        for (var thing of templist){
          clearInterval(thing);
        }

        finish = true;
        makesound('./src/audio/die.mp3')
        setTimeout(() => {
          main_menu.show();
          page_finish.show();
          final_score.html(score); 
          but_setting.hide();
          game_screen.hide();
          but_play.hide();
          shield = $(".shield");
          player = $("#player");
          port = $(".port");
          curAstroid = $(".curAstroid");

          spaceship.remove();
          player.remove();
          shield.each(function(index,element){element.remove()});
          curAstroid.each(function(index,element){element.remove()});
          port.each(function(index,element){element.remove()});          
        },2000);
   
      } else {
        spaceship.attr("src","./src/player/player.gif");
        thereshield = true;
        isshield = false;
        setTimeout(()=>{thereshield = false},1000);
      }
    }
  });
}

function istemp(){
  if(!finish){
    startgame = true;
    if (isshield) {
      spaceship.attr("src", "./src/player/player_shielded.gif");
    } else {
      spaceship.attr("src", "./src/player/player.gif");}
  }
}


function istemp2() {
  if (!finish){
    if (LEFT) {
      let postemp = parseInt(player.css("left")) - PERSON_SPEED;
      if (postemp < 0) {
        postemp = 0;
      }
      player.css("left", postemp);
      checkshiled("./src/player/player_left.gif", "./src/player/player_shielded_left.gif")
    }

    if (RIGHT) {
      let postemp = parseInt(player.css("left")) + PERSON_SPEED;
      if (postemp > maxPersonPosX) {
        postemp = maxPersonPosX;
      }
      player.css("left", postemp);
      checkshiled("./src/player/player_right.gif", "./src/player/player_shielded_right.gif")
    }

    if (UP) {
      let postemp = parseInt(player.css("top")) - PERSON_SPEED;
      if (postemp < 0) {
        postemp = 0;
      }    
      player.css("top", postemp);
      checkshiled("./src/player/player_up.gif", "./src/player/player_shielded_up.gif")
    }
    if (DOWN) {
      let postemp = parseInt(player.css("top")) + PERSON_SPEED;
      if (postemp > maxPersonPosY) {
        postemp = maxPersonPosY;
      }
      player.css("top", postemp);
      checkshiled("./src/player/player_down.gif", "./src/player/player_shielded_down.gif")
    }
  }
}

function checkshiled(first, second) {
  if(!isshield){
    spaceship.attr("src", first);
  } else {
    spaceship.attr("src", second);
  } 
}

// Keydown event handler
document.onkeydown = function(e) {
    if (e.key == 'ArrowLeft') LEFT = true;
    if (e.key == 'ArrowRight') RIGHT = true;
    if (e.key == 'ArrowUp') UP = true;
    if (e.key == 'ArrowDown') DOWN = true;
    
}
// Keyup event handler
document.onkeyup = function (e) {
    if (e.key == 'ArrowLeft') LEFT = false;
    if (e.key == 'ArrowRight') RIGHT = false;
    if (e.key == 'ArrowUp') UP = false;
    if (e.key == 'ArrowDown') DOWN = false;
}

function makeport() {
  let vaccineDivStr = "<div id='v-" + noofport + "' class = 'port'> <img src ='src/port.gif' /> </div>";
  game_window.append(vaccineDivStr);

  porttemp = $('#v-' + noofport);
  noofport++;
  porttemp.css({"right": getRandomNumber(0,maxPersonPosX), "top" : getRandomNumber(0,maxPersonPosY)});

  setTimeout(()=> {porttemp.remove();},vaccineGone)
}

function makeshield() {
  let maskDivStr = "<div id='m-" + noofshield + "' class = 'shield'> <img src ='src/shield.gif' /> </div>";
  game_window.append(maskDivStr);

  this.id = $('#m-' + noofshield);
  noofshield++;
  this.id.css({"right": getRandomNumber(0,maxPersonPosX), "top" : getRandomNumber(0,maxPersonPosY)});
  

  setTimeout(()=> {this.id.remove();},maskGone)
}

//===================================================

// ==============================================
// =========== Utility Functions Here ===========
// ==============================================

// Are two elements currently colliding?
function isColliding(o1, o2) {
  return isOrWillCollide(o1, o2, 0, 0);
}

// Will two elements collide soon?
// Input: Two elements, upcoming change in position for the moving element
function willCollide(o1, o2, o1_xChange, o1_yChange){
  return isOrWillCollide(o1, o2, o1_xChange, o1_yChange);
}

// Are two elements colliding or will they collide soon?
// Input: Two elements, upcoming change in position for the moving element
// Use example: isOrWillCollide(paradeFloat2, person, FLOAT_SPEED, 0)
function isOrWillCollide(o1, o2, o1_xChange, o1_yChange){
  const o1D = { 'left': o1.offset().left + o1_xChange,
        'right': o1.offset().left + o1.width() + o1_xChange,
        'top': o1.offset().top + o1_yChange,
        'bottom': o1.offset().top + o1.height() + o1_yChange
  };
  const o2D = { 'left': o2.offset().left,
        'right': o2.offset().left + o2.width(),
        'top': o2.offset().top,
        'bottom': o2.offset().top + o2.height()
  }; 
  // Adapted from https://developer.mozilla.org/en-US/docs/Games/Techniques/2D_collision_detection
  if (o1D.left < o2D.right &&
    o1D.right > o2D.left &&
    o1D.top < o2D.bottom &&
    o1D.bottom > o2D.top) {
     // collision detected!
     return true;
  }
  return false;
}

// Get random number between min and max integer
function getRandomNumber(min, max){
  return (Math.random() * (max - min)) + min;
}


// Starter Code for randomly generating and moving an asteroid on screen
// Feel free to use and add additional methods to this class
class Asteroid {
  // constructs an Asteroid object
  constructor() {
      /*------------------------Public Member Variables------------------------*/
      // create a new Asteroid div and append it to DOM so it can be modified later
      let objectString = "<div id = 'a-" + currentAsteroid + "' class = 'curAstroid' > <img src = 'src/asteroid.png'/></div>";
      game_window.append(objectString);
      // select id of this Asteroid
      this.id = $('#a-' + currentAsteroid);
      currentAsteroid++; // ensure each Asteroid has its own id
      // current x, y position of this Asteroid
      this.cur_x = 0; // number of pixels from right
      this.cur_y = 0; // number of pixels from top

      /*------------------------Private Member Variables------------------------*/
      // member variables for how to move the Asteroid
      this.x_dest = 0;
      this.y_dest = 0;
      // member variables indicating when the Asteroid has reached the boarder
      this.hide_axis = 'x';
      this.hide_after = 0;
      this.sign_of_switch = 'neg';
      // spawn an Asteroid at a random location on a random side of the board
      this.#spawnAsteroid();
  }

  // Requires: called by the user
  // Modifies:
  // Effects: return true if current Asteroid has reached its destination, i.e., it should now disappear
  //          return false otherwise
  hasReachedEnd() {
      if(this.hide_axis == 'x'){
          if(this.sign_of_switch == 'pos'){
              if(this.cur_x > this.hide_after){
                  return true;
              }                    
          }
          else{
              if(this.cur_x < this.hide_after){
                  return true;
              }          
          }
      }
      else {
          if(this.sign_of_switch == 'pos'){
              if(this.cur_y > this.hide_after){
                  return true;
              }                    
          }
          else{
              if(this.cur_y < this.hide_after){
                  return true;
              }          
          }
      }
      return false;
  }

  // Requires: called by the user
  // Modifies: cur_y, cur_x
  // Effects: move this Asteroid 1 unit in its designated direction
  updatePosition() {
      // ensures all asteroids travel at current level's speed
      this.cur_y += this.y_dest * astProjectileSpeed;
      this.cur_x += this.x_dest * astProjectileSpeed;
      // update asteroid's css position
      this.id.css('top', this.cur_y);
      this.id.css('right', this.cur_x);
  }

  // Requires: this method should ONLY be called by the constructor
  // Modifies: cur_x, cur_y, x_dest, y_dest, num_ticks, hide_axis, hide_after, sign_of_switch
  // Effects: randomly determines an appropriate starting/ending location for this Asteroid
  //          all asteroids travel at the same speed
  #spawnAsteroid() {
      // REMARK: YOU DO NOT NEED TO KNOW HOW THIS METHOD'S SOURCE CODE WORKS
      let x = getRandomNumber(0, 1280);
      let y = getRandomNumber(0, 720);
      let floor = 784;
      let ceiling = -64;
      let left = 1344;
      let right = -64;
      let major_axis = Math.floor(getRandomNumber(0, 2));
      let minor_aix =  Math.floor(getRandomNumber(0, 2));
      let num_ticks;

      if(major_axis == 0 && minor_aix == 0){
          this.cur_y = floor;
          this.cur_x = x;
          let bottomOfScreen = game_screen.height();
          num_ticks = Math.floor((bottomOfScreen + 64) / astProjectileSpeed);

          this.x_dest = (game_screen.width() - x);
          this.x_dest = (this.x_dest - x)/num_ticks + getRandomNumber(-.5,.5);
          this.y_dest = -astProjectileSpeed - getRandomNumber(0, .5);
          this.hide_axis = 'y';
          this.hide_after = -64;
          this.sign_of_switch = 'neg';
      }
      if(major_axis == 0 && minor_aix == 1){
          this.cur_y = ceiling;
          this.cur_x = x;
          let bottomOfScreen = game_screen.height();
          num_ticks = Math.floor((bottomOfScreen + 64) / astProjectileSpeed);

          this.x_dest = (game_screen.width() - x);
          this.x_dest = (this.x_dest - x)/num_ticks + getRandomNumber(-.5,.5);
          this.y_dest = astProjectileSpeed + getRandomNumber(0, .5);
          this.hide_axis = 'y';
          this.hide_after = 784;
          this.sign_of_switch = 'pos';
      }
      if(major_axis == 1 && minor_aix == 0) {
          this.cur_y = y;
          this.cur_x = left;
          let bottomOfScreen = game_screen.width();
          num_ticks = Math.floor((bottomOfScreen + 64) / astProjectileSpeed);

          this.x_dest = -astProjectileSpeed - getRandomNumber(0, .5);
          this.y_dest = (game_screen.height() - y);
          this.y_dest = (this.y_dest - y)/num_ticks + getRandomNumber(-.5,.5);
          this.hide_axis = 'x';
          this.hide_after = -64;
          this.sign_of_switch = 'neg';
      }
      if(major_axis == 1 && minor_aix == 1){
          this.cur_y = y;
          this.cur_x = right;
          let bottomOfScreen = game_screen.width();
          num_ticks = Math.floor((bottomOfScreen + 64) / astProjectileSpeed);

          this.x_dest = astProjectileSpeed + getRandomNumber(0, .5);
          this.y_dest = (game_screen.height() - y);
          this.y_dest = (this.y_dest - y)/num_ticks + getRandomNumber(-.5,.5);
          this.hide_axis = 'x';
          this.hide_after = 1344;
          this.sign_of_switch = 'pos';
      }
      // show this Asteroid's initial position on screen
      this.id.css("top", this.cur_y);
      this.id.css("right", this.cur_x);
      // normalize the speed s.t. all Asteroids travel at the same speed
      let speed = Math.sqrt((this.x_dest)*(this.x_dest) + (this.y_dest)*(this.y_dest));
      this.x_dest = this.x_dest / speed;
      this.y_dest = this.y_dest / speed;
  }
}

// Spawns an asteroid travelling from one border to another
function spawn() {
  let asteroid = new Asteroid();
  setTimeout(spawn_helper(asteroid), 0);
}

function spawn_helper(asteroid) {
  let astermovement = setInterval(function () {
    // update asteroid position on screen
    asteroid.updatePosition();

    // determine whether asteroid has reached its end position, i.e., outside the game border
    if (asteroid.hasReachedEnd()) {
      asteroid.id.remove();
      clearInterval(astermovement);
    }
  }, AST_OBJECT_REFRESH_RATE);
}