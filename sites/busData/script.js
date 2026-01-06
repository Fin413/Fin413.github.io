const btn = document.getElementById("btn");
const saveBtn = document.getElementById("saveBtn");
const dataTxt = document.getElementById("data");
var data = [];

// enable navigation prompt
window.onbeforeunload = function() {
    return true;
};

function logDownloadData(position) {
    const imageSize = 11063620;
    const startTime = new Date().getTime();

    const img = new Image();
    img.onload = () => {
        const endTime = new Date().getTime();
        const duration = (endTime - startTime) / 1000;
        const bitsLoaded = imageSize * 8;
        
        let speedMbps;
        if(endTime == startTime) speedMbps = 0;
        else speedMbps = (bitsLoaded / duration) / 1000000;
        
        console.log(`Download speed: ${speedMbps} mbps`);
        
        let temp = {
            timestamp: position.timestamp,
            location: {
                accuracy: position.coords.accuracy,
                latitude: position.coords.latitude,
                longitude: position.coords.longitude,
                speed: position.coords.speed,
            },
            download: {
                mbps: speedMbps, // mbps
                duration: duration, // seconds
            },
        };
        console.log(temp);

        data.push(temp);
        let timestamp = new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: false });
        let string = "<br>" + timestamp + ": " + JSON.stringify(temp) + ",";
        dataTxt.innerHTML += string;
    }
    img.src = "https://upload.wikimedia.org/wikipedia/commons/b/b6/Image_created_with_a_mobile_phone.png";
}

function saveData() {
    let tempData = JSON.parse(window.localStorage.getItem("data"));

    if(tempData == null) tempData = data;
    else tempData = tempData.concat(data);

    window.localStorage.setItem("data", JSON.stringify(tempData));

    saveBtn.innerText = "Saved! :)";
    setTimeout(() => {
        saveBtn.innerText = "Save logs";
    }, 1000);
}

function logError(errorText){
    let timestamp = new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: false });
    let string = "<br><span class='error'>" + timestamp + " ERROR: " + errorText + "</span>";
    dataTxt.innerHTML += string;
}

function startLogging() {
    btn.innerText = "Copy data";
    btn.style.animation = "none";
    btn.onclick = () => {
        navigator.clipboard.writeText(window.localStorage.getItem("data"));
        btn.innerText = "Copied! :)";
        setTimeout(() => {
            btn.innerText = "Copy data";
        }, 1000);
    }

    saveBtn.style.display = "block";

    if ("geolocation" in navigator) {
        navigator.geolocation.watchPosition(
            (position) => {
                logDownloadData(position);
            },
            (error) => {
                switch (error.code) {
                case error.PERMISSION_DENIED:
                    logError("User denied the request for Geolocation.");
                    break;
                case error.POSITION_UNAVAILABLE:
                    logError("Location information is unavailable.");
                    break;
                case error.TIMEOUT:
                    logError("The request to get user location timed out.");
                    break;
                case error.UNKNOWN_ERROR:
                    logError("An unknown error occurred.");
                    break;
                }
            },
            {
                enableHighAccuracy: true,
                timeout: 5000,
                maximumAge: 0,
            }
        );
    } else {
        logError("Geolocation not available :(");
    }
}

btn.onclick = startLogging;
saveBtn.onclick = saveData;
