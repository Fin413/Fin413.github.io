// minify this JS at the end

var data = {};

var total;
var numCorrect = 0;

var timerInterval;
var time;
var timeLimit;

var input = document.getElementById("countryInput");
var timerElement = document.getElementById("timer");
var progress = document.getElementById("progress");

var indicator = document.getElementsByClassName("indicator")[0];

var scroll = document.getElementById("scroll");
var mapContainer = document.getElementById("mapContainer");
var mapTryAgain = document.getElementById("redo");
var exitBtn = document.getElementById("exit");

var stats = document.getElementById("stats");
var statsHeading = document.getElementById("statsHeading");

var rPrompt = document.getElementById("regionPrompt");
var promptContainer = document.getElementById("clickPrompt")
var activeRegion;
var startTime;

var transitioning;


setTimeout(unfurlMap, 100);

var soundButton = document.getElementById("soundControl");
var audio = document.getElementById("audio");

var currentSong;
var songQueue = ["Pirate Town", "Swashbuckling Pirates" , "Young Buccaneer"];

audio.onended = () => {
    if(currentSong == (songQueue.length - 1)) currentSong = 0;
    else currentSong++;
    
    audio.src = "media/music/" + songQueue[currentSong] + ".mp3";
    if(soundButton.getAttribute("state") == "paused") audio.pause();
}

soundButton.addEventListener("click", toggleSound);

function toggleSound() {
    if(currentSong == undefined){
        try{            
            if(audio.canPlayType('audio/mpeg') == '') throw("Brower does not support .MP3 audio type");
            
            currentSong = Math.floor(Math.random() * 3);
            audio.src = "media/music/" + songQueue[currentSong] + ".mp3";
        }catch(e){
            console.log(e);

            let noAudio = document.getElementById("noAudio");

            noAudio.style.display = "flex";
            noAudio.style.animation = "noAudioPopup 3s ease-in-out 1";

            setTimeout(()=>{
                noAudio.style.display = "none";
            }, 2900);

            return;
        }
    }

    if(soundButton.getAttribute("state") == "paused"){
        audio.play();
        soundButton.style.background = "url('media/play.svg') 0% 0% / 75px no-repeat";
        soundButton.setAttribute("state", "playing");
    }else{
        audio.pause();
        soundButton.style.background = "url('media/mute.svg') 0% 0% / 75px no-repeat";
        soundButton.setAttribute("state", "paused");
    }
}

/*
    SHIT LIST

    - ADD ALREADY GUESSED ALERT
    - weird restart error <- !!!
    it says a value is undefined when it's simply not?

    - sometimes the gamebar just appears without the animation (probably because the settimeout triggers too fast) fixed
    - change stats page color (looks too similar to map)
    - fix indicator <- is smth wrong???
    (make countries overview page?)
    - the overflow is werid both vertical and horizontal <- !!!!!!!
    cause the body flex centers it 
    make it so you can always scroll the whole page regardless of size
    - make it impactful when one is guessed correct
    - add settings page with credits audio volume settings and other shit in notes
    (disable timer)
    - add a little credits page being liek "this site uses a personally modified version of blahblalblah"
    - add grain to wood
    - add waves to map

*/
var userSelectedMap;
var gamemode;

function selectMap(selectedMap){
    if(transitioning) return;

    let wordChoice;
    userSelectedMap = selectedMap;

    switch(selectedMap){
        case "canada":
            wordChoice = "provinces";
            timeLimit = "480";
            break;
        case "us_aea_en":
            wordChoice = "states";
            timeLimit = "600";
            break;
        case "world":
            wordChoice = "countries";
            timeLimit = "900";
            break;
    }

    document.getElementById("name").innerText = "Name as many " + wordChoice + " as possible."
    document.getElementById("locate").innerText = "Locate as many " + wordChoice + " as possible."

    furlMap();

    setTimeout(()=>{
        document.getElementById("menuTitle").innerText = "~ Select Gamemode ~";
        document.getElementById("mapSelection").style.display = "none";
        document.getElementById("gamemodeSelection").style.display = "flex";
        unfurlMap();
    }, 1000);
}

