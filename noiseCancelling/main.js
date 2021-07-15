var dropdownBtn = document.getElementsByClassName("dropdown-content")[0];
var dropdownInit = true;

function showDropdown(){
    dropdownInit = false;
    dropdownBtn.style.display = "flex";
    setTimeout(()=>{
        dropdownInit = true;
    }, 500);
}

document.onclick = () => {
    if(dropdownInit){
        console.log(dropdownBtn.style.display);
        document.getElementsByClassName("dropdown-content")[0].style.display = "none";
    }
}
