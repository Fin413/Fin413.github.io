/*************************************************************************\

IDEAS

make volume not shrink image
fix resize 
ADD CUSTOMIZEABLE SETTINGS (COLOR THICKNESS ETC)
ADD A SONG THAT GOES FROM LEFT TO RIGHT EAR SO YOU SEE A STRAIGHT LINE THEN A BLOB THEN A DIFFRENT ORIENTAION STRIGHT LINE

\**************************************************************************/



const fileInput = document.getElementById("audioInput");
const playBtn = document.getElementById("pausePlay");
const volumeInput = document.getElementById("volumeInput");
const thicknessInput = document.getElementById("thicknessInput");
const colorInput = document.getElementById("colorInput");

const micBtn = document.getElementById("micBtn");
const songName = document.getElementById("songName");

var audio = document.querySelector("audio");
var audioSrc;

var visualize;
var paused = true;

var gain = -1;
var volume;
var thickness = 1;
var color = "#00ff00";

// file input
fileInput.addEventListener("change", () => {
    const file = fileInput.files;
    audioSrc = window.URL.createObjectURL(file[0])
    audio.src = audioSrc;

    songName.innerText = file[0].name;

    playBtn.disabled = false;

    processAudio();
})

// mic input
micBtn.addEventListener("click", () => {
    navigator.mediaDevices.getUserMedia({video: false, audio: true}).then( stream => {
        window.localStream = stream; 
        paused = false;
        audio.pause();
        playBtn.disabled = false;
        processAudio("microphone");
        visualize();

        songName.innerText = "Microphone Input";
        playBtn.innerHTML = `<img src="pause.png" alt="" srcset=""><p>Pause</p>`;
    })
});



// demo tracks
function playSong(el){
    let tempSong = el.innerText;
    audio.src = tempSong + ".wav";
    songName.innerText = tempSong;
    playBtn.disabled = false;
    processAudio();
}

playBtn.addEventListener("click", () => {
    if(songName.innerText == "Microphone Input") {
        if(playBtn.innerText == "Play"){
            navigator.mediaDevices.getUserMedia({video: false, audio: true}).then( stream => {
                window.localStream = stream; 
                paused = false;
                audio.pause();
                processAudio("microphone");
                visualize();
                playBtn.innerHTML = `<img src="pause.png" alt="" srcset=""><p>Pause</p>`;
            })
        }else{
            window.localStream.getTracks().forEach((track) => {
                if (track.readyState == 'live' && track.kind === 'audio') {
                    track.stop();
                }
            });
            playBtn.innerHTML = `<img src="play.png" alt="" srcset=""><p>Play</p>`;
            paused = true;
            setTimeout(() => {
                ctx.clearRect(0, 0, pixelCanvasSize[0], pixelCanvasSize[1]);
            }, 100);
        }
    } else {
        if(playBtn.innerText == "Play"){
            playBtn.innerHTML = `<img src="pause.png" alt="" srcset=""><p>Pause</p>`;
            audio.play();
            paused = false;
            visualize();
        }else{
            playBtn.innerHTML = `<img src="play.png" alt="" srcset=""><p>Play</p>`;
            audio.pause();
            paused = true;
            setTimeout(() => {
                ctx.clearRect(0, 0, pixelCanvasSize[0], pixelCanvasSize[1]);
            }, 100);
        }
    }
})

volumeInput.addEventListener("input", (e) => {
    audio.volume = e.target.value;
    console.log(audio.volume)
})

// thicknessInput.addEventListener("input", (e) => {
//     thickness = e.target.value;
// })

colorInput.addEventListener("input", (e) => {
    color = e.target.value;
})


function processAudio(type){
    
    var audioContext = new (window.AudioContext || window.webkitAudioContext)();

    var analyserL = audioContext.createAnalyser();
    var analyserR = audioContext.createAnalyser();

    analyserL.smoothingTimeConstant = 0.85;
    analyserR.smoothingTimeConstant = 0.85;

    var source;
    if(type == "microphone"){
        source = audioContext.createMediaStreamSource(localStream);
    }else{
        source = audioContext.createMediaElementSource(audio);
    }

    var gainNode = audioContext.createGain();
    gainNode.gain.value = gain;

    const volumeNodeL = new GainNode(audioContext);
    const volumeNodeR = new GainNode(audioContext);
    volumeNodeL.gain.value = gain; // SET THESE LARGER AND THE WHOLE PICTURE GETS BIGGER
    volumeNodeR.gain.value = gain;
   
    analyserL.fftSize = 2048;
    analyserR.fftSize = 2048;

    var bufferLength = analyserL.fftSize;
    var bufferLength2 = analyserR.fftSize;
    
    var dataL = new Uint8Array(bufferLength);   
    var dataR = new Uint8Array(bufferLength2); 

    const channelsCount = 2;

    const splitterNode = new ChannelSplitterNode(audioContext, { numberOfOutputs: channelsCount });
    const mergerNode = new ChannelMergerNode(audioContext, { numberOfInputs: channelsCount });

    source.connect(splitterNode);

    splitterNode.connect(volumeNodeL, 0); // connect OUTPUT channel 0
    splitterNode.connect(volumeNodeR, 1); // connect OUTPUT channel 1

    volumeNodeL.connect(mergerNode, 0, 0); // connect INPUT channel 0
    volumeNodeR.connect(mergerNode, 0, 1); // connect INPUT channel 1

   
    // source.connect(volumeNodeL);
    // source.connect(mergerNode);

    volumeNodeL.connect(analyserL);
    volumeNodeR.connect(analyserR);

    if(type != "microphone"){
        // analyser.connect(audioContext.destination);
        // analyser2.connect(audioContext.destination);
        mergerNode.connect(audioContext.destination)
    }

    visualize = () => {
        
        if(!paused) requestAnimationFrame(visualize);

        analyserL.getByteTimeDomainData(dataL);
        analyserR.getByteTimeDomainData(dataR);

        ctx.clearRect(0, 0, pixelCanvasSize[0], pixelCanvasSize[1]);

        ctx.lineWidth = thickness;                              // CHNAGE LINE COLOR AND THICKNESS
        ctx.strokeStyle = color;
                
        // ctx.shadowBlur = 10;
        // ctx.shadowColor = 'white';

        ctx.beginPath();
        last = [0, 0];

        var interval = 5;

        for(var i = interval; i < bufferLength; i += interval) {
            var w = dataR[i] / 128.0;
            var x = pixelCanvasSize[0] - (w * pixelCanvasSize[0] / 2);
            
            var v = dataL[i] / 128.0;
            var y = pixelCanvasSize[1] - (v * pixelCanvasSize[1] / 2);

            last[0] = pixelCanvasSize[0] - ((dataR[i-interval] / 128.0) * (pixelCanvasSize[0]/2));
            last[1] = pixelCanvasSize[1] - ((dataL[i-interval] / 128.0) * (pixelCanvasSize[1]/2));

            // let dist = Math.sqrt(Math.pow(Math.abs(last[0] - x), 2) + Math.pow(Math.abs(last[1] - y), 2));
            
            // ctx.strokeStyle = `rgba(0, 255, 0, ${1/dist})`;
            // console.log(Math.abs(last[0] - x))

            // if(!(Math.abs(last[0]-x) > 30 || (Math.abs(last[1]-y) > 30))){
                // ctx.moveTo(last[0], last[1]);
                // ctx.lineTo(x, y);
            // }
            ctx.rect(x, y,1,1);
            ctx.stroke();
        }
    }
}
