var wallS = new Audio("ping_pong_8bit_plop.wav")
var paddleS = new Audio("ping_pong_8bit_beeep.wav")
var missS = new Audio("ping_pong_8bit_peeeeeep.wav")
var atari = new Audio("Atari-Sound.wav")

var paddleHeight = 150;
var paddleWidth = 10;
var ballRadius = 25;
var halfPaddleHeight = paddleHeight / 2;
var speedOfPaddle1 = 0;
var positionOfPaddle1 = 460;
var speedOfPaddle2 = 0;
var positionOfPaddle2 = 460;
var topPositionOfBall = 510;
var leftPositionOfBall = 820;
var topSpeedOfBall = 0;
var leftSpeedOfBall = 0;
var score1 = 0;
var score2 = 0;
var nextRnd = 0;
var down = false;

function setBall() {
    topPositionOfBall = 510;
    leftPositionOfBall = 700;
    topSpeedOfBall = 0;
    leftSpeedOfBall = 0;
}

$('#intro').hide();
$('#round').hide();
$('#end').hide();

function enter (enter) {
    document.addEventListener('keydown', function (e) {
        if (e.keyCode === 13 || e.which === 13) {
        enter.hide();
        startBall();
        }
        })
}
function playerPoint () {
    if (score2 > score1) {
        return 2;
    } else {
        return 1;
    }
}
function reset () {
    score1 = 0;
    score2 = 0;
    document.getElementById('titleRnd').innerHTML = 1;
    document.getElementById('rnd').innerHTML = 0;
    document.getElementById('score1').innerHTML = 0;
    document.getElementById('score2').innerHTML = 0;
    setBall();
}
function checkRound() {
    nextRnd = score1 + score2 + 1;
    $round = $('#round')
    if(nextRnd === 2){
        document.getElementById('rnd').innerHTML = nextRnd;
        document.getElementById('titleRnd').innerHTML = nextRnd;
        document.getElementById('player').innerHTML = playerPoint();
        $round.show();
        setBall();
        enter($round);
    } else if (nextRnd === 3) {
            document.getElementById('rnd').innerHTML = nextRnd;
            document.getElementById('titleRnd').innerHTML = nextRnd;
            document.getElementById('player').innerHTML = playerPoint();
            $round.show();
            setBall();
            enter($round);
    } else {
            var $end = $('#end')
            document.getElementById('winner').innerHTML = playerPoint()
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
        if(down === false){
            atari.play();
            down = true;
        }
        startBall();
    }
    })
 }

function startBall() {
topPositionOfBall = 510;
leftPositionOfBall = 700;
if (Math.random() < 0.5) {
  var side = 1
 } else {
  var side = -1
 }
 topSpeedOfBall = Math.random() * -6 - 8;
 leftSpeedOfBall = side * (Math.random() * 6 + 8);
};

document.addEventListener('keydown', function (e) {
    if (e.keyCode === 87 || e.which === 87) { // W key
    speedOfPaddle1 = -10;
    //document.getElementById('paddle1').style.top = (positionOfPaddle1) + "px"
    }

    if (e.keycode === 83 || e.which === 83) { // S Key
    speedOfPaddle1 = 10;
    //document.getElementById('paddle1').style.top = (positionOfPaddle1) + "px"
    }

    if (e.keycode === 38 || e.which === 38) { // UP Arrow Key
    speedOfPaddle2 = -10;
    //document.getElementById('paddle2').style.top = (positionOfPaddle2) + "px"
    }

    if (e.keycode === 40 || e.which === 40) { // DOWN Arrow Key
    speedOfPaddle2 = 10;
    //document.getElementById('paddle2').style.top = (positionOfPaddle2) + "px"
    }
}, false)

//create smooth paddle movement
window.setInterval(function show() {
    positionOfPaddle1 += speedOfPaddle1;
    positionOfPaddle2 += speedOfPaddle2;

    document.getElementById('paddle1').style.top = (positionOfPaddle1) + "px"
    document.getElementById('paddle2').style.top = (positionOfPaddle2) + "px"

    topPositionOfBall += topSpeedOfBall;
    leftPositionOfBall += leftSpeedOfBall;

    document.getElementById("ball").style.top = (topPositionOfBall) + "px";
    document.getElementById("ball").style.left = (leftPositionOfBall) + "px";

    if (positionOfPaddle1 <= 150) {
        positionOfPaddle1 = 150;
    }
    if (positionOfPaddle2 <= 150) {
        positionOfPaddle2 = 150;
    }
    if (positionOfPaddle1 >= window.innerHeight - paddleHeight) { // set paddle1 position
        positionOfPaddle1 = window.innerHeight - paddleHeight
    }
    if (positionOfPaddle2 >= window.innerHeight - paddleHeight) { // set paddle2 position
        positionOfPaddle2 = window.innerHeight - paddleHeight
    }
    if (topPositionOfBall <= 150 || topPositionOfBall >= window.innerHeight - ballRadius) { // reverse the ball when it hits the top or bottom** - ballRadius
        topSpeedOfBall = -topSpeedOfBall;
        wallS.play();
    }
    if (leftPositionOfBall <= paddleWidth) { // reverse direction of ball when it hits paddle1, else new game
        if (topPositionOfBall > positionOfPaddle1 && topPositionOfBall < positionOfPaddle1 + paddleHeight) {
            leftSpeedOfBall = -leftSpeedOfBall;
            paddleS.play();
        } else {
            score2++;
            missS.play();
            setBall();
            checkRound();
            }
    }
    if (leftPositionOfBall >= window.innerWidth - ballRadius - paddleWidth) { // reverse direction of ball when it hits paddle2, else new game
        if (topPositionOfBall > positionOfPaddle2 && topPositionOfBall < positionOfPaddle2 + paddleHeight) {
            leftSpeedOfBall = -leftSpeedOfBall;
            paddleS.play();
        } else {
            score1++;
            missS.play();
            setBall();
            checkRound();
            }
    }   

    document.getElementById('score1').innerHTML = score1.toString();
    document.getElementById('score2').innerHTML = score2.toString();
}, 1000/60);

document.addEventListener('keyup', function (e) {
    if (e.keyCode === 87 || e.which === 87) {
        speedOfPaddle1 = 0;
    }
    if (e.keyCode === 83 || e.which === 83) {
        speedOfPaddle1 = 0;
    }
    if (e.keyCode === 38 || e.which === 38) {
        speedOfPaddle2 = 0;
    }
    if (e.keycode === 40 || e.which === 40) {
        speedOfPaddle2 = 0;
    }
}, false)

function blink(selector){
$(selector).fadeOut('slow', function(){
    $(this).fadeIn('slow', function(){
        blink(this);
    });
});
}