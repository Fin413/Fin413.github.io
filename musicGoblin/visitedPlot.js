const visitedDialog = [
    {
        type: "throwAway",
        text: "You enter Gorthlax's Music Shop LOUDLY remembering last time.",
        narrator: true,
    },
    {
        type: "event",
        eventType: "turnAround"
    },
    {
        type: "options",
        text: "You look familiar, I've seen you before haven't I?",
        numOptions: 2,
        options: [ {branchStart: 2, text: "Yes (continue to view songs)"},
                   {branchStart: 1, text: "No (replay story)"} ]
    },
    {
        type: "event",
        eventType: "swapDialog"
    },
    {
        type: "throwAway",
        text: "Ah yes variable.name how could I forget!"
    },
    {
        type: "throwAway",
        text: "Looks like I got another package for you."
    },
    {
        type: "event",
        eventType: "showSong"
    },
    {
        type: "throwAway",
        text: "See ya!"
    },
    {
        type: "event",
        eventType: "leave"
    }
]