// COLOR SNOW

// z index for snow to go either in front or behind lamp
// gust blows built up snow away when too high


const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

const streetlamp = document.getElementById("lamp");
const unlitLamp = document.getElementById("unlit");
var flagImg;

const pixelSize = 3;
var gridWidth = Math.ceil(window.innerWidth / pixelSize);
var floor = Math.round(window.innerHeight / pixelSize);

var fallingSnow = [];
var landedSnow = Array.from({ length: 500 }, () => new Array(gridWidth).fill(0));

const lightAngle = 30 * (Math.PI / 180);
var lightOn = true;
var xLightBoundary;

var lightPos;
var lampDimensions;

var windDir = 0;
const maxWind = 1;
const windIncrement = 0.2;

var mouseDown = false;
var mousePos = {x: 0, y: 0};

function resize() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    gridWidth = Math.ceil(window.innerWidth / pixelSize);
    floor = Math.round(window.innerHeight / pixelSize);

    let imgRect = streetlamp.getBoundingClientRect();
    lampDimensions = {
        width: imgRect.width, 
        height: imgRect.height, 
        x: (window.innerWidth / 2) - (imgRect.width / 2),
        y: imgRect.y,
    };

    let yLightOffset = -(lampDimensions.y / 14);//-35; // light beam's offset from top of streetlamp image
    console.log(yLightOffset)
    let imgHeight = document.querySelector("img").getBoundingClientRect().height;
    lightPos = {x: window.innerWidth / 2, y: window.innerHeight - imgHeight + yLightOffset};
    xLightBoundary = Math.tan(lightAngle) * (imgHeight - yLightOffset);

    
    console.log(lampDimensions.height)
}

function loop() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    drawStreetLight();
    drawLandedFlakes();
    drawFallingFlakes();

    if(mouseDown) spawnFlake(mousePos.x, mousePos.y);

    requestAnimationFrame(loop);
}

function flickerLight() {
    lightOn = false;
    setTimeout(() => {
        lightOn = true;
    }, randFloat(10, 800));
}

function drawStreetLight() {
    // light cone
    if (lightOn){
        ctx.fillStyle = "#1d2338ff";
        let x1 = (window.innerWidth / 2) - xLightBoundary;
        let x2 = (window.innerWidth / 2) + xLightBoundary;
    
        ctx.save()
        ctx.shadowColor = "#1d2338ff";
        ctx.shadowOffsetX = 0;
        ctx.shadowOffsetY = 0;
        ctx.shadowBlur = 20;
    
        ctx.beginPath();
        // bottom verticies
        ctx.moveTo(x1, window.innerHeight);
        ctx.lineTo(x2, window.innerHeight);
        // flat top
        ctx.lineTo(window.innerWidth / 2 + 20, lightPos.y + 50);
        ctx.lineTo(window.innerWidth / 2 - 20, lightPos.y + 50);
        ctx.fill();
    
        ctx.restore();
    }

    // lamp
    let img = lightOn ? streetlamp : unlitLamp;
    ctx.drawImage(
        img, 
        lampDimensions.x, 
        window.innerHeight - lampDimensions.height, 
        lampDimensions.width, lampDimensions.height
    );

    // flag
    ctx.drawImage(
        flagImg, 
        lampDimensions.x, 
        window.innerHeight - lampDimensions.height, 
        lampDimensions.width, lampDimensions.height
    );
}

function drawFallingFlakes() {
    let graveyard = [];
    for(let i = 0; i < fallingSnow.length; ++i) {
        let flake = fallingSnow[i];

        let offscreenBuffer = 10;
        if(flake.x > window.innerWidth + offscreenBuffer || flake.x < -offscreenBuffer) {
            graveyard.push(i);
            continue;
        }

        let xPixelPos = Math.floor(flake.x / pixelSize);

        let frameOffset = 1; // the forward frame lookahead for smooth placement
        let yPixelPos = floor - Math.floor((flake.y + pixelSize * frameOffset) / pixelSize);

        flake.floatY += flake.speed;
        flake.y = Math.round(flake.floatY);
        flake.x += windDir * flake.weight;
        
        if (yPixelPos == 0 || hitCollisionObject(flake.x, flake.y)) {
            landedSnow[yPixelPos][xPixelPos] = 1;
            graveyard.push(i);
        } else if (yPixelPos < landedSnow.length && landedSnow[yPixelPos - 1][xPixelPos] == 1) {
            let isLanded = true;
            if(yPixelPos > 0) {

                // check diagonals
                let leftEmpty = false;
                let rightEmpty = false;

                if (xPixelPos > 0 && landedSnow[yPixelPos - 1][xPixelPos - 1] == 0) {
                    leftEmpty = true;
                }
                
                if (xPixelPos < gridWidth - 1 && landedSnow[yPixelPos - 1][xPixelPos + 1] == 0) {
                    rightEmpty = true;
                }

                // decide direction to fall
                let fallDir = "stay";
                if (leftEmpty && rightEmpty){
                    fallDir = randInt(0, 1) == 1 ? "right" : "left";
                } else if(leftEmpty) {
                    fallDir = "left";
                } else if(rightEmpty) {
                    fallDir = "right";
                }

                const notSettled = 
                    (xPixelPos > 1 && xPixelPos < gridWidth - 2 && yPixelPos > 1) 
                    && 
                    (
                        landedSnow[yPixelPos - 2][xPixelPos - 2] == 0 
                        || 
                        landedSnow[yPixelPos - 2][xPixelPos + 2] == 0
                    );

                // update
                if (fallDir == "left") {
                    if(notSettled) {
                        isLanded = false;
                        flake.x = (xPixelPos - 1) * pixelSize;
                    }
                    else landedSnow[yPixelPos - 1][xPixelPos - 1] = 1;
                } else if (fallDir == "right") {
                    if(notSettled) {
                        isLanded = false;
                        flake.x = (xPixelPos + 1) * pixelSize;
                    }
                    else landedSnow[yPixelPos - 1][xPixelPos + 1] = 1;
                } else { // stay                            
                    landedSnow[yPixelPos][xPixelPos] = 1;
                }
            } 

            if(isLanded) graveyard.push(i);
        }
        
        ctx.fillStyle = getColor(flake.x, flake.y);
        ctx.beginPath();
        ctx.rect(flake.x, flake.y, flake.size, flake.size);
        ctx.fill();
    };

    while(graveyard.length) fallingSnow.splice(graveyard.pop(), 1);
}

