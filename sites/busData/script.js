const btn = document.getElementById("btn");
const saveBtn = document.getElementById("saveBtn");
const dataTxt = document.getElementById("data");
var data = [];

function getDownloadData(position) {
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

        console.log(endTime, startTime, duration, bitsLoaded)
        console.log(`Download speed: ${speedMbps} mbps`);

        let now = new Date();

        let temp = {
            timestamp: now.getTime(),
            location: position,
            speed: {
                mbps: speedMbps, // mbps
                duration: duration, // seconds
            },
        }

        data.push(temp)
        let timestamp = now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: false });
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
        navigator.geolocation.watchPosition((position) => {
            getDownloadData(position);
        });
    } else {
        alert("Geolocation not available :(");
    }
}

btn.onclick = startLogging;
saveBtn.onclick = saveData;