document.getElementById("name").onmouseover = moveSkull;
document.getElementById("locate").onmouseover = moveSkull;
document.getElementById("name").onfocus = moveSkull;
document.getElementById("locate").onfocus = moveSkull;

function moveSkull(){
    let skull = document.getElementById("skull");
    if(this.id == "locate") skull.style.marginTop = "42px";
    else skull.style.marginTop = "-57px";
}

function startGame(tempGM){
    if(transitioning) return;

    gamemode = tempGM;
    furlMap();
    setTimeout(()=>{
        document.getElementById("mapMenu").style.display = "none";
        document.getElementById("map").style.display = "block";
        createMap(userSelectedMap);
    }, 1000);
}

function setTimer(tempTime){
    timerElement.innerText = formatTime(tempTime);
    timerInterval = setInterval(timer, 1000);
    time = tempTime;
}

function timer() {
    time--;
    timerElement.innerText = formatTime(time);

    if(time == 10){
        document.getElementById("lowTime").style.display = "block";
        document.getElementById("lowTime").style.animation = "lowTimeIndicator 600ms ease-out 1";
    }

    if(time <= 10){
        document.getElementById("lowTime").innerText = timerElement.innerText;
    }
   
    if(time == 0){
        end();
    }else if(time <= 5){
        document.getElementById("lowTime").style.animation = "textSize 600ms 1";
        setTimeout(()=>{
            document.getElementById("lowTime").style.animation = null;
        }, 600)
    }    
}

function formatTime(seconds){
    let mins = parseInt(seconds / 60, 10);
    let secs = parseInt(seconds % 60, 10);

    // mins = mins < 10 ? "0" + mins : mins;
    secs = secs < 10 ? "0" + secs : secs;

    return mins + ":" + secs;
}

function toggleGameBar() {
    var gamebar = document.getElementsByClassName("gamebar")[0];
    if(gamebar.style.display == "flex"){
        gamebar.style.height = 0;
        gamebar.style.opacity = 0;

        setTimeout(() => {
            gamebar.style.display = "none";
        }, 600);
    }else{
        gamebar.style.display = "flex";

        setTimeout(() => {
            if(gamemode == "name") gamebar.style.height = "50px";
            else gamebar.style.height = "75px";
            gamebar.style.opacity = 1;
        }, 100);
    }
}   

function unfurlMap(){
    if(transitioning) return;

    transitioning = true;
    stats.style.zIndex = "-1";

    mapContainer.style.clipPath = "polygon(0 0, 100% 0, 100% 100%, 0 100%)";
    scroll.style.animation = "scrollShrink 1s ease-in-out"

    setTimeout(()=>{
        scroll.style.display = "none";
        transitioning = false;
    }, 990);
}

function furlMap(){
    if(transitioning) return;

    transitioning = true;
    scroll.style.display = "block";

    mapContainer.style.clipPath = "polygon(0 0, 0 0, 0 100%, 0 100%)";
    scroll.style.animation = "scrollGrow 1s ease-in-out";

    setTimeout(() => {
        transitioning = false;
        stats.style.zIndex = "10";
    }, 990)
}

function checkForMatch(){
    let value = input.value.toLowerCase().trim();

    for (const property in data) {
        let name = data[property];
        
        if(name.includes(value)){
            map.setSelected('regions', [property]);
            delete data[property];

            indicator.innerText = input.value;
            indicator.classList.remove("indicatorHide");
            indicator.classList.add("indicatorShow");
            setTimeout(()=>{
                indicator.classList.remove("indicatorShow");
                indicator.classList.add("indicatorHide");
            }, 400)

            input.value = null;
            updateProgess();
            
            break;
        }         
    }
}

