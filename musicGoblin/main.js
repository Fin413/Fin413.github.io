// open on him jamming out with his headphones in
// muffled background music
// he is bobbing his head and music particles are coming out
// add shadows to add depth

const letter = document.getElementById("letter");
const dialogElement = document.getElementById("dialog");
const audioElement = document.getElementById("audioEl");
const paper = document.getElementById("paperContainer");
const speakerName = document.getElementById("speakerName");
const overlay = document.getElementById("overlayContainer");
const stickyHand = document.getElementById("stickyHand");
const continuePrompt = document.getElementById("continuePrompt");


var isTyping = false;
var started = false;
var alreadyVisited = false;
var activeDialog;
var prenup = false;

var index = 0;
const typeSpeed = 30;

var templateVars = {
    name: null
};

document.addEventListener("click", () => {
    if (started) {
        if (!isTyping && activeDialog[index].type == "throwAway") {
            continuePrompt.style.bottom = "40%";
            index++;
            nextAction();
        }
        return
    }

    started = true;

    document.getElementById("backgroundMusic").play();

    overlay.children[3].style.transform = "scale(2)";
    overlay.children[3].style.opacity = 0;
    overlay.style.background = "rgba(0,0,0,1)";
    overlay.children[2].style.display = "none";
    setTimeout(() => {
        overlay.children[3].style.display = "none";
        overlay.style.opacity = 0;
        nextAction();
        setTimeout(() => {
            overlay.children[0].style.display = "block";
            overlay.children[1].style.display = "block";                    
            overlay.style.display = "none";
            overlay.style.background = "rgba(0,0,0,0.5)";
            
        }, 1000);
    }, 1000);
});

const urlParams = new URLSearchParams(window.location.search);
try {
    document.getElementsByClassName("musicText")[urlParams.get('n')].style.display = "inline-block";
} catch (error) {
    document.getElementsByClassName("musicText")[0].style.display = "inline-block";
}

getName();

function getName() {
    templateVars.name = JSON.parse(window.localStorage.getItem("goblinInformation"));
    if(templateVars.name != null) alreadyVisited = true;
}

function saveName(){
    var temp = document.getElementById("nameInput").value;
    templateVars.name = temp;
    window.localStorage.setItem("goblinInformation", JSON.stringify(temp));
}

const fillTemplate = (string) => {
    let index = string.indexOf("variable.");
    console.log(index)

    if(index == -1) return string;

    let varName = string.substring(index + 9, string.indexOf(" ", index));
    console.log(varName)
    return string.substring(0, index) + templateVars[varName] + string.substring(index + 9 + varName.length);
}


function type(text, isNarrator = false){
    isTyping = true;

    if(!isNarrator){
        shakeImage();
        speakerName.style.bottom = "44%"; //44 before
    } else speakerName.style.bottom = "40%";
        
    let i = 0;
    dialogElement.innerHTML = "";
    var type = setInterval(() => {
        dialogElement.innerHTML += text[i];
        i++;
        if(i >= text.length){
            clearInterval(type);
            isTyping = false;
        }
    }, typeSpeed);//time / text.length);
}

var musicGoblin = document.getElementById("musicGoblin");
var dialogButtons = document.getElementsByClassName("dialogButton");

function shakeImage(){
    var shake = setInterval(() => {
        musicGoblin.style.transform = "translate(-50%, -110%) rotate(" + random(-2, 2) + "deg)";
        if(!isTyping){
            clearInterval(shake);
            musicGoblin.style.transform = "translate(-50%, -110%) rotate(0deg)";
        }
    }, 50)
}



var frame = 1;
var jam = setInterval(() => {
    frame = frame == 1 ? 2 : 1;
    musicGoblin.src = `./media/images/musicGoblinBack${ frame }.png`;
    spawnNote();
}, 500);

function spawnNote(){
    let el = document.createElement("img");
    el.src = "./media/images/musicNote" + random(1, 4) + ".png";
    el.classList = "musicNote";
    el.style.transform = `scaleX(${random(0,2) ? 1 : -1}) rotate(${random(-30,30)}deg)`;
    
    let pos = musicGoblin.getBoundingClientRect();

    let spawnOnLeftEar = random(0,2);
    el.style.top = pos.y + (pos.height / 4)+ "px"

    if(spawnOnLeftEar) el.style.left = pos.x + (pos.width / 10) + "px";
    else el.style.left = pos.x + 3*(pos.width/4) + "px";

    document.body.appendChild(el);

    setTimeout(() => {
        el.style.top = 0;
        el.style.opacity = 1;
        setTimeout(() => {
            el.style.opacity = 0;
        }, 500);
        setTimeout(() => {
            el.remove();
        }, 1000);
    }, 50);
}



