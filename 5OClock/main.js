var zones = require('@vvo/tzdb');
var timeZones = zones.getTimeZones();

var timeDisplay = document.getElementById("time");
var placeDisplay = document.getElementById("place");
var userDate = new Date();
var UtcHour = userDate.getUTCHours();

//based on UTC
var places = [];

for(var i = 0; i < timeZones.length; i++){
    var offset = Math.trunc(timeZones[i].currentTimeOffsetInMinutes/60);

    var localHour = getHour(UtcHour + offset);
    var localMins = getMins(userDate.getUTCMinutes() + ((timeZones[i].currentTimeOffsetInMinutes/60)-offset)*60);
    
    if(localHour == "5" || localHour == "17"){
        let suffix;
        if(localHour == "5") suffix = "AM";
        else suffix = "PM";
        console.log(timeZones[i].mainCities);
        places.push({hour: 5, min: localMins, suffix: suffix, place: timeZones[i].mainCities[getRand(0, timeZones[i].mainCities.length)] + ", " + timeZones[i].countryName})
    }
}

var index = getRand(0, places.length);
timeDisplay.innerText = places[index].hour + ":" + places[index].min;
document.getElementById("ampm").innerText = places[index].suffix;
placeDisplay.innerText = "In " + places[index].place;

//this is all skuffed am pm might not work also the gethour function and getmin input

//fix accented letter that are buggy

function getHour(hour){
    if(hour < 0){
        return 12 + hour;
    }else if(hour > 24){
        return hour - 24;
    }else{
        return hour;
    }
}

function getMins(mins){
    if(mins >= 60){
        localHour = getHour(localHour + 1);
        mins = mins - 60;
    }

    if(mins < 10) return "0" + mins;
    else return mins;
}

function getRand(min, max) {    
    return Math.floor(Math.random() * (max - min) ) + min; //includes min excludes max
}