function locateNewCountry(){
    if(objKeys.length != 0){
        let text;
        activeRegion = objKeys[Math.floor(Math.random() * objKeys.length)];
        if(data[activeRegion][0].includes(".") || data[activeRegion][0] == "lao pdr") text = data[activeRegion][1];
        else text = data[activeRegion][0];
        rPrompt.innerText = "Click on " + text;
    }
}

function createMap(type) {
    window.map = new jsVectorMap({
        selector: '#map',
        map: type,
        showTooltip: false,
        regionsSelectable: false,
        zoomButtons: true,
        zoomOnScroll: true,
        draggable: true,
        zoomAnimate: false,
        zoomOnScrollSpeed: 1,
        zoomMin: 0.9,
        backgroundColor: '#537285',
        regionStyle: {
            selected: {
                fill: '#a0a659'
            },
        },
        onLoaded: (map) => {
            map.params.zoomAnimate = false;
            document.getElementsByClassName("jvm-zoomout")[0].click();
            map.params.zoomAnimate = true;
        },  
        onMapMoved: (map) => {
            if(map.params.regionsSelectable == true) map.params.regionsSelectable = false; // does this break stuff? check drag later!
        },
        onRegionSelected: function (index) {
            if(activeRegion == index){
                delete data[activeRegion];
                objKeys.splice(objKeys.indexOf(activeRegion), 1);
                updateProgess();
                locateNewCountry();
            }else{
                var regions = document.getElementsByClassName("jvm-region");
                map.setSelected('regions', [index]); // if region was already selected it stays selected

                if(objKeys.includes(index)){ // region wasn't already selected
                    let tempSelected = map.getSelectedRegions();
                    tempSelected.splice(tempSelected.indexOf(index), 1);

                    map.clearSelectedRegions();
                    map.setSelected('regions', tempSelected);

                    for(let i = 0; i < regions.length; i++){
                        let code = regions[i].getAttribute("data-code");
                        if(code == index){
                            regions[i].style.animation = "shakeRegion 150ms linear 3";
                        }else if(code == activeRegion){
                            regions[i].style.animation = "blinkFill 2s linear infinite";
                            activeRegion = regions[i];
                        }
                    }

                    end();
                    // add failed to click and actually clicked text to map
                }
            }
        },
    })

    initMap();

    /*
        npm package: https://github.com/themustafaomar/jsvectormap

        UPDATE NOTICE:

        In the map js file I manually added an 'alt' property with the alternate
        name written there. 
        Below are the countries I changed for future refernce incase I ever 
        'npm update jsvectormap'

        ([A-z])+\. regex to find shortened countries

        World Map:
            N. Cyprus -> Northern Cyprus
            Côte d'Ivoire -> Ivory Coast
            Dominican Rep. -> Dominican Republic
            Papua New Guinea -> New Guinea
            Dem. Rep. Congo -> Democratic Republic of Congo
            Central African Rep. -> Central African Republic
            Czech Rep. -> Czech Republic,Czechia
            Falkland Is. -> Falkland Islands 
            Solomon Is. -> Solomon Islands
            W. Sahara -> Western Sahara
            Bosnia and Herz. -> Bosnia and Herzegovina
            Eq. Guinea -> Equatorial Guinea
            Lao PDR -> Laos,Lao People's Democratic Republic,Lao Peoples Democratic Republic
            United States -> The United States

            what the actual fuck is Fr. S. Antarctic Lands

            Not alts I just changed:
                Korea -> South Korea
                Dem. Rep. Korea -> North Korea
        
        Canadian Map:
            Québec -> Quebec

        US Map:
            Removed District of Columbia
            "US-DC": { "path": "M781.25,216.97l0.45,-0.77l2.04,1.26l-0.66,1.14l-0.55,-1.05l-1.28,-0.58Z", "name": "District of Columbia" },


        Another issue was that regions were clicked on EVERY single mouseup event.
        So when dragging to move the map it would press whatever region your cursor 
        was over when you mouseup-ed. Very annoying.

        to fix this I added the onMapMoved event to the 'Events' var in the 
        'jsvectormap.js' file

        var Events = {
            onMapMoved: 'map:moved',
            ...
        };

        Then called it with 
        'map.emit('map:moved', [map]);' in the 
        'handleContainerEvents()' function
        specifically here:

        this.container.on('mousemove', function (e) {
            if (mouseDown) {
                map.transX -= (oldPageX - e.pageX) / map.scale;
                map.transY -= (oldPageY - e.pageY) / map.scale;
                map.applyTransform();
                oldPageX = e.pageX;
                oldPageY = e.pageY;
                map.emit('map:moved', [map]); // <-- !!!
            }
        ...
    */
}

