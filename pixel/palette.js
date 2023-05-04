const paletteOptionsEl = document.querySelector("#paletteOptions");
const selectPaletteBtn = document.getElementById("selectedPalette");
const dropdownIcon = document.getElementById("dropdownIcon");
const palettes = [
    [
        [13,43,69],
        [31,60,86],
        [84,78,104],
        [140,105,122],
        [208,129,89],
        [255,170,94],
        [255,212,163],
        [254,236,214]
    ],
    [
        [140,173,40],
        [109,148,33],
        [66,107,41],
        [33,66,49]
    ],
    [
        [38, 1, 63],
        [66, 67, 110],
        [180, 148, 183],
        [230, 230, 192]
    ],
    [
        [48, 1, 48],
        [96, 40, 120],
        [248, 144, 32],
        [248, 240, 136]
    ],
    [
        [166,146,176],
        [24,20,28]
    ]
]

var paletteOn = true;
var dropDownEnabled = false;
var selectedPalette = palettes[0];

var selectedPaletteEl = addPaletteElement(palettes.indexOf(selectedPalette), selectedPalette);
selectPaletteBtn.insertAdjacentHTML('afterbegin', selectedPaletteEl.outerHTML);

palettes.forEach((tempPal, i) => {
    let temp = addPaletteElement(i, tempPal, paletteOptionsEl);
    paletteOptionsEl.appendChild(temp);
})

function addPaletteElement(index, colors){
    let paletteEl = document.createElement("button");
    paletteEl.classList = "palette";
    paletteEl.onclick = () => {
        changePalette(index, paletteEl);
    }

    colors.forEach((tempColor) => {
        let colorEl = document.createElement("div");
        colorEl.classList = "paletteColor";
        colorEl.style.backgroundColor = `rgb(${tempColor[0]},${tempColor[1]},${tempColor[2]})`
        // colorEl.style.opacity = 1;
        paletteEl.appendChild(colorEl);
    })
    
    return paletteEl;
}

function changePalette(index, el){
    document.getElementsByClassName("palette")[0].remove();

    selectedPalette = palettes[index];
    selectedPaletteEl = el.cloneNode(true);
    selectPaletteBtn.insertAdjacentHTML('afterbegin', selectedPaletteEl.outerHTML);
}

function togglePaletteDropdown(){

    if(!dropDownEnabled){
        paletteOptionsEl.style.visibility = "visible";
        paletteOptionsEl.style.opacity = 1;
        console.log(window.innerWidth)
        if(window.innerWidth < 635){
            paletteOptionsEl.style.top = "45px";
        }else{
            paletteOptionsEl.style.top = "35px";
        }
        dropdownIcon.style.transform = "rotate(180deg)";
    }else{
        paletteOptionsEl.style.visibility = "hidden";
        paletteOptionsEl.style.opacity = 0;
        paletteOptionsEl.style.top = 0;
        dropdownIcon.style.transform = "rotate(0deg)";
    }

    dropDownEnabled = !dropDownEnabled;

}

selectPaletteBtn.addEventListener("click", togglePaletteDropdown);

document.addEventListener("mouseup", (e) => {
    if(e.target != selectPaletteBtn && e.target != paletteOptionsEl && dropDownEnabled){
        togglePaletteDropdown();
    }
})

document.getElementById("paletteCheckbox").addEventListener("change", (e) => {
    paletteOn = !paletteOn;
})
