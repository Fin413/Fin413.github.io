var canvas = document.getElementById("grid");
var ctx = canvas.getContext("2d");

resize();
window.onresize = resize;

const numLines = 11;

// number of extra lines to add to the left and right 
const extraLines = 2;

// controls how close to the center the lines converge
const groupOffset = 15;

// space between horizontal lines
const horizontalSpace = 30;

// const space between top and bottom grids
const spaceBetween = 0;

var moveLine = 0;


function init(){
    setTimeout(() => {
        draw();
        let overlay = document.getElementById("overlayContainer");
        overlay.style.clipPath = "polygon(0 0, 100% 0, 100% 0%, 0 0%, 0 100%, 100% 100%, 100% 100%, 0 100%)";
        setTimeout(() => {
            overlay.style.display = "none";
        }, 1500);
    }, 750);
}

function draw(){
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // vertical lines
    for(let i = 0; i < numLines + (extraLines * 2); i ++){
        let pos = i * (canvas.width / (numLines - 1))
        // subtract offset for extra lines
        pos -= (extraLines * canvas.width / (numLines - 1));
        // honestly very little clue how this works i jus changed shit til it did at liek 3am
        let math = ((((numLines + (extraLines * 2)) / 2) - i) - 0.5) * (canvas.width / groupOffset);

        // top lines
        line(pos, 0, (canvas.width / 2) - math, canvas.height / 2 - spaceBetween);

        // bottom lines
        line(pos, canvas.height, (canvas.width / 2) - math, canvas.height / 2 + spaceBetween);
    }

    // horizontal lines
    for(let i = 0; i < numLines / 2; i ++){
        let gap = (canvas.height / (numLines - 1));

        // top lines
        let topPos = i * gap - gap;
        topPos += moveLine;
        line(0, topPos, canvas.width, topPos);

        // bottom lines 
        let botPos = canvas.height - i * gap + gap;
        botPos -= moveLine;
        line(0, botPos, canvas.width, botPos);
    }

    // center line to make shit look cool
    line(0, canvas.height / 2, canvas.width, canvas.height / 2);

    moveLine++;
    if(moveLine > canvas.height / (numLines - 1)) moveLine = 0;

    if(isSongPlaying) drawMusic();

    requestAnimationFrame(draw);
}

function line(x, y, x1, y1){
    ctx.beginPath();
    ctx.shadowBlur = 5;
    ctx.shadowColor = "pink";
    ctx.strokeStyle = "white";
    ctx.moveTo(x, y);
    ctx.lineTo(x1, y1);
    ctx.stroke();
}

function resize(){
    canvas.width = document.body.clientWidth;
    canvas.height = document.body.clientHeight;
}
