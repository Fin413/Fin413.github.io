const bgrndCanvas = document.getElementById("backgroundCanvas");
const bgrngCtx = bgrndCanvas.getContext("2d");

var canvasPositions = [0, 0, 0, 0];
var leftBound;
var bottomBound = window.innerHeight;

var loopBackground = false;

function setBackgroundValues(){
    getScroll();
    
    let offset = 4;
    let rect = document.getElementById("oscillascopeContainer").getBoundingClientRect();
    canvasPositions[0] = {x: rect.left + offset, y: rect.top + offset + scrollY};
    canvasPositions[1] = {x: rect.right - offset, y: rect.top + offset + scrollY};
    canvasPositions[2] = {x: rect.right - offset, y: rect.bottom - offset + scrollY};
    canvasPositions[3] = {x: rect.left + offset, y: rect.bottom - offset + scrollY};


    if(window.innerWidth > 680){
        leftBound = optionsContainer.getBoundingClientRect().left;
        bottomBound = window.innerHeight;
    } else {
        bottomBound = window.document.body.scrollHeight - optionsContainer.getBoundingClientRect().height;
        leftBound = window.innerWidth;
    }

    console.log(scrollY)
   
}

function drawBgrnd(){
    setBackgroundValues();

    bgrngCtx.clearRect(0, 0, bgrndCanvas.width, bgrndCanvas.height);

    bgrngCtx.strokeStyle = "#00FF00"; 
    bgrngCtx.lineWidth = 2; 
    bgrngCtx.shadowBlur = 5;
    bgrngCtx.shadowColor = "#FFFFFF";

    // corner lines

    bgrngCtx.beginPath();
    bgrngCtx.moveTo(0, 0);
    bgrngCtx.lineTo(canvasPositions[0].x, canvasPositions[0].y);
    bgrngCtx.stroke();

    bgrngCtx.beginPath();
    bgrngCtx.moveTo(leftBound, 0);
    bgrngCtx.lineTo(canvasPositions[1].x, canvasPositions[1].y);
    bgrngCtx.stroke();

    bgrngCtx.beginPath();
    bgrngCtx.moveTo(leftBound, bottomBound);
    bgrngCtx.lineTo(canvasPositions[2].x, canvasPositions[2].y);
    bgrngCtx.stroke();

    bgrngCtx.beginPath();
    bgrngCtx.moveTo(0, bottomBound);
    bgrngCtx.lineTo(canvasPositions[3].x, canvasPositions[3].y);
    bgrngCtx.stroke();

    // vertical lines
    let numLines = 10;
    let interval = leftBound / numLines;
    for(let i = interval; i < leftBound - interval + 5; i += interval){
        let percentage = i / leftBound + 0.5;
       
        let amount = canvasPositions[3].x * 2;
        let offset = amount - (percentage * amount);

        bgrngCtx.beginPath();
        bgrngCtx.moveTo(i, bottomBound);
        bgrngCtx.lineTo(i + offset, canvasPositions[2].y);
        bgrngCtx.stroke();

        bgrngCtx.beginPath();
        bgrngCtx.moveTo(i, 0);
        bgrngCtx.lineTo(i + offset, canvasPositions[0].y);
        bgrngCtx.stroke();
    }

    // side horizontal lines
    numLines = 10;
    interval = bottomBound / numLines;
    for(let i = interval; i < bottomBound - interval + 5; i += interval){
        let percentage = i / bottomBound + 0.5;
       
        let amount = canvasPositions[0].y * 2;
        let offset = amount - (percentage * amount);

        bgrngCtx.beginPath();
        bgrngCtx.moveTo(0, i);
        bgrngCtx.lineTo(canvasPositions[0].x, i + offset);
        bgrngCtx.stroke();

        bgrngCtx.beginPath();
        bgrngCtx.moveTo(leftBound, i);
        bgrngCtx.lineTo(canvasPositions[1].x, i + offset);
        bgrngCtx.stroke();
    }

    numLines = 2;
    interval = (bottomBound - canvasPositions[3].y) / (numLines + 1);
    for(let i = interval; i <= interval * numLines; i += interval){
        let angle = Math.atan(canvasPositions[3].x / (bottomBound - canvasPositions[3].y));
        let xStart = (bottomBound - (i + canvasPositions[3].y)) * Math.tan(angle);
        let xEnd = leftBound - xStart;

        bgrngCtx.beginPath();
        bgrngCtx.moveTo(xStart, i + canvasPositions[3].y);
        bgrngCtx.lineTo(xEnd, i + canvasPositions[3].y);
        bgrngCtx.stroke();

        let topDisp = ((interval - i)/interval) // this shit is fucky but idk what else to do
        if (topDisp == 0) topDisp = 1

        bgrngCtx.beginPath();
        bgrngCtx.moveTo(xStart, i + interval * topDisp);
        bgrngCtx.lineTo(xEnd, i + interval * topDisp);
        bgrngCtx.stroke();

        bgrngCtx.beginPath();
        bgrngCtx.moveTo(xStart, i + canvasPositions[3].y);
        bgrngCtx.lineTo(xStart, i + interval * topDisp);
        bgrngCtx.stroke();

        bgrngCtx.beginPath();
        bgrngCtx.moveTo(xEnd, i + canvasPositions[3].y);
        bgrngCtx.lineTo(xEnd, i + interval * topDisp);
        bgrngCtx.stroke();
    }

    if (loopBackground) requestAnimationFrame(drawBgrnd);
}

function random(min, max) {
    return Math.floor(Math.random() * (max - min) ) + min;
}