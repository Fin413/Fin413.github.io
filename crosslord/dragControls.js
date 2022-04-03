var startingCoord;
var mouseOver = false;
const crossword = document.getElementById("crossword");

crossword.onwheel = e => {
    if(mouseOver){
        // e.preventDefault();
        // e.stopPropagation();
    
        if(e.deltaY > 0){
            resize(5);
        }else{
            resize(-5);
        }

        return false;
    }else{
        return true;
    }
}

crossword.onmousedown = e => {
    startingCoord = [e.clientX, e.clientY];
}

window.onmouseup = () => {
    startingCoord = undefined;
}

crossword.onmousemove = e => {
    if(startingCoord != undefined){
        moveCrossword(e.clientX, e.clientY, startingCoord[0] - e.clientX, startingCoord[1] - e.clientY);
    }
}

crossword.onmouseover = () => {
    mouseOver = true;
}

crossword.onmouseout = () => {
    mouseOver = false;
}

function moveCrossword(mouseX, mouseY, x, y){
    
    let xNum = parseInt(getComputedStyle(crossword).left.replace("px", ""));
    let yNum = parseInt(getComputedStyle(crossword).top.replace("px", ""));
    console.log(xNum, yNum)
    crossword.style.left =  xNum - x + "px";
    crossword.style.top = yNum - y + "px";

    startingCoord = [mouseX, mouseY];
}