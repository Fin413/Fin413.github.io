var solution = null;

function check(grid, checkValid) {
    var squareRow = 0;
    var squareLevel = 0;

    for (var i = 0; i < grid.length; i++) {
        var row = grid[i];
        var column = [];
        var square = [];

        if (i == 3 || i == 6) {
            squareRow = 0;
            squareLevel += 3;
        }
        var squareIndex = 0;

        for (var j = 0; j < 9; j++) {
            column[j] = grid[j][i];

            if (j < 3) {
                for (var f = 0; f < 3; f++) {
                    square[squareIndex] = grid[j + squareLevel][f + (squareRow * 3)];
                    squareIndex++;
                }
            }
        }

        squareRow++;

        var tempRow = [];
        var tempColumn = [];
        var tempSquare = [];

        for (var j = 0; j < 9; j++) {

            var currentRow = row[j];
            var currentColumn = column[j];
            var currentSquare = square[j];

            var isDuplicate = currentRow == 0 || currentColumn == 0 || currentSquare == 0 || tempRow.includes(currentRow) || tempColumn.includes(currentColumn) || tempSquare.includes(currentSquare);
            var isDuplicateNoZero = (currentRow != 0 && tempRow.includes(currentRow)) || (currentColumn != 0 && tempColumn.includes(currentColumn)) || (currentSquare != 0 && tempSquare.includes(currentSquare));

            if (!checkValid && isDuplicate) {
                return false;
            } else if (checkValid && isDuplicateNoZero) {
                
                if (currentRow != 0 && tempRow.includes(currentRow)) {
                    console.log("im a fuck face row");
                    highlightError(((i + 1) * 9) - (9 - (j)));
                } else if (currentColumn != 0 && tempColumn.includes(currentColumn)) {
                    console.log("im a fuck face column");
                    highlightError(((j + 1) * 9) - (9 - (i)));
                } else if (currentSquare != 0 && tempSquare.includes(currentSquare)) {
                    console.log("im a fuck face sqaure");
                    highlightError((((9 * (squareLevel + 1)) + (squareRow * 3)) - 12) + ((Math.ceil(((j + 1) / 3) - 1) * 9) + j - ((Math.ceil(((j + 1) / 3) - 1)) * 3)));
                }

                return false;
            } else {

                tempColumn[j] = currentColumn;
                tempRow[j] = currentRow;
                tempSquare[j] = currentSquare;

            }


        }
    }

    return true;
}

function getSquare(grid, i, coords) {

    var xAdj = 0;
    var yAdj = 0;

    if (coords[1] >= 3 && coords[1] < 6) xAdj = 3;
    else if (coords[1] >= 6) xAdj = 6;

    if (coords[0] >= 3 && coords[0] < 6) yAdj = 3;
    else if (coords[0] >= 6) yAdj = 6;

    switch(i) {
        case 0: return grid[0 + yAdj][0 + xAdj];
        case 1: return grid[0 + yAdj][1 + xAdj];
        case 2: return grid[0 + yAdj][2 + xAdj]; 
        case 3: return grid[1 + yAdj][0 + xAdj];
        case 4: return grid[1 + yAdj][1 + xAdj];
        case 5: return grid[1 + yAdj][2 + xAdj];
        case 6: return grid[2 + yAdj][0 + xAdj];
        case 7: return grid[2 + yAdj][1 + xAdj];
        case 8: return grid[2 + yAdj][2 + xAdj];
    }

}


function solveSudoku(solved, create, isQuick) {
    var allNums = [];
    var gridStates = [];

    if (!check(solved, true)) {
        return;
    }else{
        disableButtons(true);
    }

    for (var i = 0; i < solved.length; i++) {
        for (var j = 0; j < solved[i].length; j++) {
            if (solved[i][j] == 0) {
                allNums.push({ "coords": [i, j], "alreadyUsed": [] });
            }
        }
    }

    var index = 0;
    var max = 0;
   
    while (!check(solved, false)) {

        max++;
        if (max >= 1000000) {
            if (confirm('This Sudoku is taking an abnormally long time to solve.\nTo stop solving click \'cancel\' or click \'ok\' to continue,\nthis Sudoku may have no solution.')) {
                max -= 1000000;
            } else {
                disableButtons(false);
                return;
            }
        }

        var coords = allNums[index].coords;
        var num = Math.floor(Math.random() * 9) + 1;
        var ogNum = num;
        var first = true;

        for (var i = 0; i < 9; i++) {
            if (allNums[index].alreadyUsed.includes(num) || solved[coords[0]][i] == num || solved[i][coords[1]] == num || getSquare(solved, i, coords) == num) {
                if (!first && num == ogNum) {
                    num = 69;
                    break;
                }

                if (num >= 9) {
                    num = 1;
                } else {
                    num++;
                }
                first = false;

                i = -1;
            }
        }

        if (num > 9 && index > 0) {
            allNums[index].alreadyUsed = [];

            index--;
            coords = allNums[index].coords;

            allNums[index].alreadyUsed.push(solved[coords[0]][coords[1]]);
            solved[coords[0]][coords[1]] = 0;

        } else {
            if(!isQuick){
                var newArray = solved.map(function(arr) {
                    return arr.slice();
                });
                gridStates.push(newArray);
            }
            solved[coords[0]][coords[1]] = num;
            index++;
        }


    }

    if(isQuick && create){
        disableButtons(false);
        return solved;
    }else if (isQuick && !create) {
        drawGrid(solved);
        disableButtons(false);
    } else {

        var skipBtn = document.getElementById("skipBtn");
        if (allNums.length > 10) skipBtn.innerText = "Skip >>";

        let i = 0;
        let speed = solveSpeed;
        let printGrids = setInterval(loop, speed);
        let exit = false;
        let mouseStyle = "pointer";

        skipBtn.addEventListener("click", () => {
            exit = true;
        });
        skipBtn.addEventListener("mouseover", () => {
            skipBtn.style.cursor = mouseStyle;
        });

        function loop() {
            if (i >= gridStates.length || exit) {
                drawGrid(solved);
                skipBtn.innerHTML = "&nbsp";
                mouseStyle = "default";
                clearInterval(printGrids);
                disableButtons(false);
                return;
            }

            drawGrid(gridStates[i]);

            i++;
        }
    }


}