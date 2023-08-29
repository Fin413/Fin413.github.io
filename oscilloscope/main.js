const relativeCanvasSize = 1.2;
const pixelCanvasSize = [3000, 3000]

const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");
const fullscreenBtn = document.getElementById("fullscreenBtn")
const overlayEl = document.getElementById("overlay");
const canvasContainer = document.getElementById("oscillascopeContainer");

var fullscreen = false;
var optionsContainer = document.getElementById("optionsContainer");


resize();

window.addEventListener("resize", resize);
fullscreenBtn.addEventListener("click", toggleFullscreen)

function toggleFullscreen(){
    if(fullscreen){
        bgrndCanvas.style.opacity = 1;
        canvasContainer.style.boxShadow = null;
        canvasContainer.style.borderRadius = null;
        optionsContainer.style.display = null;

        collapseBtn.innerHTML = '<img src="collapseSmall.png" alt="collapse icon">';
        collapseBtn.style.right = "344px";
        collapseBtn.style.borderRight = "none";
        setTimeout(() => {
            collapseBtn.style.transition = "right 1s, box-shadow 400ms";
        },100);
    }else{
        bgrndCanvas.style.opacity = 0;

        canvasContainer.style.boxShadow = "none";
        canvasContainer.style.borderRadius = 0;

        optionsContainer.style.display = "none";

        collapseBtn.innerText = "Exit Fullscreen";
        collapseBtn.style.transition = "box-shadow 400ms";
        collapseBtn.style.borderRight = "1px solid #00FF00";
        collapseBtn.style.right = "10px";
    }

    fullscreen = !fullscreen;
    resize();
}



function resize(){
    let width = window.innerWidth;
    let height = window.innerHeight;

    bgrndCanvas.width = width;
    bgrndCanvas.height = height - 1;

    let tempCanvasSize;
    let widthTrigger = 1200;

    if(fullscreen) tempCanvasSize = 1;
    else tempCanvasSize = relativeCanvasSize;   



    if (width > 680 && (!fullscreen || optionsOpen)){
        width = (width - optionsContainer.getBoundingClientRect().width)
        // widthTrigger = 1500;
    }

    
    if(width < height ||  widthTrigger >= width){
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

    if(!fullscreen) drawBgrnd();
}

const sliderEl = document.querySelector("input[type=range]")

sliderEl.addEventListener("input", (event) => {
    const tempSliderValue = event.target.value;
    const progress = (tempSliderValue / sliderEl.max) * 100;
    sliderEl.style.background = `linear-gradient(to right, #00FF00 ${progress}%, #FFF ${progress}%)`;
})

const collapseBtn = document.getElementsByClassName("collapseBtn")[0];
var optionsOpen = true;

collapseBtn.addEventListener("click", (event) => {
    if(fullscreen){
        toggleFullscreen();
        return;
    }

    if(optionsOpen){
        document.getElementById("optionsContainer").style.marginRight = "-" + optionsContainer.getBoundingClientRect().width + "px";
        collapseBtn.firstElementChild.style.transform = "rotate(180deg)";
        collapseBtn.style.right = "-10px";
    } else {
        document.getElementById("optionsContainer").style.marginRight = 0;
        collapseBtn.firstElementChild.style.transform = "rotate(0deg)";
        collapseBtn.style.right = "344px";
    }

    loopBackground = true;
    drawBgrnd();
    setTimeout(() => {
        loopBackground = false;
    }, 1000);

    optionsOpen = !optionsOpen;
})