let isMobile = typeof window.orientation !== "undefined" || window.matchMedia("only screen and (max-width: 400px)").matches || /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
if(isMobile) document.getElementById("noMobile").remove();

for (var i = 0; i < 9; i++) {
    var div = document.createElement("div");
    div.className = "txtRow";
    document.getElementById("txtGrid").appendChild(div);

    for (var j = 0; j < 9; j++) {
        var txtInput = document.createElement("input");
        txtInput.type = "text";
        txtInput.pattern = "[0-9]*";
        txtInput.inputMode = "numeric";
        txtInput.className = "row" + (i + 1) + " " + "column" + (j + 1);
        if((i == 2 || i == 5) && (j == 2 || j == 5)){
            txtInput.classList.add("spaceBottom");
            txtInput.style.marginRight = "10px";
        }if (j == 2 || j == 5) {
            txtInput.classList.add("spaceRight");
        }else if (i == 2 || i == 5) {
            txtInput.classList.add("spaceBottom");
        } else {
            txtInput.classList.add("normal");
        }
        
        document.getElementsByClassName("txtRow")[i].appendChild(txtInput);
    }
}

var line = document.getElementById("line");
var mask = document.getElementById("titleMask");


let vh = window.innerHeight * 0.01;
document.documentElement.style.setProperty('--vh', `${vh}px`);

function setMaskHeight() {
    let vh = window.innerHeight * 0.01;
    document.documentElement.style.setProperty('--vh', `${vh}px`);
    if(mask.style.display != "none"){
        mask.style.height = (line.offsetTop + line.offsetHeight)+"px";
    }
}

window.onresize = setMaskHeight;

const txtBoxes = document.querySelectorAll('input.spaceRight, input.spaceBottom, input.normal');

function readGrid(isQuick) {
    // if(isQuick && solution != null){
    //     drawGrid(solution);
    //     solution = null;
    // }
    var grid = [];
    var count = 0;
    clearErrors();

    for (var i = 0; i < 9; i++) {
        grid.push([]);
        for (var j = 0; j < 9; j++) {
            var value = txtBoxes[count].value.replace(/\s/g, '');

            if (isNaN(value) || parseInt(value) < 1 || parseInt(value) > 9) {
                highlightError(count);
                return;
            } else if (value == "") {
                grid[i][j] = 0;
            } else {
                grid[i][j] = parseInt(value);
            }
            count++;
        }
    }
    solveSudoku(grid, false, isQuick);
}

function highlightError(count, form) {
    for (var i = 0; i <= 81; i++) {
        if (i == count) {
            txtBoxes[i].style.backgroundColor = "#BC312A";
        }
    }
}

var innerContent;
var animationDone = true;
function showModal(type) {
    if(line.style.width == "100%" && innerContent != document.getElementById(type)){
        innerContent.style.top = "-500px";
    }

    var closeButtons = document.getElementsByClassName("close");
    let hide = document.getElementById("hide");

    const fadeOut = () => {
        innerContent.classList.add("fadeOut");
        
        setTimeout(function() {
            innerContent.style.display = "none";
            innerContent.classList.remove("fadeOut");
        }, 400);
    }

    const dropIn = () => {
        if(!animationDone) return;
        hide.style.opacity = 0;
        hide.style.zIndex = -5;
        hide.style.pointerEvents = "none";

        line.style.visibility = "visible";
        line.style.width = "100%";       
        setMaskHeight();
        
        setTimeout(function() {
            innerContent.style.top = line.offsetTop + line.offsetHeight + 50 + "px";
        }, 800);
    }

    const dropOut = () => {
        animationDone = false;
        innerContent.style.top = "-500px";
        setMaskHeight();
        line.style.width = "0";      
        
        setTimeout(function() {
            line.style.visibility = "hidden"; 
            hide.style.opacity = 1;
            hide.style.zIndex = 0;
            hide.style.pointerEvents = "auto";
            animationDone = true;
        }, 1000);
    }

    innerContent = document.getElementById(type);

    if(type == "hintPopup"){
        innerContent.style.display = "flex";        

        var buttons = document.getElementsByClassName("controlBtn");
        var input = document.getElementById("hintInput");      

        input.focus();

        input.onfocus = () => {
            input.style.backgroundColor = null;
        }

        buttons[0].onclick = function() {
            var value = input.value.replace(/\s/g, '');;
            if (!isNaN(value) && value != "" && value > 0 && value <= 81) {
                clearErrors();
                createGrid(value);
                fadeOut();
                input.style.backgroundColor = "";
                return;
            } else {
                input.style.backgroundColor = "red";
            }
        }

        innerContent.onclick = (e) => {
            var senderElement = e.target;
            if(senderElement == innerContent){
                fadeOut();
                input.style.backgroundColor = "";
            }
        }

        buttons[1].onclick = function() {
            fadeOut();
            input.style.backgroundColor = "";
        }
    }else if(type == "themes"){
        dropIn();
        closeButtons[0].onclick = () => {dropOut();}
    } else if(type == "settings"){
        if(window.localStorage.getItem("theme") == "blackWhite"){
            document.querySelector("input[type=checkbox]").checked = true;
        }else{
            document.querySelector("input[type=checkbox]").checked = false;
        }
        dropIn();
        closeButtons[1].onclick = () => {dropOut();}
    }else if(type == "info"){
        dropIn();
        closeButtons[2].onclick = () => {dropOut();}
    }
}