function hitCollisionObject(x, y) {
    // lamp
    let width = lampDimensions.width / 6;
    let lampX = x > lightPos.x - width && x < lightPos.x + width;
    let height = 2;
    let yPos = lampDimensions.y + (lampDimensions.height / 18);
    let lampY = y > yPos - height && y < yPos + height;
    if(lampX && lampY) return true;

    return false;
}

function drawLandedFlakes(){
    for(let i = 0; i < landedSnow.length; ++i){
        for(let j = 0; j < gridWidth; ++j){
            if(landedSnow[i][j] == 1) {
                let x = j * pixelSize;
                let y = (floor - i - 1) * pixelSize;

                ctx.fillStyle = getColor(x, y);

                ctx.beginPath();
                ctx.rect(x, y, pixelSize, pixelSize);
                ctx.fill();
            }
        }
    }
}

function getColor(x, y) {
    let dy = y - lightPos.y;

    let lampTopOffset = window.innerHeight / 15; 
    if (dy <= 0 || dy < lampTopOffset || !lightOn) return "#FFF"; // only shine down

    let dx = x - lightPos.x;
    let angle = Math.abs(Math.atan2(dx, dy));

    if(angle < lightAngle){        
        if (angle < 10 * Math.PI/180) {
            return "#FFF000";
        } else if(angle < 25 * Math.PI/180){
            return "#bbb01bff";
        }
        return "#958e29ff";
    };

    return "#FFF";
}

function spawnFlake(x, y){
    let tempFlake = {
        x: x,
        y: y,
        floatX: x,
        floatY: y,
        size: 3,
        speed: randFloat(0.75, 1.75),//randFloat(0.25, 0.75),
        weight: randFloat(0.5, 1),
    };
    fallingSnow.push(tempFlake);
}

// min and max inclusive for both
function randFloat(min, max) {
    return Math.random() * (max - min) + min;
}
function randInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function init() {
    resize();

    // spawn snow and change wind direction
    setInterval(() => {
        let x = randFloat(0, window.innerWidth);
        let y = -pixelSize;
        spawnFlake(x, y);

        // wind logic
        let inc = randFloat(-windIncrement, windIncrement);
        if(windDir >= maxWind) windDir -= Math.abs(inc);
        else if (windDir <= -maxWind) windDir += Math.abs(inc);
        else windDir += inc;
    }, randInt(400, 600));

    // flag animation
    let goal = 5;
    let currentFrame = 5;
    flagImg = document.getElementById("5");
    setInterval(() => {
        const numFrames = 12;
        const percentage = (windDir + maxWind) / (2 * maxWind);
        frameNum = Math.round(percentage * (numFrames - 1));
        goal = Math.max(0, Math.min(numFrames - 1, frameNum));
        
        // go frame by frame
        if (currentFrame != goal) {
            if(goal > currentFrame) currentFrame += 1;
            else currentFrame -= 1;
        }

        flagImg = document.getElementById(`${currentFrame}`);
    }, 250);

    setInterval(flickerLight, randFloat(3000, 8000));

    loop();
}

// listeners
window.addEventListener("load", init);
window.addEventListener("resize", resize);
window.addEventListener("pointerup", () => mouseDown = false);
window.addEventListener("pointerdown", (e) => {
    mousePos.x = e.offsetX;
    mousePos.y = e.offsetY;
    mouseDown = true;
});
window.addEventListener("pointermove", (e) => {
    if (mouseDown) {
        mousePos.x = e.offsetX;
        mousePos.y = e.offsetY;
    }
});
