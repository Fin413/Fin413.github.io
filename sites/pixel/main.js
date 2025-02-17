const input = document.querySelector("#imgInput");
const usrImg = document.querySelector("#userImg");
const pixelInput = document.querySelector("#pixelSize");
const pixelSlider = document.getElementById("pixelSizeSlider");
var downloadBtn = document.getElementById("downloadBtn");

var image;
var generatedImage;
var htmlImage;

document.body.onload = () =>{
    document.querySelector(".settingsContainer").style.opacity = 1;
    setTimeout(() => {
        document.getElementById("title").style.marginBottom = "50px";
    }, 500);
}

input.addEventListener("change", () => {
    const file = input.files
    image = file[0]
    var binaryData = [];
    binaryData.push(image);

    let src = URL.createObjectURL(new Blob(binaryData, {type: "application/zip"}));
    usrImg.innerHTML = `<img src="${src}" alt="image" class="previewImage" id="inputImage">`;

    let tempImg = document.createElement("img");
    tempImg.src = src;
    htmlImage = tempImg;

    usrImg.style.display = "block";
})

document.getElementById("pixelBtn").addEventListener("click", () => {
    let tempNumPixels = pixelSlider.value;

    if(image != undefined){
        pixelize(tempNumPixels);
    }
})

pixelSlider.addEventListener("input", (e) => {
    let value = pixelSlider.value;
    document.getElementById("pixelSize").innerText = value;
})


function pixelize(pixelSize){
    pixelSize = parseInt(pixelSize);

    var pixels = getPixels();
    var width = pixels.width;
    var relativeWidth = width;
    var pixelArea = Math.pow(pixelSize, 2);

    for(let i = 0; i < pixels.data.length; i += 4 * pixelSize){
        let red = green = blue = alpha = 0;
        let overflowPixels = 0;
        
        // loop runs once the last pixel in a row is reached
        if((i / 4) + pixelSize > relativeWidth){
            // run through that pixel step by step to ensure that if the image width isnt a 
            // multiple of the pixel size it will cut off the parts of the end pixel that dont fit

            for(let j = i; j < i + (pixelSize * 4); j += 4){
                if(j / 4 >= relativeWidth){
                    // if the pixel column doesn't fit increment overflowPixels
                    overflowPixels++;
                    continue;
                }
            }
        }

        // sum together color values per pixel to find average
        for(let j = i; j < (pixelSize * 4) + i; j += 4){
            if(((j - i) / 4) + 1 > pixelSize - overflowPixels) break;

            for(let k = j; k < pixelSize * 4 * width + j; k += 4 * width){
                red += pixels.data[k];
                green += pixels.data[k + 1];
                blue += pixels.data[k + 2];
                alpha += pixels.data[k + 3];
            }
        }
   
        // set new pixels color to average of colors within that pixel
        for(let j = i; j < (pixelSize * 4) + i; j += 4){ 
            if(((j - i) / 4) + 1 > pixelSize - overflowPixels) break;

            for(let k = j; k < pixelSize * 4 * width + j; k += 4 * width){
                let adjustedArea = pixelArea - (overflowPixels * pixelSize)

                if(paletteOn){
                    let color = matchPalette(red, green, blue, adjustedArea);
                    pixels.data[k] = color[0];
                    pixels.data[k + 1] = color[1];
                    pixels.data[k + 2] = color[2];
                }else{
                    pixels.data[k] = red / adjustedArea;
                    pixels.data[k + 1] = green / adjustedArea;
                    pixels.data[k + 2] = blue / adjustedArea;
                }

                pixels.data[k + 3] = alpha / adjustedArea;
            }
        }

        if((i / 4) + pixelSize > relativeWidth){
            i += ((pixelSize - 1) * 4 * width) - (overflowPixels * 4);
            relativeWidth += width * pixelSize;
        }

    }


    generateImage(pixels);
    
}

function matchPalette(red, green, blue, pixelArea){
    let smallestSum = null;
    let closest = selectedPalette[0];

    selectedPalette.forEach((color) => {
        let tempSum = Math.abs(color[0] - (red / pixelArea));
        tempSum += Math.abs(color[1] - (green / pixelArea));
        tempSum += Math.abs(color[2] - (blue / pixelArea));

        if(smallestSum == null){
            smallestSum = tempSum
        }else if(tempSum < smallestSum){
            smallestSum = tempSum;
            closest = color;
        }
    })

    return closest;
}

function getPixels(){
    // returns image data in srgb format
    let canvas = document.createElement("canvas");
    canvas.width = htmlImage.width;
    canvas.height = htmlImage.height;

    let ctx = canvas.getContext("2d");
    ctx.drawImage(htmlImage, 0, 0);

    var imageData = ctx.getImageData(0, 0, htmlImage.width, htmlImage.height);

    return imageData;
}

function generateImage(temp){
    let canvas = document.createElement("canvas");
    console.log(temp.width)

    canvas.width = temp.width;
    canvas.height = temp.height;
    
    let ctx = canvas.getContext("2d");
    ctx.putImageData(temp, 0, 0);
    ctx.scale(0.1, 0.1);
    
    usrImg.innerHTML = "";
    usrImg.append(canvas);
    usrImg.insertAdjacentHTML("beforeEnd", '<button class="defaultBtn" id="downloadBtn"><p>Download</p></button>');

    downloadBtn = document.getElementById("downloadBtn");
    downloadBtn.style.display = "block";
    downloadBtn.addEventListener("click", downloadImg);

    generatedImage = canvas;
}


function downloadImg () {
    var link = document.createElement('a');
    var imageName = image.name.substring(0, image.name.indexOf("."));
    link.download = "PIXEL_" + imageName + '.png';
    link.href = generatedImage.toDataURL();
    link.click();
}

