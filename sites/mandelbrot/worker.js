self.onmessage = function (event) {
    const params = event.data;

    const height = params.height;
    const width = params.width;

    // turn any odd aspect ratio images into 1:1 and don't calculate out of bounds points
    var x_loop;
    var y_loop;
    if (height > width) {
        x_loop = {
            start: (height - width) / 2,
            end: ((height - width) / 2 + width),
        }
        y_loop = {
            start: 0,
            end: height,
        }
    } else {
        x_loop = {
            start: 0,
            end: width,
        }
        y_loop = {
            start: (width - height) / 2,
            end: ((width - height) / 2 + height),
        }
    }

    const MAX_ITERATIONS = params.max_iterations;
    const x_bounds = params.x_bounds;
    const y_bounds = params.y_bounds;

    const data = params.imageData.data;

    const xStep = (x_bounds.end - x_bounds.start) / width;
    const yStep = (y_bounds.end - y_bounds.start) / height;

    for (let i = x_loop.start; i < x_loop.end; i += 1) {
        let x0 = x_bounds.start + i * xStep;

        for (let j = y_loop.start; j < y_loop.end; j += 1) {
            let y0 = y_bounds.start + j * yStep;

            let x = x0;
            let y = y0;

            let iterations = 0;

            while (iterations < MAX_ITERATIONS) {
                var aa = x * x - y * y;
                var bb = 2 * x * y;

                x = aa + x0;
                y = bb + y0;

                if (x * x + y * y > 16) break;

                iterations++;
            }

            const idx = (j * width + i) * 4;
            if (iterations == MAX_ITERATIONS) {
                data[idx] = 0;
                data[idx + 1] = 0;
                data[idx + 2] = 0;
                data[idx + 3] = 255;
            } else {

                let color = getColor(params.theme, iterations, MAX_ITERATIONS);
                data[idx] = color[0];
                data[idx + 1] = color[1];
                data[idx + 2] = color[2];
                data[idx + 3] = color[3];
            }
        }
    }

    self.postMessage({ imageData: params.imageData, workerIndex: params.workerIndex });
};

function map(val, max, start, end) {
    return start + (val / max) * (end - start);
}

function getColor(theme, iterations, max) {
    let color = [0, 0, 0, 255];

    switch (theme) {
        case "Red":
            color[0] = (iterations / max) * 255;
            break;
        case "Lightning":
            color[0] = color[1] = color[2] = 255;
            color[3] = (iterations / max) * 255;
            break;
        case "Radioactive":
            color = lerpColor({ r: 0, g: 0, b: 255 }, { r: 0, g: 255, b: 0 }, iterations / max)
            break;
        case "Thermal":
            color = hslToRgb((iterations / max) * 255, 255, 255);
            color = [color[0], color[1], color[2], (iterations / max) * 255];
            break;
        case "Lemonade":
            color = hslToRgb((iterations / max) * 255, (iterations / max) * 255, (iterations / max) * 255);
            color = [color[0], color[1], color[2], 255];
            break;
    }

    return color;
}

function lerpColor(color1, color2, factor) {
    const r = Math.round(color1.r + (color2.r - color1.r) * factor);
    const g = Math.round(color1.g + (color2.g - color1.g) * factor);
    const b = Math.round(color1.b + (color2.b - color1.b) * factor);
    return [r, g, b, 255 * factor];
}

function hslToRgb(h, s, l) {
    s /= 100;
    l /= 100;

    const k = (n) => (n + h / 30) % 12;
    const a = s * Math.min(l, 1 - l);
    const f = (n) => l - a * Math.max(-1, Math.min(k(n) - 3, Math.min(9 - k(n), 1)));

    return [
        Math.round(255 * f(0)),
        Math.round(255 * f(8)),
        Math.round(255 * f(4)),
    ];
}