var speeds = [10, 10];
var inputs = document.getElementsByName("change");
function changeSpeed(value, type){
    let index;
    if(type == "s") index = 0;
    else index = 1;
    console.log(value);
    value = value.replace(/\s/g, '');;
    if(index == 0 && !isNaN(value) && value > 0 && value != ""){
        speeds[index] = value;
    }else if(index == 1){
        speeds[index] = value;
    }

    inputs[index].innerText = speeds[index];
}

var oldTheme = "blue";
function checkBox(box){
    if(box.checked){
        oldTheme = window.localStorage.getItem("theme");  
        setTheme("blackWhite");
    }else{
        setTheme(oldTheme);
    }
}

function createGrid(hints) {
    var grid = [
        [0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0]
    ];
    var coords = [];
    var coordsSpaces = false;
    var numHints = hints;

    if(hints == 81){
        grid = solveSudoku(grid, true, true);
        drawGrid(grid);
        return;
    }

    if(hints > 41){
        coordsSpaces = true;
        numHints = 81-hints;
    }

    for (var i = 0; i < numHints; i++) {
        let newCoords = [Math.floor(Math.random() * 9), Math.floor(Math.random() * 9)];

        for (var j = 0; j < coords.length; j++) {
            if (coords[j][0] == newCoords[0] && coords[j][1] == newCoords[1]) {
                newCoords = [Math.floor(Math.random() * 9), Math.floor(Math.random() * 9)];
                j = 0;
            }
        }

        coords.push(newCoords);
    }

    grid = solveSudoku(grid, true, true);
    // solution = grid.map(function(arr) {
    //     return arr.slice();
    // });
    var isCoord = false;

    for(var i = 0; i < 9; i++){
        for(var j = 0; j < 9; j++){
            for (var f = 0; f < coords.length; f++) {
                if (coords[f][0] == i && coords[f][1] == j) {
                    isCoord = true;
                    coords.splice(f, 1);
                }
            }
            if((!coordsSpaces && !isCoord) || (coordsSpaces && isCoord)) grid[i][j] = 0;
            isCoord = false;
        }
    }

    drawGrid(grid);
}

function drawGrid(grid) {
    var count = 0;

    for (var i = 0; i < 9; i++) {
        for (var j = 0; j < 9; j++) {
            if (grid[i][j] == 0) {
                txtBoxes[count].value = "";
            } else {
                txtBoxes[count].value = grid[i][j];
            }
            count++;
        }
    }
}

function clearGrid() {
    disableButtons(true);
    var i = 0;
    var speed = speeds[1];
    var printGrids = setInterval(loop, speed);

    function loop() {
        if (i >= 81) {
            clearInterval(printGrids);
            disableButtons(false);
            return;
        }

        var val = txtBoxes[i].value;

        while (val.replace(/\s/g, '') == "") {
            i++;

            if (i >= 81) {
                clearInterval(printGrids);
                disableButtons(false);
                return;
            }

            val = txtBoxes[i].value;
            txtBoxes[i].value = "";
            txtBoxes[i].style.backgroundColor = null;
        }

        txtBoxes[i].value = "";
        txtBoxes[i].style.backgroundColor = null;

        i++;
    }
}

function disableButtons(disable) {
    let buttons = document.getElementsByClassName("main");
    let notAllowed = document.getElementsByClassName("notAllowed");

    for (let i = 0; i < buttons.length; i++) {
        if (disable){
            buttons[i].className = "disabledControlBtn main";
            notAllowed[i].style.cursor = "not-allowed"
        }else {
            buttons[i].className = "controlBtn main";
            notAllowed[i].style.cursor = null;
        }
    }
}

function clearErrors() {
    for (var i = 0; i < 81; i++) {
        txtBoxes[i].style.backgroundColor = "";
    }
}