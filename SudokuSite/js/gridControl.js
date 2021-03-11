alert(document.body.style.width);

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
        if (j == 2 || j == 5) {
            txtInput.classList.add("spaceRight");
        } else if (i == 2 || i == 5) {
            txtInput.classList.add("spaceBottom");
        } else {
            txtInput.classList.add("normal");
        }
        document.getElementsByClassName("txtRow")[i].appendChild(txtInput);
    }
}

var line = document.getElementById("line");
var mask = document.getElementById("titleMask");

function setMaskHeight() {
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

        var buttons = document.getElementsByClassName("modalBtn");
        var input = document.getElementById("hintInput");

        input.focus();

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

        buttons[1].onclick = function() {
            fadeOut();
            input.style.backgroundColor = "";
        }
    }else if(type == "themes"){
        dropIn();
        closeButtons[0].onclick = () => {dropOut();}
    }else if(type == "save"){
        dropIn();
        closeButtons[1].onclick = () => {dropOut();}
    } else if(type == "settings"){
        dropIn();
        closeButtons[2].onclick = () => {dropOut();}
    }else {
        dropIn();
        closeButtons[3].onclick = () => {dropOut();}
    }
}

var solveSpeed = 10;
function changeSpeed(sign){
    if(sign == "+") solveSpeed++;
    else if(solveSpeed > 1) solveSpeed--;
    document.getElementById("solveSpeed").innerText = solveSpeed;
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
    var i = 0;
    var speed = 10;
    var printGrids = setInterval(loop, speed);

    function loop() {
        if (i >= 81) {
            clearInterval(printGrids);
            return;
        }

        var val = txtBoxes[i].value;

        while (val.replace(/\s/g, '') == "") {
            i++;

            if (i >= 81) {
                clearInterval(printGrids);
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
