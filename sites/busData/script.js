const btn = document.getElementById("btn");
const dataTxt = document.getElementById("data");
var data = [];

function testDownload(callback) {
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

        callback(speedMbps, duration);
    }
    img.src = "https://upload.wikimedia.org/wikipedia/commons/b/b6/Image_created_with_a_mobile_phone.png";
}

function startLogging() {
    btn.innerText = "Copy Data";
    btn.style.animation = "none";
    btn.onclick = () => {
        navigator.clipboard.writeText(dataTxt.innerText);
        btn.innerText = "Copied! :)";
        setTimeout(() => {
            btn.innerText = "Copy Data";
        }, 1000);
    }


    if ("geolocation" in navigator) {
        navigator.geolocation.watchPosition((position) => {
            const callback = (speed, duration) => {
                temp = {
                    timestamp: new Date().getTime(),
                    location: position,
                    speed: {
                        mbps: speed, // mbps
                        duration: duration, // seconds
                    },
                }

                data.push(temp)

                data.forEach((json) => {
                    let string = "<br>" + JSON.stringify(json) + ",";
                    dataTxt.innerHTML += string;
                })
            }
            testDownload(callback);
        });
    } else {
        alert("Geolocation not available :(");
    }
}

btn.onclick = startLogging;
