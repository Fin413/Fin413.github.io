const btn = document.getElementById("btn");
const exportBtn = document.getElementById("exportBtn");
const dataTxt = document.getElementById("data");
var data = [];
var log_count = 0;
var watch_id = null;
var update_interval;

var fileName = null;

// enable navigation prompt
// window.onbeforeunload = function() {
//     return true;
// };

function logData(position) {
    data.push(position);
    log_count++;
}

function logText(text, color=[255, 255, 255]) {
    let timestamp = new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false });
    let string = `<span style="color: rgb(${color});"><br> ${timestamp}: ${text}</span>`;
    dataTxt.innerHTML += string;
}

function saveData() {
    let tempData = JSON.parse(window.localStorage.getItem("data"));

    if(tempData == null) tempData = data;
    else tempData = tempData.concat(data);

    window.localStorage.setItem("data", JSON.stringify(tempData));

    data = []
}


function downloadData(jsonContent) {
    const blob = new Blob([jsonContent], { type: "application/json;charset=utf-8;" });
    const url = URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = url;
    a.download = `${fileName}.json`;
    a.style.display = "none";
    document.body.appendChild(a);
    a.click();

    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    logText(`Downloaded ${fileName}.json.`, [0, 255, 0])
}
  

async function exportData() {
    stopLogging();

    saveData();
    logText("Saved data to prepare for export.")

    data = JSON.parse(window.localStorage.getItem("data"))

    if (!data || data.length === 0) {
        exportBtn.innerText = "No data to export";
        setTimeout(() => {
            exportBtn.innerText = "Export";
        }, 1000);
        return;
    }

    if(fileName == null)
        fileName = prompt('Enter File Name:');

    const jsonContent = JSON.stringify(data, null, 2);
    const file = new File([jsonContent], `${fileName}.json`, {
        type: "application/json"
    });

    if (navigator.canShare && navigator.canShare({ files: [file] })) {
        try {
            await navigator.share({
                title: fileName,
                text: "Export GPS data as JSON.",
                files: [file],
            });
    
            logText("Share was successful.", [0, 255, 0])
        } catch (err) {
            logError(`Encounted an error while saving: ${err}`)
            logText("Downloading data instead...")
            downloadData(jsonContent);
        }
    } else {
        alert("File sharing is not supported on this browser, downloading instead.");
        downloadData(jsonContent);
    }

    exportBtn.innerText = "Exported! :)";
    setTimeout(() => {
        exportBtn.innerText = "Export";
    }, 2000);

    localStorage.clear();
    logText("Cleared saved data.", [255, 255, 0]);
}

function logError(errorText){
    let timestamp = new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: false });
    let string = "<br><span class='error'>" + timestamp + " ERROR: " + errorText + "</span>";
    dataTxt.innerHTML += string;
}

async function requestWakeLock() {
    try {
        wakeLock = await navigator.wakeLock.request('screen');
        wakeLock.addEventListener('release', () => {
            console.log('Wake Lock released');
            logText('Wake Lock released', [255, 0, 0])
        });
        console.log('Wake Lock active');
        logText('Wake Lock active', [0, 255, 0]);
    } catch (err) {
        console.error(`${err.name}, ${err.message}`);
    }
}

function logDataUpdate(time_elapsed){
    logText(`Saved ${log_count} points in the last ${time_elapsed} seconds`);
    log_count = 0;

    saveData();
}

function stopLogging() {
    if (watch_id !== null) {
        navigator.geolocation.clearWatch(watch_id);
        watch_id = null;
        logText("Stopped tracking", [255, 255, 0]);

        btn.innerText = "Continue logging";
        btn.style.animation = "none";
        btn.onclick = startLogging;

        clearInterval(update_interval)
    }
}

function startLogging() {
    if(fileName == null) fileName = prompt('Enter File Name:');

    btn.innerText = "Stop logging";
    btn.style.animation = "none";
    btn.onclick = stopLogging;

    exportBtn.style.display = "block";

    logText(`LOCATION RECORDING STARTED ON "${fileName}"`, [0, 255, 0]);

    if ("geolocation" in navigator) {
        watch_id = navigator.geolocation.watchPosition(
            (position) => {
                // log immediately
                const record = {
                    timestamp: position.timestamp,
                    latitude: position.coords.latitude,
                    longitude: position.coords.longitude,
                    accuracy: position.coords.accuracy,
                    speed: position.coords.speed,
                    heading: position.coords.heading,
                };

                logData(record);
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
                timeout: Infinity,
                maximumAge: 0,
            }
        );
    } else {
        logError("Geolocation not available :(");
    }

    let wakeLock = null;

    document.addEventListener('visibilitychange', () => {
        if (wakeLock !== null && document.visibilityState === 'visible') {
            requestWakeLock();
        }
    });

    requestWakeLock();

    // update display every log_interval ms
    log_interval = 5000;
    update_interval = setInterval(() => logDataUpdate(log_interval / 1000), log_interval);
}

btn.onclick = startLogging;
exportBtn.onclick = exportData;
