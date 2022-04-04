var evCache = new Array();
var prevDiff = -1;

function init() {
    // Install event handlers for the pointer target
    var el = document.getElementById("crosswordContainer");
    el.onpointerdown = pointerdown_handler;
    el.onpointermove = pointermove_handler;

    // Use same handler for pointer{up,cancel,out,leave} events since
    // the semantics for these events - in this app - are the same.
    el.onpointerup = pointerup_handler;
    el.onpointercancel = pointerup_handler;
    el.onpointerout = pointerup_handler;
    el.onpointerleave = pointerup_handler;
}

function pointerdown_handler(ev) {
    // The pointerdown event signals the start of a touch interaction.
    // This event is cached to support 2-finger gestures
    evCache.push(ev);
    startingCoord = [ev.clientX, ev.clientY];
}

function pointermove_handler(ev) {
    if(startingCoord != undefined){
        moveCrossword(ev.clientX, ev.clientY, startingCoord[0] - ev.clientX, startingCoord[1] - ev.clientY);
    }

    for (var i = 0; i < evCache.length; i++) {
        if (ev.pointerId == evCache[i].pointerId) {
            evCache[i] = ev;
            break;
        }
    }

    if (evCache.length == 2) {
        // Calculate the distance between the two pointers
        var curDiff = Math.abs(evCache[0].clientX - evCache[1].clientX);

        if (prevDiff > 0) {
            if (curDiff > prevDiff) {
                // The distance between the two pointers has increased
                resize(1);
            }
            if (curDiff < prevDiff) {
                // The distance between the two pointers has decreased
                resize(-1);
            }
        }

        // Cache the distance for the next move event
        prevDiff = curDiff;
    }
}

function pointerup_handler(ev) {
    remove_event(ev);
  
    // If the number of pointers down is less than two then reset diff tracker
    if (evCache.length < 2) {
        prevDiff = -1;
    }
}

function remove_event(ev) {
    // Remove this event from the target's cache
    for (var i = 0; i < evCache.length; i++) {
        if (evCache[i].pointerId == ev.pointerId) {
            evCache.splice(i, 1);
            break;
        }
    }
}
