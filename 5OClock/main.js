const zones = require('@vvo/tzdb');
const timeDisplay = document.getElementById("time");
const placeDisplay = document.getElementById("place");

var places = [];
var timeZones;


findPlace();
countDown((60-new Date().getSeconds())*1000);


function findPlace(){
    timeZones = zones.getTimeZones();
    var userDate = new Date();
    var UtcHour = userDate.getUTCHours();
    var UtcMins = userDate.getUTCMinutes();

    for(var i = 0; i < timeZones.length; i++){
        var offset = Math.trunc(timeZones[i].currentTimeOffsetInMinutes/60);
        window.localHour = getHour(UtcHour + offset);
        var localMins = getMins(UtcMins + (((timeZones[i].currentTimeOffsetInMinutes/60)-offset)*60));

        if(localHour == "5" || localHour == "17"){
            let suffix = "AM";
            if(localHour >= "12") suffix = "PM";            
            places.push({hour: 5, min: localMins, suffix: suffix, place: timeZones[i].mainCities[getRand(0, timeZones[i].mainCities.length)] + ", " + timeZones[i].countryName})
        }
    }    

    var index = getRand(0, places.length);

    timeDisplay.innerText = places[index].hour + ":" + places[index].min;
    document.getElementById("ampm").innerText = places[index].suffix;
    placeDisplay.innerText = "In " + places[index].place;
}

function countDown(secs){
    setTimeout(function(){
        countDown(60000);
        let time = timeDisplay.innerText.substring(2, 4);
        if(time == 59) findPlace();
        else{
            time++;
            if(time < 10) time = "0" + time;
            timeDisplay.innerText = "5:" + time;
        }
    }, secs);
}

function getHour(hour){
    if(hour < 0) return 24 + hour;
    else return hour;
}

function getMins(mins){
    if(mins < 0){
        if(mins == 0) localHour = 23;
        else localHour--;
        mins = mins + 60;
    }else if(mins >= 60){
        if(mins == 23) localHour = 0;
        else localHour++;
        mins = mins - 60;
    }

    if(mins < 10) return "0" + mins;
    else return mins;
}

function getRand(min, max) {    
    return Math.floor(Math.random() * (max - min) ) + min;
}