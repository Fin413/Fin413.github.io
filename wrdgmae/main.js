const avatars = [
    "mario",
    "arah",
    "ash",
    "dor",
    "dro",
    "linguini",
    "longe",
    "wad",
    "todd",
]

var img = document.getElementById("avatar");
var avatar = 0;


function selectAvatar(dir){
    console.log("FDHJKDFHKL")
    if(avatar == avatars.length - 1 && dir > 0) avatar = -1;
    else if(avatar == 0 && dir < 0) avatar = avatars.length;
    avatar += dir;
    img.src = "media/" + avatars[avatar] + ".png";
}