function loaded(){
    console.log("loaded");
}

function initMap(){
    document.getElementById("exitText").innerText = "End test";
    exitBtn.onclick = end;

    let paths = map.mapData.paths;
    let abbreviations = Object.keys(paths);
    
    for(let i = 0; i < abbreviations.length; i++){
       
        let altName = paths[abbreviations[i]].alt;
        data[abbreviations[i]] = [paths[abbreviations[i]].name.toLowerCase()];

        if(altName != undefined && altName.indexOf(",") != -1){
            altName = altName.split(",");                            
            for(let j = 0; j < altName.length; j++){
                data[abbreviations[i]].push(altName[j].toLowerCase());
            }
        }else if(altName != undefined){
            data[abbreviations[i]].push(altName.toLowerCase());
        }
    }   

    numCorrect = 0;
    total = abbreviations.length;

    unfurlMap();
    toggleGameBar();

    if(gamemode == "name"){
        document.getElementById("typePrompt").style.display = "flex";
        document.getElementById("clickPrompt").style.display = "none";

        setTimer(timeLimit);

        input.disabled = false;
        input.addEventListener('input', checkForMatch);
        input.focus();

        progress = document.getElementById("progress");

        map.params.onRegionSelected = null;
    }else{
        document.getElementById("typePrompt").style.display = "none";
        document.getElementById("clickPrompt").style.display = "flex";

        window.objKeys = abbreviations;
        map.params.regionsSelectable = true;
        progress = document.getElementById("locateProgress"); // <-- reset pay attention

        locateNewCountry(abbreviations);

        document.onmouseup = () => {
            if(gamemode == "locate"){
                map.params.regionsSelectable = true;
            }
        }

        startTime = new Date().getTime();
    }

    progress.innerText = "0/" + total;
   
}

function updateProgess() {
    numCorrect++;
    progress.innerText = numCorrect + "/" + total; 

    if(numCorrect == total) end();
}

