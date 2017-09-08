// Sound Effects
var wallS = new Audio("audio/ping_pong_8bit_plop.wav")
var paddleS = new Audio("audio/ping_pong_8bit_beeep.wav")
var missS = new Audio("audio/ping_pong_8bit_peeeeeep.wav")
var atari = new Audio("audio/Atari-Sound.wav")

// Paddle constructor
function Paddle(speed, pos, height, width){
    this.speed = speed;
    this.pos = pos;
    this.height = height;
    this.width = width;
    this.constraint = function(top, bottom){
        if (this.pos <= top){
            this.pos = top
        } else if (this.pos >= bottom){
            this.pos = bottom
        }
    }
}
// Ball constructor
function Ball(topPos,leftPos,topSpeed,leftSpeed,radius){
    this.topPos = topPos;
    this.leftPos = leftPos;
    this.topSpeed = topSpeed;
    this.leftSpeed = leftSpeed;
    this.radius = radius;
}

// Variables
var paddle1 = new Paddle(0, 460, 150, 10)
var paddle2 = new Paddle(0,460,150,10)
var ball = new Ball(510,820,0,0,25)

var score1 = 0;
var score2 = 0;
var round = 1;
var down = false;
var downIntro = false;
var topPauseSpeed = 0;
var leftPauseSpeed = 0;

// Sets ESC button as the pause button
document.addEventListener('keydown',function (e) {
    if ((e.keyCode === 27 || e.which === 27) && ball.topSpeed !== 0) {
        blinkFast('#ball', true);
         topPauseSpeed = ball.topSpeed;
         leftPauseSpeed = ball.leftSpeed;
         ball.topSpeed = 0;
         ball.leftSpeed = 0;
    } else if ((ball.topSpeed === 0 && ball.leftSpeed === 0) && (e.keyCode === 27 || e.which === 27)){
        ball.topSpeed = topPauseSpeed;
        ball.leftSpeed = leftPauseSpeed;
    }
}, false)


// Function sets the ball after each round/new game
function setBall() {
    ball.topPos = 510;
    ball.leftPos = 700;
    ball.topSpeed = 0;
    ball.leftSpeed = 0;
    down = false;
}

// Hide the divs that pop up
$('#intro').hide();
$('#round').hide();
$('#end').hide();

// Function closes the pop up windows and starts new round/game when press enter
function enter (popup) {
    document.addEventListener('keydown', function (e) {
        if (e.keyCode === 13 || e.which === 13) {
            popup.hide();
            if(down === false) {
                startBall();
                down = true;
            }
        }
    })
}

// playPoint function figures out which player
function getWinner () {
    if (score2 > score1) {
        return 2;
    } else {
        return 1;
    }
}

// reset function resets scores and values before new game starts
function reset () {
    score1 = 0;
    score2 = 0;
    round = 1;
    document.getElementById('titleRnd').innerHTML = 1;
    document.getElementById('rnd').innerHTML = 0;
    document.getElementById('score1').innerHTML = 0;
    document.getElementById('score2').innerHTML = 0;
    setBall();
}

// playerPoint function updates the divs that pop up
function playerPoint(player) {
    $round = $('#round')
    if(round < 3){
        round ++;
        document.getElementById('rnd').innerHTML = round;
        document.getElementById('titleRnd').innerHTML = round;
        document.getElementById('player').innerHTML = player;
        $round.show();
        setBall();
        enter($round);
    } else {
        var $end = $('#end')
        document.getElementById('winner').innerHTML = getWinner()
        $end.show();
        reset();
        enter($end);
    }
}


function intro() {
    $('#intro').fadeIn();
    blink('p');
    document.addEventListener('keydown', function (e) {
    if (e.keyCode === 13 || e.which === 13) { // Enter key
        $('#intro').fadeOut('slow');
        if(downIntro === false){
            atari.play();
            startBall();
            downIntro = true;
        }
        
    }
    })
 }

// sets the intial position of the ball and moves it
function startBall() {
    ball.topPos = 510;
    ball.leftPos = 700;
    if (Math.random() < 0.5) {
        var side = 1
    } else {
        var side = -1
    }
    ball.topSpeed = Math.random() * -6 - 8;
    ball.leftSpeed = side * (Math.random() * 6 + 8);
};