function nextAction(){
    if(alreadyVisited) activeDialog = visitedDialog;
    else activeDialog = dialog;

    let dialogEl = activeDialog[index];

    let text = "";
    if(dialogEl.text) text = fillTemplate(dialogEl.text);

    switch (dialogEl.type) {
        case "throwAway":
            type(text, dialogEl.narrator);
            setTimeout(() => {
                let dim = document.getElementById("dialogContainer").getBoundingClientRect();
                let dialogBot = window.innerHeight - dim.bottom - 15; // -15 for box shadow
                let promptHeight = continuePrompt.offsetHeight + 36; // +36 for 18 top/bot margin
    
                continuePrompt.style.bottom = (dialogBot - promptHeight) + "px";//(percent) + "%";
            }, dialogEl.text.length * typeSpeed);
            break;
        case "yesNo":
            type(text, dialogEl.narrator);
            setTimeout(()=>{
                dialogButtons[0].innerText = "yes";
                dialogButtons[1].innerText = "no";
                showButtons(2);
                dialogButtons[0].onclick = () => {
                    jumpTo(dialogEl.onYes);
                    hideButtons(2);
                }
                dialogButtons[1].onclick = () => {
                    jumpTo(dialogEl.onNo);
                    hideButtons(2);
                }
            }, text.length * typeSpeed);
            break;
        case "endBranch":
            jumpTo(dialogEl.jumpBy);
            break;
        case "options":
            type(text, dialogEl.narrator);
            let temp = dialogEl.numOptions;
            setTimeout(()=>{
                for(let i = 0; i < dialogEl.numOptions; ++i){
                    dialogButtons[i].innerText = dialogEl.options[i].text;
                    dialogButtons[i].onclick = () => {
                        jumpTo(dialogEl.options[i].branchStart);
                        hideButtons(temp);
                    }
                }
                showButtons(dialogEl.numOptions);
            }, text.length * typeSpeed);
            break;
        case "event":
            eventHandler(dialogEl);
            break;
    }
    
}


function jumpTo(n) {
    index += n;
    nextAction();
}

function showButtons(n) {
    for(let i = 0; i < n; ++i){
        dialogButtons[i].style.display = "block";
        setTimeout(() => {
            dialogButtons[i].style.opacity = 1;
        }, 50) 
    }
}

function hideButtons(n) {
    console.log("hide buttons", n)
    for(let i = 0; i < n; ++i){
        dialogButtons[i].style.opacity = 0;
        dialogButtons[i].style.display = "none";
    }
}

function showPaper(){
    letter.src = "media/images/openLetter.png";
    paper.style.opacity = 1;
    paper.style.transform = "translate(-50%, -50%) scale(1)";

    document.getElementById("letterDoneBtn").onclick = () => {
        letter.removeAttribute("style");
        letter.src = "./media/images/letter.png";
        paper.style.opacity = 0;
        paper.style.transform = "translate(-50%, -50%) scale(0)";
        setTimeout(() => {
            jumpTo(1);
        }, 1000);
    }
}

function random(min, max) {
    return Math.floor(Math.random() * (max - min) ) + min;
}

