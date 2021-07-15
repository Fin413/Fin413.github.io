var dropdownContent = document.getElementsByClassName("dropdown-content")[0];
var dropdownInit = true;

function showDropdown(){
    dropdownInit = false;
    dropdownContent.classList.add("showDropdown");

    setTimeout(()=>{
        dropdownInit = true;
    }, 100);
}

document.onclick = () => {
    if(dropdownInit){
        dropdownContent.classList.remove("showDropdown");
    }
}
