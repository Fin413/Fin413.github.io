var dropdownContent = document.getElementsByClassName("dropdown-content")[0];
var dropdownInit = true;

function showDropdown(){
    // dropdownInit = false;
    document.getElementsByClassName("dropdown btn")[0].focus();
    console.log("hi");
    // setTimeout(()=>{
    //     dropdownInit = true;
    // }, 100);
}

// document.onclick = () => {
//     if(dropdownInit){
//         dropdownContent.style.display = "none";
//     }
// }
