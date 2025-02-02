// ************* make sure in all paths that you give your name *************

var dialog = [
    // start
    {
        type: "options",
        text: "You enter the quaint music shop and see Gorthlax the Music Goblin jamming out to his tunes.",
        narrator: true,
        numOptions: 2,
        options: [ {branchStart: 1, text: "Cough politely to let him know you're here"},
                   {branchStart: 21, text: "SCREAM AT THE TOP OF YOUR LUNGS"} ]
    },
    {
        type: "options",
        narrator: true,
        text: "He can't hear you :(",
        numOptions: 2,
        options: [ {branchStart: 1, text: "Cough again"},
                {branchStart: 11, text: "Pretend to have a heart attack"} ]
    },
    {
        type: "options",
        narrator: true,
        text: "He still can't hear you, you fear he thinks you might have the plague.",
        numOptions: 2,
        options: [ {branchStart: 1, text: "Leave embarrassedly"},
                {branchStart: 2, text: "Scream \"I'M NOT INFECTED'\""} ]
    },
    {
        type:"event",
        eventType: "leave",
    },

    // plague
    {
        type: "event",
        eventType: "turnAround"
    },
    {
        type: "event",
        eventType: "change sprite",
        src: "musicGoblinSurprised.png",
    },
    {
        type: "throwAway",
        text: "AHHHHHHHHH!"
    },
    {
        type: "event",
        eventType: "change sprite",
        src: "musicGoblin.png",
    },
    {
        type: "throwAway",
        text: "What a suspiciously specific thing to say..."
    },
    {
        type: "throwAway",
        narrator: true,
        text: "(he eyes you warily and takes a few subtle steps back)"
    },
    {
        type: "throwAway",
        text: "Anyway sickly traveler, I was just listening to some ballads."
    },
    {
        type: "endBranch",
        jumpBy: 18
    },

    // heart attack
    {
        type: "event",
        eventType: "heartAttack"
    },
    {
        type: "throwAway",
        narrator: true,
        text: "Sadly you're an amazing method actor and begin to actually have a heart attack."
    },
    {
        type: "throwAway",
        narrator: true,
        text: "Gorthlax hears you fall to the ground and writhe in pain."
    },
    {
        type: "event",
        eventType: "turnAround"
    },
    {
        type: "throwAway",
        text: "YOOOOOOOOO thats dope bro!"
    },
    {
        type: "throwAway",
        narrator: true,
        text: "Unfortunately Gorthlax thinks you are showing off your sick break dancing routine and doesn't call for help."
    },
    {
        type: "throwAway",
        narrator: true,
        text: "In his defense, you do look very cool."
    },
    {
        type: "throwAway",
        narrator: true,
        text: "You pass away while looking cool and awesome :("
    },
    {
        type: "event",
        eventType: "leave"
    },

    // SCREAM
    {
        type: "event",
        eventType: "turnAround"
    },
    {
        type: "event",
        eventType: "change sprite",
        src: "musicGoblinSurprised.png",
    },
    {
        type: "throwAway",
        text:"AHHHHHHH!",
    },
    {
        type: "event",
        eventType: "change sprite",
        src: "musicGoblin.png",
    },
    {
        type: "throwAway",
        text:"Dude you almost scared the shit out of me, why would you do that!",
    }, 
    {
        type: "throwAway",
        narrator: true,
        text:"Based on the smell emanating from his pants, you think you may have more than \"almost\" scared the shit out of him.",
    }, 
    {
        type: "throwAway",
        text:"Anyway I was just listening to some new songs from the royal court.",
    },
    {
        type: "throwAway",
        narrator: true,
        text:"(he seems eager to change the subject)",
    }, 

    // shanties
    {
        type: "yesNo",
        text: "This recent tune has the taverns going CRAZY, wanna hear it?",
        onYes: 1, 
        onNo: 4, 
    },
    {
        type: "event",
        eventType: "play",
        src: "./media/audio/kanye.mp3",
        text: "The renowned bard Kanye of Westington preformed this a fortnight ago at a minstrel's revel in town square, it was life changing.",
    },
    {
        type: "throwAway",
        text: "The last person who heard that song renounced their noble title and became a full-time lute enthusiast."
    },
    {
        type: "endBranch",
        jumpBy: 3
    },

    // say no to shanties
    {
        type: "throwAway",
        text: "Damn bro, fuck you too I didn't even want to show you anyway..."
    },
    {
        type: "throwAway",
        narrator: true,
        text: "He looks deeply wounded as he mentally reminds himself to mention this to his therapist."
    },

    // options set
    {
        type: "options",
        text: "Back to business why have you ventured to my humble music shop?",
        numOptions: 3,
        options: [ 
                {branchStart: 43, text: "Your beauty enchanted me <3"},
                {branchStart: 17, text: "I seek the forbidden treasure..."},
                {branchStart: 1, text: "I was sent by Sir Finlay of house Soehn"}, 
            ]
    },

    // *** sent by sir Finlay ***
    {
        type: "throwAway",
        text:"Ohhh, Sir Finlay the Explosive! That man can clear out a Privy like no other, they say he needs a squire to hold his chamber pot steady like a knight bracing a siege weapon.",
    },
    {
        type: "throwAway",
        text:"Those poor squires usually end up becoming monks- claim they've \"seen too much\".",
    },
    {
        type: "options",
        text: "He might've dropped something off earlier, whats your name?",
        numOptions: 2,
        options: [ {branchStart: 1, text: "give name"}, {branchStart: 4, text: "remain nameless to keep your mysterious aura"} ]
    },

    // give name
    {
        type: "event",
        eventType: "nameInput",
    },
    {
        type: "throwAway",
        text: "Hmmmm... variable.name what an interesting name."
    }, 
    {
        type: "endBranch",
        jumpBy: 5
    },

    // be mysterious (don't give name)
    {
        type: "throwAway",
        text: "I'll name you myself then..."
    },
    {
        type: "throwAway",
        text: "I like the sound of Sir Dickballs Stupidface."
    },
    {
        type: "event",
        eventType: "nameInput",
        name: "Sir Dickballs Stupidface",
    },

    // choose whether to open package or not 
    {
        type: "yesNo",
        text: "Now that you mention it I think I recall he told me to give a package to a frighteningly funny looking lad, you seem to fit the description would you like to open it?",
        onYes: 4,
        onNo: 2,
    },
    {
        type: "yesNo",
        text: "Ah yes he had dropped off a package for you earlier, would you like to open it?",
        onYes: 3,
        onNo: 1,
    },

    // don't open package
    {
        type: "throwAway",
        text: "I guess I'll just go fuck myself then, GUARDS!!!!!!!!!!!!",
    },
    {
        type: "event",
        eventType: "leave"
    },

    // open package
    {
        type: "event",
        eventType: "showSong",
        songName: "test", // make goblin say the song????
        artist: "test",
        src: "test"
    },
    {
        type: "throwAway",
        text: "Farewell, may your pockets stay heavy and your enemies stay flammable.",
    },
    {
        type: "event",
        eventType: "leave",
    },

    // *** forbidden treasure ***
    {
        type: "throwAway",
        text: "!!!"
    },
    {
        type: "yesNo",
        text: "You must know how illegal and dangerous that treasure is to have... are you sure you want it?",
        onYes: 2,
        onNo: 1,
    },

    // say no to treasure
    {
        type: "throwAway",
        narrator: true,
        text: "I honestly didn't think anyone would choose this option, its awesome treasure you're going to try to get it anyway."
    },

    // agree to treasure
    {
        type: "throwAway",
        text: "To get the treasure you must answer my riddles three."
    }, 
    {
        type: "options",
        numOptions: 3,
        text: "1) You find a bottle labeled Potion of Longevity, what does it do?",
        options: [ {branchStart: 1, text: "Makes you younger"},
                   {branchStart: 18, text: "Increases your stamina"},
                   {branchStart: 18, text: "Increases your height"} ]
    }, 
    {
        type: "options",
        numOptions: 4,
        text: "CORRECT! 2) Sonic the Hedgehog is deathly afraid of what?",
        options: [ {branchStart: 17, text: "Spiders"},
                   {branchStart: 1, text: "Water"},
                   {branchStart: 17, text: "Confined Spaces"},
                   {branchStart: 17, test: "Papa Smurf"} ]
    }, 
    {
        type: "options",
        numOptions: 3,
        text: "CORRECT!\n3) How many coins will you give me right now, answer this riddle carefully...",
        options: [ {branchStart: 16, text: "None"},
                   {branchStart: 1, text: "One"},
                   {branchStart: 1, text: "Two"} ]
    }, 

    // correctly answer riddles
    {
        type: "throwAway",
        text: "Hey, I'll take what I can get. I lost my life savings in a dice game against a wizard. Never bet against a bastard that can cast Foresight."
    },
    {
        type: "throwAway",
        text: "That short staffed, scroll stuffing, Guttermage. I reported him to the Hex Offenders registry for that."
    },
    {
        type: "throwAway",
        text: "Anyway, looks like you answered all the riddles correctly, IMPRESSIVE!"
    },
    {
        type: "throwAway",
        narrator: true,
        text: "You have gained Gothlax's deepest respect."
    },
    {
        type: "throwAway",
        text: "You've earned this treasure..."
    },
    {
        type: "event",
        eventType: "stickyHand"
    },
    {
        type: "throwAway",
        text: "This treasure is a sticky hand unearthed from the floor of a Chuck E. Cheese in 2003, it is highly sought after and estimated to be worth BILLIONS of gold coins by the Kingdom's most questionable economists."
    },
    {
        type: "options",
        text: "Click on the sticky hand to unlock it's hidden potential.",
        numOptions: 1,
        options: [{branchStart: 1, text: "Awesome thanks!"}]
    },
    {
        type: "throwAway",
        text: "What's your name by the way?"
    },
    {
        type: "event",
        eventType: "nameInput"
    },
    {
        type: "throwAway",
        text: "Ahhh variable.name as the prophecy foretold...",
    },
    {
        type: "throwAway",
        text: "I was told that whoever received this treasure should be given this letter."
    },
    {
        type: "event",
        eventType: "showSong"
    },
    {
        type: "throwAway",
        text: "I'll see you around! If you're ever in need of business advice don't hesitate to ask- remember: Buy high, sell low, cry later."// "Thanks for visiting my shop, and if ever in doubt remember the Goblin motto 'Buy high, sell low, cry later'.",
    },
    {
        type: "event",
        eventType: "leave",
    },

    // incorrectly answer riddles
    {
        type: "throwAway",
        text: "INCORRECT, I can't believe I thought you might be the one."
    },
    {
        type: "throwAway",
        text: "You're not welcome in my shop anymore, come back when you're worthy."
    },
    {
        type: "throwAway",
        narrator: true,
        text: "You hang your head in shame as you exit the shop."
    },
    {
        type: "event",
        eventType: "leave"
    },

    // *** love story ***
    {
        type: "throwAway",
        text: "You notice Gorthlax blush deeply.",
        narrator: true,
    },
    {
        type: "throwAway",
        text: "You're not to bad looking yourself, stranger... What's your name?",
    },
    {
        type: "event",
        eventType: "nameInput",
    },
    {
        type: "throwAway",
        text: "variable.name what a dashing name...",
    },
    {
        type: "options",
        narrator: true,
        numOptions: 2,
        text: "Gorthlax gazes lovingly into your eyes. How do you respond?",
        options: [
            {branchStart: 1, text: "Marry Gorthlax (with a prenup)"},
            {branchStart: 2, text: "Marry Gorthlax (without a prenup)"}
        ]
    },
    {
        type: "event",
        eventType: "sign prenup"
    },
    {
        type: "event",
        eventType: "blackFade",
    },
    {
        type: "throwAway",
        text: "50 years into the future...",
        narrator: true
    },
    {
        type: "throwAway",
        text: "I WANT A DIVORCE AND IM TAKING ALL YOUR MONEY!",
    },
    {
        type: "throwAway",
        text: "You panic, but then remember that in goblin society, demanding a divorce is actually a sacred way of reaffirming eternal love. He has, in fact, just proposed again.",
        narrator: true,
    },
    {
        type: "options",
        text: "You wipe a tear from your eye. How do you respond?",
        narrator: true,
        numOptions: 2,
        options: [
            {branchStart: 1, text: "Agree to a divorce and renew your goblin vows"},
            {branchStart: 7, text: "Divorce him for real for his money :("}
        ]
    },
    
    // Agree to renew vows
    {
        type: "throwAway",
        text: "This is the happiest day of my life!"
    },
    {
        type: "throwAway",
        text: "This reminds me 50 years ago a stranger named Finlay gave me this letter for you, but I was scared he was trying to woo you with his flashy and lewd penmanship so I never gave it to you."
    },
    {
        type: "throwAway",
        text: "But now that you're legally trapped in this marriage, I suppose you can have it."
    },
    {
        type: "event",
        eventType: "showSong"
    },
    {
        type: "throwAway",
        text: "Goodbye my love, never forget the goblin that stole your heart and is soon to steal most of your gold <3",
    },
    {
        type: "event",
        eventType: "leave",
    },

    // divorce Gorthlax (you monster)
    {
        type: "throwAway",
        text: "Gorthlax is devastated.",
        narrator: true,
    },
    {
        type: "throwAway",
        text: "If that's what you truly want..."
    },
    {
        type: "event",
        eventType: "prenup outcome",
    },

    // if you didn't sign prenup
    {
        type: "throwAway",
        text: "He sighs and hands you half of his cursed treasure hoard as per goblin divorce law. He also pulls out a mysterious letter.",
        narrator: true,
    },
    {
        type: "throwAway",
        text: "I got this letter 50 years ago. I thought it was a love letter, and I didn't want competition. But now? Meh.",
    },
    {
        type: "event",
        eventType: "showSong",
    },
    {
        type: "throwAway",
        text: "You leave the shop a newly single adventurer, with a broken heart and a suspiciously sticky sack of gold.",
        narrator: true,
    },
    {
        type: "event",
        eventType: "leave",
    },

    // if you signed prenup
    {
        type: "throwAway",
        text: "He sighs and goes to hand you half of his cursed treasure hoard as per goblin divorce law.",
        narrator: true,
    },
    {
        type: "throwAway",
        text: "Suddenly he remembers the prenup you signed and stops.",
        narrator: true,
    },
    {
        type: "throwAway",
        text: "I'm not giving you anything! And I'm making you pay child support for our 14 children!",
    },
    {
        type: "throwAway",
        text: " (goblins lay a lot of eggs)",
    },
    {
        type: "throwAway",
        text: "You leave the shop with a broken heart, empty pockets, and monthly child support payments.",
        narrator: true,
    },
    {
        type: "throwAway",
        text: "You monster.",
        narrator: true,
    },
    {
        type: "event",
        eventType: "leave",
    },
]