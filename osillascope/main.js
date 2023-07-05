const relativeCanvasSize = 1.2;
const pixelCanvasSize = [3000, 3000]

const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");
const fullscreenBtn = document.getElementById("fullscreenBtn")
const overlayEl = document.getElementById("overlay");
const canvasContainer = document.getElementById("oscillascopeContainer");

var fullscreen = false;

resize();

window.addEventListener("resize", resize);
fullscreenBtn.addEventListener("click", toggleFullscreen)
// overlayEl.addEventListener("click", toggleFullscreen)

function toggleFullscreen(){
    if(fullscreen){
        overlayEl.style.display = "none";
        document.body.style.overflow = "unset";

        fullscreenBtn.innerText = "Enter fullscreen mode";  
        fullscreenBtn.style.transform = "translate(0, 100%)";
        canvasContainer.style.position = "relative";
        canvasContainer.style.borderRadius = "20px";
    }else{
        // overlayEl.style.display = "block";
        document.body.style.overflow = "hidden";  

        fullscreenBtn.innerText = "Exit fullscreen mode";
        fullscreenBtn.style.transform = "translate(100%, 0)";
        canvasContainer.style.position = "absolute";
        canvasContainer.style.left = "50%";
        canvasContainer.style.transform = "translateX(-50%)";
        canvasContainer.style.marginTop = 0;
        canvasContainer.style.borderRadius = 0;
        document.getElementById("optionsContainer").style.display = "none";
    }

    fullscreen = !fullscreen;
    resize();
}



function resize(){
    let width = window.innerWidth;
    let height = window.innerHeight;

    bgrndCanvas.width = width;
    bgrndCanvas.height = height;

    let tempCanvasSize;

    if(fullscreen) tempCanvasSize = 1;
    else tempCanvasSize = relativeCanvasSize;

    console.log(canvasContainer.offsetWidth, width)

    if(width < height ||  995 >= width){
        canvas.width = width / tempCanvasSize;
        canvas.height = canvas.width;
        canvasContainer.style.width = canvas.width + "px";
        canvasContainer.style.height = canvas.width / 1.25 + "px";
    }else{  
        canvas.height = height / tempCanvasSize;
        canvasContainer.style.height = canvas.height + "px";
        canvas.width = canvas.height;
        canvasContainer.style.width = canvas.height * 1.25 + "px";
    }

    ctx.scale(canvas.width / pixelCanvasSize[0], canvas.height / pixelCanvasSize[1]);
}


// var left = 0;
// setInterval(() => {
//     left -= 20;
//     if(left * -1 > songName.clientWidth) left = 250;
//     songName.style.left = left + "px";
// }, 250)