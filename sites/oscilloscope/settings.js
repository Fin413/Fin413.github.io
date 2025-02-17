const gridCheckbox = document.getElementById("gridCheckbox");

gridCheckbox.addEventListener("change", (e) => {
    let overlay = document.getElementById("gridImg");
    if(e.target.checked){
        overlay.style.display = "block";
    }else{
        overlay.style.display = "none";
    }
})