function eventHandler(el) {
    console.log(el.eventType);
    let target;
    switch(el.eventType){
        case "play":
            type(el.text);

            setTimeout(() => {
                console.log("now")
                document.getElementById("backgroundMusic").pause();
                document.getElementById("kanye").play();

                dialogButtons[0].innerText = "Stop listening";

                let musicNoteLoop = setInterval(() => {
                    let defaultTrans = "translate(-50%, -110%)";
                    if(musicGoblin.style.transform == defaultTrans + " rotate(10deg)"){
                        musicGoblin.style.transform = defaultTrans + " rotate(-10deg)";
                    } 
                    else musicGoblin.style.transform = defaultTrans + " rotate(10deg)";
    
                    spawnNote();
                }, 500);

                dialogButtons[0].onclick = () => {
                    jumpTo(1);
                    hideButtons(1);
                    clearInterval(musicNoteLoop)
                    document.getElementById("kanye").pause();
                    document.getElementById("backgroundMusic").play();
                    document.getElementById("scratch").play();
                }

                showButtons(1);
            }, el.text.length * typeSpeed);
            break;
        case "nameInput":
            if(el.name){
                document.getElementById("nameInput").value = el.name;
                saveName(el.name);
                jumpTo(1);
                return;
            }

            overlay.style.display = "flex";
            setTimeout(() => {
                overlay.style.transform= "scale(1)  translateX(-50%)";
                overlay.style.opacity= 1;
            }, 10);
    
            let btn = document.getElementsByClassName("btn")[0];
            btn.onclick = () => {
                saveName();
                // overlay.style.transform= "scale(0.5) translateX(-100%)";
                overlay.style.opacity= 0;
                setTimeout(() => {
                    overlay.style.display = "none";
                    jumpTo(1);
                }, 500);
            }
            break;
        case "turnAround":
            clearInterval(jam);
            document.getElementById("backgroundMusic").pause();
            setTimeout(() => {
                musicGoblin.src = "./media/images/musicGoblin.png";
                document.getElementById("scream").play();

                jumpTo(1);
            }, 500);
            break;
        case "swapDialog":
            alreadyVisited = false;
            // no break so you always restart when dialog swaps
        case "leave":
            overlay.children[0].style.display = "none";
            overlay.children[1].style.display = "none"; 
            
            overlay.children[3].style.display = "block";
            overlay.children[3].style.transform = "scale(2)";
            overlay.children[3].style.opacity = 1;

            overlay.style.pointerEvents = "all";
            
            overlay.style.display = "block";
            overlay.style.opacity = 0;
            overlay.style.animation = "none";
            overlay.style.background = "rgba(0,0,0,1)";
            
            document.getElementById("scratch").play();

            setTimeout(() => {
                index = 0;
                overlay.style.opacity = 1;
                overlay.children[3].style.transform = "scale(1)";
                setTimeout(() => {
                    clearInterval(jam);
                    jam = setInterval(() => {
                        frame = frame == 1 ? 2 : 1;
                        musicGoblin.src = `./media/images/musicGoblinBack${frame}.png`;
                        spawnNote();
                    }, 500);
                    overlay.children[2].style.display = "block";
                    started = false;
                }, 1000);
            }, 50);
            break;
        case "heartAttack":
            document.getElementById("heartbeat").play();
            document.getElementById("backgroundMusic").pause();
            overlay.children[0].style.display = "none";
            overlay.children[1].style.display = "none"; 
            overlay.style.display = "flex";
            overlay.style.pointerEvents = "none";
            overlay.style.background = "rgba(255,0,0,0.25)";
            overlay.style.animation = "heartAttack 1s infinite";
            setTimeout(() => {
                overlay.style.opacity = 1;
                jumpTo(1);
            }, 10);
            break;
        
        case "stickyHand":
            target = stickyHand;
        case "showSong":
            if(!target){
                target = letter;
            }

            target.style.bottom = "65%";
            target.style.left = "50%";
            setTimeout(() => {
                target.style.zIndex = 100;
                setTimeout(() => {
                    target.style.bottom = "50%";
                    setTimeout(() => {
                        target.style.animation = "pulse 1s infinite";
                        if(target == stickyHand){
                            stickyHand.addEventListener("click", () => {
                                if(target.style.left != "93%"){
                                    target.style.animation = "none";
                                    target.style.left = "93%";
                                    target.style.bottom = "40%";
                                    target.style.transform = "";
                                    jumpTo(1);
                                }else {
                                    if (document.getElementById("slap").paused) {
                                        document.getElementById("slap").play();
                                    }else{
                                        document.getElementById("slap").currentTime = 0
                                    }
                                    
                                    stickyHand.src = "media/images/stickyHandExtended.png";
                                    setTimeout(() => {
                                        stickyHand.src = "media/images/stickyHand.png";
                                    }, 250);
                                }

                            })
                        } else {
                            target.addEventListener("click", showPaper);
                        }
                    }, 1000);
                }, 500);
            }, 500)
            break;
        case "sign prenup":
            prenup = true;
            jumpTo(1);
            break;
        case "prenup outcome":
            if(prenup) jumpTo(6);
            else jumpTo(1);
            break;
        case "blackFade":
            overlay.children[0].style.display = "none";
            overlay.children[1].style.display = "none"; 
            overlay.style.display = "flex";
            overlay.style.background = "rgba(0,0,0)";
            overlay.style.opacity = 0;
            overlay.style.transition = "opacity 2s";

            setTimeout(() => {
                overlay.style.opacity = 1;
                setTimeout(() => {
                    dialogElement.innerHTML = "";
                    musicGoblin.src = "./media/images/musicGoblinOld.png";
                    overlay.style.opacity = 0;
                    setTimeout(() => {
                        overlay.style.display = "none";
                        overlay.style.transition = "opacity 500";
                        jumpTo(1);
                    }, 2000);
                }, 2000);
            }, 20);
            break;
        case "change sprite":
            musicGoblin.src = `./media/images/${ el.src }`;
            if(el.src == "musicGoblin.png") document.getElementById("backgroundMusic").play();
            jumpTo(1);
            break;
        
    }   
}

// animate him doing a kickfip 
// smoking cutscene where the screen gets covered in smoke
