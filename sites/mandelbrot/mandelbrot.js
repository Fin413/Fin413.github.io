const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');

var PIXEL_SIZE = 1;
var ZOOM_AMOUNT = 0.8;
var MAX_ITERATIONS = 100;

var theme = "Red";
var allThemes = [
    "Red",
    "Lightning",
    "Radioactive",
    "Thermal",
    "Lemonade",
]

var initialDimensions = {
    width: 4,
    height: 4,
}

// canvas scaling and positioning
var x_bounds = { start: -2.5, end: 1.5 };
var y_bounds = { start: -2, end: 2 };
var origin = { x: -0.5, y: 0 };
var dimensions = {
    width: 4,
    height: 4,
}

var mouseInfo = {
    x: 0,
    y: 0,
    down: false,
}

var workerIndex = 0;

var mandelbrotWorker = new Worker('worker.js');

window.addEventListener('resize', resize);
document.addEventListener('DOMContentLoaded', init);

function resize() {
    const margin = 20;

    if (window.innerWidth > window.innerHeight) {
        canvas.width = window.innerHeight - margin;
        canvas.height = window.innerHeight - margin;
    } else {
        canvas.width = window.innerWidth - margin;
        canvas.height = window.innerWidth - margin;
    }
    drawBackground();
    drawMandelbrot();
}

function map(val, max, start, end) {
    return start + (val / max) * (end - start);
}

function init() {
    // drawBackground();

    let themeIdx = Math.floor(Math.random() * (allThemes.length));
    theme = allThemes[themeIdx];
    document.getElementById("themeSelector").value = theme;

    resize();

    mandelbrotWorker.onmessage = function (event) {
        const data = event.data;
        ctx.putImageData(data.imageData, 0, 0);
        if (data.workerIndex == workerIndex) {
            isLoading = false;
            document.getElementById("loadingText").style.visibility = "hidden";
        }
    };

    canvas.addEventListener('click', (e) => {
        mouseInfo.x = e.offsetX;
        mouseInfo.y = e.offsetY;

        origin = {
            x: map(mouseInfo.x, canvas.width, x_bounds.start, x_bounds.end),
            y: map(mouseInfo.y, canvas.height, y_bounds.start, y_bounds.end),
        }

        updateBounds();
        drawMandelbrot();
    });

    document.getElementById("zoomin").addEventListener("click", () => updateZoom(ZOOM_AMOUNT));
    document.getElementById("zoomout").addEventListener("click", () => updateZoom(1 + (1 - ZOOM_AMOUNT)));

    document.getElementById('upres').addEventListener("click", () => updateResolution(25));
    document.getElementById('downres').addEventListener("click", () => updateResolution(-25));

    document.getElementById('themeSelector').addEventListener('input', (e) => {
        theme = e.target.value;
        drawMandelbrot();
        drawBackground();
    })

    document.getElementById('infoBtn').addEventListener('click', toggleInfo);

    drawMandelbrot();
}

function drawMandelbrot() {
    document.getElementById("loadingText").style.visibility = "visible";


    const imageData = ctx.createImageData(canvas.width, canvas.height);
    workerIndex++;

    mandelbrotWorker.postMessage({
        imageData,
        max_iterations: MAX_ITERATIONS,
        x_bounds,
        y_bounds,
        width: canvas.width,
        height: canvas.height,
        workerIndex,
        theme,
    });

}

function getColor(iterations) {
    let color;
    let red = (iterations / MAX_ITERATIONS) * 255;

    if (iterations == MAX_ITERATIONS) {
        color = 'black';
    } else {
        color = `RGB(${red}, 0, 0)`;
    }

    return color;
}

function updateBounds() {
    x_bounds = {
        start: origin.x - (dimensions.width / 2),
        end: origin.x + (dimensions.width / 2),
    }

    y_bounds = {
        start: origin.y - (dimensions.height / 2),
        end: origin.y + (dimensions.height / 2),
    }
}

function updateResolution(amount) {
    if (amount > 0 || MAX_ITERATIONS != 0) {
        MAX_ITERATIONS += amount;
        document.getElementById("resDisplay").innerText = MAX_ITERATIONS;
        drawMandelbrot();
    }
}

function updateZoom(amount) {
    dimensions.width *= amount;
    dimensions.height *= amount;

    let zoomAmount = Math.round((initialDimensions.width / dimensions.width) * 10) / 10;
    document.getElementById('zoomDisplay').innerText = zoomAmount + "x";

    updateBounds();
    drawMandelbrot();
}


var infoVisible = false;
function toggleInfo() {
    let content = document.getElementsByClassName('infoContent')[0];

    if (infoVisible) {
        infoVisible = false;
        content.style.clipPath = 'polygon(0 0, 100% 0, 100% 0, 0 0)';
        content.style.height = 0;
    } else {
        infoVisible = true;
        content.style.clipPath = 'polygon(0 0, 100% 0, 100% 100%, 0% 100%)';
        content.style.height = "305px";

    }
}