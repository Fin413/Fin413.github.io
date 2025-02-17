var data;
var pcmData;
var bufferLength;
var analyser;
var previousVolume;

var audio = document.getElementById("music");
var scratch = document.getElementById("scratch");
var songText = document.getElementById("songText");
var cd = document.getElementById("cdImg");

var isSongPlaying = false;

var allSongs = [
    {
        audio: "ThroughTheFireAndTheFlames",
        album: "media/InhumanRampage.png"
    },
    {
        audio: "CryThunder",
        album: "media/UltraBeatdown.jpg"
    },
    {
        audio: "HerosOfOurTime",
        album: "media/PowerWithin.jpg"
    }
]
var currentSong = 0;

audio.src = "media/music/" + allSongs[currentSong].audio + ".mp3";

audio.onended = nextSong;

function nextSong(){
    if(currentSong < allSongs.length - 1) currentSong++;
    else currentSong = 0;

    if(isSongPlaying){
        audio.autoplay = true;
    }

    songText.innerText = allSongs[currentSong].audio.replace(/[A-Z]/g, ' $&').trim();
    cd.src = allSongs[currentSong].album;

    audio.src = "media/music/" + allSongs[currentSong].audio + ".mp3";
    if(!isSongPlaying) audio.pause();
}

function lastSong(){
    if(currentSong > 0) currentSong--;
    else currentSong = allSongs.length - 1;

    if(isSongPlaying){
        audio.autoplay = true;
    }

    songText.innerText = allSongs[currentSong].audio.replace(/[A-Z]/g, ' $&').trim();
    cd.src = allSongs[currentSong].album;

    audio.src = "media/music/" + allSongs[currentSong].audio + ".mp3";
    if(!isSongPlaying) audio.pause();
}

let deleteMe = true;

function play(){
    audio.play();
    isSongPlaying = true;
    cd.style.animationPlayState = "running";
    songText.innerText = allSongs[currentSong].audio.replace(/[A-Z]/g, ' $&').trim();
    cd.src = allSongs[currentSong].album;
    setInterval(() => {
        deleteMe = !deleteMe;
    }, 300);
    if(analyser == undefined){
        var audioContext = new (window.AudioContext || window.webkitAudioContext)();
        analyser = audioContext.createAnalyser();
        analyser.smoothingTimeConstant = 0.85;
        // change this shit if you wanna fine tune the wave
        // analyser.minDecibels = -90;
        // analyser.maxDecibels = -10;
        var source = audioContext.createMediaElementSource(audio);
        var gainNode = audioContext.createGain();
        gainNode.gain.value = -1;
    
        source.connect(gainNode);
        gainNode.connect(analyser);
        analyser.connect(audioContext.destination);
        analyser.fftSize = 2048;
    
        bufferLength = analyser.fftSize;
        
        data = new Uint8Array(bufferLength);   

        pcmData = new Float32Array(analyser.fftSize);

    }  
}

function pause(){
    audio.pause();
    scratch.play();
    isSongPlaying = false;
    cd.style.animationPlayState = "paused";
}

let timeout = 0;

function drawMusic(){
    analyser.getByteTimeDomainData(data);

    ctx.lineWidth = 3;
    ctx.strokeStyle = 'white';

    ctx.beginPath();

    var sliceWidth = canvas.width * 1.0 / bufferLength;
    var x = 0;

    for(var i = 0; i < bufferLength; i++) {
        var v = data[i] / 128.0;
        var y = v * canvas.height / 2;

        if(i === 0) {
            ctx.moveTo(x, y);
        } else {
            ctx.lineTo(x, y);
        }

        x += sliceWidth;
    }

    ctx.lineTo(canvas.width, canvas.height / 2);
    ctx.stroke();
    ctx.lineWidth = 1;

    analyser.getFloatTimeDomainData(pcmData);
    let sumSquares = 0.0;
    for (const amplitude of pcmData) { sumSquares += amplitude*amplitude; }
    let volume = Math.sqrt(sumSquares / pcmData.length);
    if(previousVolume - volume > 0.025){
        document.getElementsByClassName("centerLogo")[0].style.transform = "translate(-50%, -50%) scale(1.1)";
        if(previousVolume - volume > 3){
            document.getElementsByClassName("centerLogo")[0].style.filter = "brightness(200%)";
        }
        timeout = 4;
    }else if(timeout == 0){
        document.getElementsByClassName("centerLogo")[0].style.transform = "translate(-50%, -50%)";
    }else{
        timeout--;
    }
    previousVolume = volume;
}


function getBPM(){

}



// seemed tacky
// let fire = new Image;
// fire.src = "media/fire.gif";
// fire.id = "fire";
// document.body.appendChild(fire);
// window.onmousemove = (e) => {
//     if(e.pageY < window.innerHeight - 15) fire.style.top = e.pageY + "px";
//     if(e.pageX < window.innerWidth - 15) fire.style.left = e.pageX + "px"; 
// }