// setting up the buttons when pressed down
document.addEventListener('keydown', function (e) {
    if (e.keyCode === 87 || e.which === 87) { // W key
        paddle1.speed = -10;
    }

    if (e.keycode === 83 || e.which === 83) { // S Key
        paddle1.speed = 10;
    }

    if (e.keycode === 38 || e.which === 38) { // UP Arrow Key
        paddle2.speed = -10;
    }

    if (e.keycode === 40 || e.which === 40) { // DOWN Arrow Key
        paddle2.speed = 10;
    }
}, false)

//create smooth paddle movement
window.setInterval(function show() {
    paddle1.pos += paddle1.speed;
    paddle2.pos += paddle2.speed;

    document.getElementById('paddle1').style.top = (paddle1.pos) + "px"
    document.getElementById('paddle2').style.top = (paddle2.pos) + "px"

    ball.topPos += ball.topSpeed;
    ball.leftPos += ball.leftSpeed;

    document.getElementById("ball").style.top = (ball.topPos) + "px";
    document.getElementById("ball").style.left = (ball.leftPos) + "px";

    paddle1.constraint(150, window.innerHeight - paddle1.height)
    // if (paddle1.pos <= 150) { // set paddle1 position at the top
    //     paddle1.pos = 150;
    // }
    if (paddle2.pos <= 150) { // set paddle2 position at the top
        paddle2.pos = 150;
    }
    // if (paddle1.pos >= window.innerHeight - paddle1.height) { // set paddle1 position at the bottom
    //     paddle1.pos = window.innerHeight - paddle1.height
    // }
    if (paddle2.pos >= window.innerHeight - paddle1.height) { // set paddle2 position at the bottom
        paddle2.pos = window.innerHeight - paddle1.height
    }
    if (ball.topPos <= 150 || ball.topPos >= window.innerHeight - ball.radius) { // reverse the ball when it hits the top or bottom
        ball.topSpeed = -ball.topSpeed;
        wallS.play();
    }
    if (ball.leftPos <= paddle1.width) { // reverse direction of ball when it hits paddle1, else new game
        if (ball.topPos > paddle1.pos && ball.topPos < paddle1.pos + paddle1.height) {
            ball.leftSpeed = -ball.leftSpeed;
            paddleS.play();
        } else {
            score2++;
            missS.play();
            setBall();
            playerPoint(2);
            }
    }
    if (ball.leftPos >= window.innerWidth - ball.radius - paddle1.width) { // reverse direction of ball when it hits paddle2, else new game
        if (ball.topPos > paddle2.pos && ball.topPos < paddle2.pos + paddle1.height) {
            ball.leftSpeed = -ball.leftSpeed;
            paddleS.play();
        } else {
            score1++;
            missS.play();
            setBall();
            playerPoint(1);
            }
    }   

    document.getElementById('score1').innerHTML = score1.toString();
    document.getElementById('score2').innerHTML = score2.toString();
}, 1000/60);

// Stops the paddles when keyed up
document.addEventListener('keyup', function (e) {
    if (e.keyCode === 87 || e.which === 87) {
        paddle1.speed = 0;
    }
    if (e.keyCode === 83 || e.which === 83) {
        paddle1.speed = 0;
    }
    if (e.keyCode === 38 || e.which === 38) {
        paddle2.speed = 0;
    }
    if (e.keycode === 40 || e.which === 40) {
        paddle2.speed = 0;
    }
}, false)

// blinks content
function blink(selector){
$(selector).fadeOut('slow', function(){
    $(this).fadeIn('slow', function(){
        blink(this);
    });
});
}

// blink content fast
function blinkFast(selector, statement){
    document.addEventListener('keydown',function (e) {
        if (e.keyCode === 27 || e.which === 27){
            return statement = false;
        }
    })
    if (!statement) return;
    $(selector).fadeOut('fast', function(){
        $(this).fadeIn('fast', function(){
            blinkFast(this, statement);
        });
    });
    }