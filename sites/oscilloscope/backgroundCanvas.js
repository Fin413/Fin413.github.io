const bgrndCanvas = document.getElementById("backgroundCanvas");
const bgrngCtx = bgrndCanvas.getContext("2d");

var mouse = {x: 0, y: 0}
bgrndCanvas.addEventListener("mousemove", getMousePos)

var tabbedIn = true;

document.addEventListener("visibilitychange", () => {
    if(document.visibilityState == "visible"){
        tabbedIn = true;
        spawnRandom();
    }else tabbedIn = false;
});

function getMousePos(e) {
    var rect = bgrndCanvas.getBoundingClientRect();    
    mouse = {
        x: (e.clientX - rect.left) / (rect.right - rect.left) * bgrndCanvas.width,
        y: (e.clientY - rect.top) / (rect.bottom - rect.top) * bgrndCanvas.height
    };
}

var shapeList = {
    squares: [],
    triangles: [],
    circles: []
}

function spawnSquare(){
    let temp = {
        x: random(0, window.innerWidth),
        y: -110,
        rotation: random(0, 180)
    }
    shapeList.squares.push(temp);
}

function spawnTriangle(){
    let temp = {
        x: random(0, window.innerWidth),
        y: -100,
        rotation: random(0, 180)
    }
    shapeList.triangles.push(temp);
}

function spawnCircle(){
    let temp = {
        x: random(0, window.innerWidth),
        y: -100,
    }
    shapeList.circles.push(temp);
}

drawBgrnd();
spawnRandom();
// spawnSquare( );

function spawnRandom(){
    let shape = random(0,3);
    switch(shape){
        case 0:
            spawnSquare();
            break;
        case 1:
            spawnTriangle();
            break;
        case 2: 
            spawnCircle();
            break;
    }
    if(tabbedIn) setTimeout(spawnRandom, random(750, 1000));
}


function drawBgrnd(){
    bgrngCtx.clearRect(0, 0, bgrndCanvas.width, bgrndCanvas.height);

    bgrngCtx.strokeStyle = "#00FF00"; 
    bgrngCtx.lineWidth = 2; 
    bgrngCtx.shadowBlur = 5;
    bgrngCtx.shadowColor = "#FFFFFF";
    
    shapeList.squares.forEach((square, i) => {
        let rotation = square.rotation * (Math.PI / 180);
        let center = [square.x + 50, square.y + 50]
        let changeColor = false

        if(Math.abs(mouse.x - square.x) < 100 && Math.abs(mouse.y - square.y) < 100){
            changeColor = true;
            bgrngCtx.strokeStyle = "#FF0000";
        }
    
        bgrngCtx.beginPath();
    
        bgrngCtx.translate(center[0], center[1])
        bgrngCtx.rotate(rotation);
        bgrngCtx.translate(-center[0], -center[1])
    
        bgrngCtx.rect(square.x, square.y, 100, 100);

        bgrngCtx.translate(center[0], center[1])
        bgrngCtx.rotate(-rotation);
        bgrngCtx.translate(-center[0], -center[1])
    
        bgrngCtx.stroke();

        if (square.y > window.innerHeight + 100) {
            shapeList.squares.splice(i, 1);
        } else {
            shapeList.squares[i].y += 1
            shapeList.squares[i].rotation += 1
        }

        if(changeColor) bgrngCtx.strokeStyle = "#00FF00"; 
    })

    shapeList.triangles.forEach((triangle, i) => {
        let rotation = triangle.rotation * (Math.PI / 180);
        let center = [triangle.x, triangle.y + 50]
    
        bgrngCtx.beginPath();
    
        bgrngCtx.translate(center[0], center[1])
        bgrngCtx.rotate(rotation);
        bgrngCtx.translate(-center[0], -center[1])
    
        bgrngCtx.beginPath();
        bgrngCtx.moveTo(triangle.x, triangle.y); 
        bgrngCtx.lineTo(triangle.x + 50, triangle.y + 86.6);
        bgrngCtx.lineTo(triangle.x - 50, triangle.y + 86.6);
        bgrngCtx.lineTo(triangle.x, triangle.y);
        bgrngCtx.stroke();

        bgrngCtx.translate(center[0], center[1])
        bgrngCtx.rotate(-rotation);
        bgrngCtx.translate(-center[0], -center[1])
    
        bgrngCtx.stroke();

        if (triangle.y > window.innerHeight + 100) {
            shapeList.triangles.splice(i, 1);
        } else {
            shapeList.triangles[i].y += 1
            shapeList.triangles[i].rotation += 1
        }
    })

    shapeList.circles.forEach((circle, i) => {    
        bgrngCtx.beginPath();
        bgrngCtx.arc(circle.x, circle.y, 50, 0, 2 * Math.PI);
        bgrngCtx.stroke();

        if (circle.y > window.innerHeight + 100) {
            shapeList.circles.splice(i, 1);
        } else {
            shapeList.circles[i].y += 1
        }
    })

    requestAnimationFrame(drawBgrnd);
}

function random(min, max) {
    return Math.floor(Math.random() * (max - min) ) + min;
}