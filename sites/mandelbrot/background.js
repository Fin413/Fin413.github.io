const backgroundCanvas = document.getElementById("backgroundCanvas");
const backgroundCtx = backgroundCanvas.getContext('2d');

function drawBackground() {
    const backgroundWorker = new Worker('worker.js');

    if (window.innerWidth > window.innerHeight) {
        backgroundCanvas.width = window.innerWidth;
        backgroundCanvas.height = window.innerWidth;
    } else {
        backgroundCanvas.width = window.innerHeight;
        backgroundCanvas.height = window.innerHeight;
    }

    const imageData = backgroundCtx.createImageData(backgroundCanvas.width, backgroundCanvas.height);

    backgroundWorker.onmessage = function (event) {
        backgroundCtx.putImageData(event.data.imageData, 0, 0);
        backgroundWorker.terminate();
    };

    let x_bounds = { start: -1.0154214797920316, end: -1.0057500732351146 }
    let y_bounds = { start: -0.32603604781745554, end: -0.31636464126053854 }

    let workerIndex = 0;


    backgroundWorker.postMessage({
        imageData,
        max_iterations: 100,
        x_bounds,
        y_bounds,
        width: backgroundCanvas.width,
        height: backgroundCanvas.height,
        workerIndex,
        theme,
    });
}
