var startingCoord;
const crossword = document.getElementById("crossword");
var crosswordDimensions = crossword.getBoundingClientRect();
var scale = 1;

var xPos = ((document.getElementById("crosswordContainer").offsetWidth / 2) / scale) - (document.getElementById("crossword").offsetWidth / 2);
var yPos =((document.getElementById("crosswordContainer").offsetHeight / 2) / scale) - (document.getElementById("crossword").offsetHeight / 2);
crossword.style.transform = "scale(" + scale + ") " + "translate(" + xPos + "px," + yPos + "px)";

crossword.onwheel = e => {
    e.preventDefault();

    if(e.deltaY > 0){
        resize(-5, e);
    }else{
        resize(5, e);
    }

    return false;
}

crossword.onpointerdown = e => {
    startingCoord = [e.clientX, e.clientY];
}

window.onpointerup = () => {
    startingCoord = undefined;
}

crossword.onpointermove = e => {
    if(startingCoord != undefined){
        moveCrossword(e.clientX, e.clientY, startingCoord[0] - e.clientX, startingCoord[1] - e.clientY);
    }
}

function moveCrossword(mouseX, mouseY, x, y){
    let containerWidth = document.getElementById("crosswordContainer").offsetWidth;
    let containerHeight = document.getElementById("crosswordContainer").offsetHeight;

    let rightWall = ((crossword.offsetWidth) - (((Math.abs(xPos) + (containerWidth / scale)))));
    let bottomWall = ((crossword.offsetHeight) - (((Math.abs(yPos) + (containerHeight / scale)))));
    
    if((xPos < 0 && x < 0) || (rightWall > 0 && x > 0)){
        xPos -= x * 1 / scale;        
    }
    if((yPos < 0 && y < 0) ||  (bottomWall > 0 && y > 0)){
        yPos -= y * 1 / scale;
    }

    // let originX = ((document.getElementById("crosswordContainer").offsetWidth / 2) / scale) - (document.getElementById("crossword").offsetWidth / 2);
    // const currentCenterX = Math.abs(originX) + (xPos);
    // console.log("origin", originX)
    // console.log("dist form origin", currentCenterX);
    let originX = ((document.getElementById("crosswordContainer").offsetWidth / 2) / scale) - (document.getElementById("crossword").offsetWidth / 2);
    let originY =((document.getElementById("crosswordContainer").offsetHeight / 2) / scale) - (document.getElementById("crossword").offsetHeight / 2);
    const xDistFromCenter = Math.abs(originX * scale) + (xPos);
    const yDistFromCenter = Math.abs(originY * scale) + (yPos)
    // console.log(xDistFromCenter - (crossword.offsetWidth / 2) + (document.getElementById("crosswordContainer").offsetWidth / 2), yDistFromCenter);

    crossword.style.transform = "scale(" + scale + ") " + "translate(" + xPos + "px," + yPos + "px)";
    startingCoord = [mouseX, mouseY];
}

function setX(x){
    xPos = x;
    const xDistFromCenter = Math.abs(originX * scale) + (xPos);
    const pos = (xDistFromCenter - (crossword.offsetWidth / 2) + (document.getElementById("crosswordContainer").offsetWidth / 2));
    xPos = pos;
    crossword.style.transform = "scale(" + scale + ") " + "translate(" + xPos + "px," + yPos + "px)";
}
