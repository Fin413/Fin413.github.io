document.onkeydown = function(e) {
    solution = null;

    var activeElement = document.activeElement;
    var activeClass = document.activeElement.className.split(' ');

    if (document.getElementById("hintPopup").style.display == "block" && e.key == "Enter") {
        document.getElementById("hintInput").blur();
        document.getElementsByClassName("modalBtn")[0].click();
    }

    if (activeElement.parentNode.className == "txtRow") {
        let row = parseInt(activeClass[0].charAt(3));
        let column = parseInt(activeClass[1].charAt(6));

        switch(e.key){
            case "Backspace" :
                if(activeElement.value != ""){
                    activeElement.value = "";
                    break;
                }else{
                    activeElement.value = "";
                }
            case "ArrowLeft" :
                column--;
                break;
            case "ArrowRight" :
                column++;
                break;
            case "ArrowUp" :
                row--;
                break;
            case "ArrowDown" :
                row++;
                break;
        }

        if (!isNaN(e.key)) {
            setTimeout(function() {
                focusNext(row, column+1);
            }, 10);
        }else {
            focusNext(row, column);
        }
    }
}

function focusNext(row, column) {
    if (column > 9) {
        row++;
        column = 1;
    }else if(column < 1){
        row--;
        column = 9;
    }else if (row > 9) row = 1;
    else if (row < 1) row = 9;
    
    if (row == 10 && column == 1) row = column = 1;
    else if(row == 0 && column == 9) column = row = 9;

    var newBox = document.getElementsByClassName("row" + row + " " + "column" + column)[0];

    newBox.focus();
}
