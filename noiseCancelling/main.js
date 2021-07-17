var dropdownContent = document.getElementsByClassName("dropdown-content")[0];
var dropdownInit = true;
var start = false;

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

function init(){
    navigator.mediaDevices.getUserMedia({video: false, audio: true}).then( stream => {
        window.localStream = stream; 
        let localAudio = document.getElementById("audio");
        localAudio.srcObject = stream;
        localAudio.autoplay = true;

        var audioContext = new (window.AudioContext || window.webkitAudioContext)();
        var analyser = audioContext.createAnalyser();
        // analyser.minDecibels = -90;
        // analyser.maxDecibels = -10;
        analyser.smoothingTimeConstant = 0.85;
        var source = audioContext.createMediaStreamSource(localStream);

        source.connect(analyser);  //smth is fucky here dude
        analyser.connect(audioContext.destination);
    
        analyser.fftSize = 2048;
    
        var bufferLength = analyser.fftSize;
        
        var data = new Uint8Array(bufferLength);   
    
        start = true;


        document.getElementById("start").style.opacity = 0;
        setTimeout(()=>{
            document.getElementById("start").style.display = "none";
        }, 500)

        var visualize = () => {
            requestAnimationFrame(visualize);

            analyser.getByteTimeDomainData(data);

            ctx.clearRect(0, 0, width, height);

            ctx.lineWidth = 2;
            ctx.strokeStyle = 'rgb(0, 0, 0)';

            ctx.beginPath();

            var sliceWidth = width * 1.0 / bufferLength;
            var x = 0;

            for(var i = 0; i < bufferLength; i++) {
                var v = data[i] / 128.0;
                var y = v * height/2;

                if(i === 0) {
                    ctx.moveTo(x, y);
                } else {
                    ctx.lineTo(x, y);
                }

                x += sliceWidth;
            }

            ctx.lineTo(canvas.width, canvas.height/2);
            ctx.stroke();

        }

        visualize();

    }).catch( err => {
        console.log(err)
    });
    
}


function processAudio() {

    // might not wokr
    // audioBuffer must be fixed length
    // window.AudioContext = window.AudioContext || window.webkitAudioContext;
    

    

    
}


var canvas = document.querySelector("canvas");
var ctx = canvas.getContext("2d");

var width = canvas.width;
var height = canvas.height;

window.onresize = resize;
resize();

function resize(){
    canvas.width = width = document.documentElement.clientWidth;
}
var xOffset = 0;

function idle(){
    ctx.beginPath();
    ctx.lineWidth = 2;
    ctx.strokeStyle = "rgb(0,0,0)";

    var x = 0;
    var y = 0;
    var amp = 50;
    var freq = 25;
    var points = [0, 0]
    
    while(x <= canvas.width){
        y = canvas.height/2 + amp * Math.sin((x + xOffset)/freq);
        ctx.lineTo(x, y);
        if(x == canvas.width/2){
           points[0] = y;
        }
        x++;
    }

    if(xOffset > 1000000000) xOffset = 0; // fix this shit
    ctx.stroke();
}

function startScreen() {
    // add better with headphones thing when start is pressed
    window.requestAnimationFrame(startScreen);
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    idle();
    xOffset += 3;
    if(start) window.cancelAnimationFrame(startScreen);
}

startScreen();