function end() {
    if(transitioning) return;

    var finalTime;
    let newHighscore = false;
    let highScores = JSON.parse(window.localStorage.getItem("savedScores"));

    if(highScores == null){
        highScores = {
            world: {},
            canada: {},
            us_aea_en: {}
        }
        for(const maps in highScores){
            highScores[maps] = {
                locate: {
                    score: 0,
                    time: "99:99",
                },
                name: {
                    score: 0,
                    time: "99:99",
                }
            }
        }

        window.localStorage.setItem("savedScores", JSON.stringify(highScores));
    }

    highScores = highScores[userSelectedMap][gamemode];

    stats.style.display = "flex";
    toggleGameBar();
    
    setTimeout(()=>{
        map.createTooltip();
        map.params.showTooltip = true;
    }, 500);

    if(gamemode == "name"){
        input.value = null;
        input.disabled = true;
        input.removeEventListener("input", checkForMatch);
    
        clearInterval(timerInterval);

        furlMap();

        setTimeout(()=>{
            document.getElementById("exitText").innerText = "Back"; 
            exitBtn.onclick = furlMap;
            mapTryAgain.style.display = "block";
            document.getElementById("lowTime").style.display = "none";
        }, 1000);
       
        finalTime = 600 - time;
    }else{
        map.params.regionsSelectable = false;
        document.onmouseup = null;

        document.getElementById("viewAnswers").innerText = "Back to Map";
    
        if(numCorrect == total || this.id == "exit"){
            furlMap();
            setTimeout(()=>{
                document.getElementById("exitText").innerText = "Back"; 
                exitBtn.onclick = furlMap;
                mapTryAgain.style.display = "block";
            }, 1000);

            finalTime = (new Date().getTime() - startTime)/1000;
            if(finalTime > 36000) finalTime = 3599; // max time is 59:59
        }else{
            document.getElementById("exitText").innerText = "View Stats"; 
            exitBtn.onclick = furlMap;
            mapTryAgain.style.display = "block";
        }
    }

    if(numCorrect == total){
        document.getElementById("timeDisp").style.display = "block";
        document.getElementsByClassName("pbScore")[0].style.display = "none";

        let minutes = parseInt(finalTime / 60, 10);
        let seconds = parseInt(finalTime % 60, 10);

        seconds = seconds < 10 ? "0" + seconds : seconds;

        let fullTime = minutes + ":" + seconds;

        document.getElementById("time").innerText = fullTime;

        let bestTime = highScores.time.split(":");

        if(minutes < bestTime[0] || (minutes == bestTime[0] && seconds < bestTime[1])){
            newHighscore = true;
            saveScore(null, fullTime);
            document.getElementById("bestTime").innerText = fullTime;
        }else{
            document.getElementById("bestTime").innerText = highScores.time;
        }

    }else{
        document.getElementById("timeDisp").style.display = "none";
        document.getElementsByClassName("pbScore")[0].style.display = "flex";
    }

    document.getElementById("score").innerText = numCorrect + "/" + total;

    if(numCorrect > highScores.score){
        saveScore(numCorrect, null);
        newHighscore = true;
    }

    if(newHighscore){
        statsHeading.innerText = "New Personal Best!";
        document.getElementsByClassName("pbTime")[0].style.animation = document.getElementsByClassName("pbScore")[0].style.animation = "textBlink 600ms steps(2, end) infinite";
        document.getElementById("bestScore").innerText = numCorrect + "/" + total;
    }else{
        statsHeading.innerText = "Game Over!";
        document.getElementsByClassName("pbScore")[0].style.animation = '';
        document.getElementsByClassName("pbTime")[0].style.animation = '';
        document.getElementById("bestScore").innerText = highScores.score + "/" + total;
    }

}

function saveScore(score, time) {
    let oldScore = JSON.parse(window.localStorage.getItem("savedScores"));

    if(score != null) oldScore[userSelectedMap][gamemode].score = score;
    if(time != null) oldScore[userSelectedMap][gamemode].time = time;

    window.localStorage.setItem("savedScores", JSON.stringify(oldScore));
}

function tryAgain() {
    resetMap();
    initMap();
}

function resetMap(){
    map.reset();
    document.getElementsByClassName("jvm-tooltip")[0].remove();
    map.params.showTooltip = false;

    map.params.zoomAnimate = false;
    document.getElementsByClassName("jvm-zoomout")[0].click();
    map.params.zoomAnimate = true;

    stats.style.display = mapTryAgain.style.display = "none";
    if(activeRegion instanceof Element) activeRegion.style.animation = null;    
}

function resetAll(){
    resetMap();

    document.getElementById("mapMenu").style.display = "block";
    document.getElementById("map").style.display = "none";

    document.querySelector("svg").remove();
    document.getElementsByClassName("jvm-zoomin")[0].remove();
    document.getElementsByClassName("jvm-zoomout")[0].remove();

    document.getElementById("mapSelection").style.display = "block";
    document.getElementById("gamemodeSelection").style.display = "none";
    document.getElementById("menuTitle").innerText = "~ Select Map ~";

    delete window.map;

    unfurlMap();
}