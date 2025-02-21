var canvas = document.getElementById("grid");
var ctx = canvas.getContext("2d");

var skipAmount = 5;
document.querySelector('#detailRange').addEventListener('input', (e) => {
    skipAmount = 41 - e.target.value;
});

resize();
window.onresize = resize;

var lineBlur = 20;
var blurDir = 1;

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

function draw(){
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    lineBlur += blurDir;

    if(lineBlur <= 0) blurDir = 1;
    else if(lineBlur > 50) blurDir = -1;

    ctx.shadowBlur = lineBlur;
    ctx.lineWidth = 5;
    ctx.shadowColor = "white";
    ctx.strokeStyle = "#00FF00";

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
        if(!musicPlaying) line(0, topPos, canvas.width, topPos);
        else horizontalLine(0, topPos);

        // bottom lines 
        let botPos = canvas.height - i * gap + gap;
        botPos -= moveLine;
        if(!musicPlaying) line(0, botPos, canvas.width, botPos);
        else horizontalLine(0, botPos);
    }

    // center line to make shit look cool
    line(0, canvas.height / 2, canvas.width, canvas.height / 2);

    moveLine++;
    if(moveLine > canvas.height / (numLines - 1)) moveLine = 0;

    // if (musicPlaying) drawMusic();

    requestAnimationFrame(draw);
}

function line(x, y, x1, y1){
    ctx.beginPath();
    ctx.moveTo(x, y);
    ctx.lineTo(x1, y1);
    ctx.stroke();
}

function horizontalLine(mx, my){
    analyser.getByteTimeDomainData(data);

    ctx.lineWidth = 3;
    ctx.strokeStyle = '#0F0';

    ctx.beginPath();

    var sliceWidth = canvas.width * 1.0 / (bufferLength / skipAmount);
    var x = mx;
    var scale = Math.abs((canvas.height / 2) - my) / (canvas.height / 2);
    const HEIGHT = 200 * scale;

    for(var i = 0; i < bufferLength; i += skipAmount) {
        var v = (data[i] / 128.0);
        var y = (v * HEIGHT) + (my - HEIGHT);

        if(i === 0) {
            ctx.moveTo(x, y);
        } else {
            ctx.lineTo(x, y);
        }

        x += sliceWidth;
    }

    ctx.lineTo(canvas.width, my);
    ctx.stroke();
    ctx.lineWidth = 1;
}

function resize(){
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}
