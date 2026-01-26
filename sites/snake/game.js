// start screen no clear canvsa moving randomly


// bugs
// snakes don't hit eachother sometimes?
// you can turn into yourself

// online play again button -- DONE
// add back to menu button -- DONE
// add settings for size and speed -- DONE
// fix apple moving on start
// add instrucitons -- DONE
// loading when join pressed -- DONE


// game vars //
const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

var speed = 1;
var pixelSize = 10;
var lengthGain = 5;
var applesAdded = 2;


var allSnakes = [];
var allApples = [];
var allExplosions = [];

var deadSnake;
var runGame = false;

const GAME_MODES = Object.freeze({
    TWO_ONLINE: 0,
    TWO_LOCAL: 1,
    SINGLE: 2,
});
var gameMode = GAME_MODES.SINGLE;

// online variables //
var peer;
var conn;
var gameCode;
var joiningGame;
var playAgainRequested = false;
const connectionString = "jgie3b2-dsaj2p194-FinlayIsSoCool-dhdfj383491jqalzput"

// dom elements //
const statusText = document.getElementById("statusText");
const joinCodeText = document.getElementById("joinCodeText");
const gameOverContainer = document.querySelector(".gameOverContainer");
const onlineUI = document.querySelector(".onlineUI");
const joinGameText = document.getElementById("joinGameText");
const joinCodeInput = document.getElementById("gameCodeInput");
const playAgainBtn = document.getElementById("playAgainBtn");
const menuContainer = document.querySelector(".menu");
const gameContainer = document.querySelector(".gameContainer");


//==== main game funcitons ====//

function init() {
    // reset
    allSnakes = [];
    allApples = [];

    // spawn snakes //
    const blue = "#0FF";
    const green = "#0F0";

    const midY = canvas.height / 2;
    const leftStart = {x: 100, y: midY, dir: {x: 1, y: 0}};
    const rightStart = {x: canvas.width - 100, y: midY, dir: {x: -1, y: 0}};
    const middleStart = {x: canvas.width / 2, y: midY, dir: {x: 0, y: -1}}
    
    if(gameMode == GAME_MODES.TWO_ONLINE) {
        let first = joiningGame ? rightStart : leftStart;
        let second = joiningGame ? leftStart : rightStart;

        allSnakes.push(
            new Snake(first, green, ctx, speed, pixelSize),
            new Snake(second, blue, ctx, speed, pixelSize)
        );
    } else if (gameMode == GAME_MODES.TWO_LOCAL) {
        allSnakes.push(
            new Snake(leftStart, green, ctx, speed, pixelSize),
            new Snake(rightStart, blue, ctx, speed, pixelSize)
        );
    } else {
        allSnakes.push(new Snake(middleStart, green, ctx, speed, pixelSize));
    }

    // spawn starting apple
    if (gameMode != GAME_MODES.TWO_ONLINE || !joiningGame) {
        spawnApple(1);
        if (gameMode === GAME_MODES.TWO_ONLINE) sendApples();
    }

    loop();
}

function loop() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    drawSnakes();
    drawApples();
    drawExplosions();

    if(runGame) requestAnimationFrame(loop);
}

function drawSnakes() {
    allSnakes.forEach((snake, i) => {
        snake.drawSnake();

        let hitEnemy = false;
        if(gameMode == GAME_MODES.TWO_LOCAL || gameMode == GAME_MODES.TWO_ONLINE){
            if(i == 0) hitEnemy = snake.enemyCollision(allSnakes[1].snakeSegments);
            else hitEnemy = snake.enemyCollision(allSnakes[0].snakeSegments);
        }

        if(snake.hitBoundary() || snake.hitSelf || hitEnemy) {
            deadSnake = snake;
            die();
        }
    });
}

function drawApples() {
    for (let i = 0; i < allApples.length; ++i) {
        let apple = allApples[i];

        ctx.fillStyle = "#F00";
        ctx.beginPath();
        ctx.rect(apple.x, apple.y, pixelSize, pixelSize);
        ctx.fill();

        // detect collisions //
        allSnakes.forEach(snake => {
            let head = snake.snakeSegments[0]; 

            if(Math.abs(head.x - apple.x) < pixelSize && Math.abs(head.y - apple.y) < pixelSize){
                allApples.splice(i, 1);
                allExplosions.push(new Explosion(apple.x, apple.y, ctx, "#F00"));
                allExplosions.push(new Explosion(apple.x, apple.y, ctx, "#F00"));
                snake.addLength(lengthGain);
                spawnApple(applesAdded);


                if(gameMode == GAME_MODES.TWO_ONLINE) sendApples();
            }
        })
    }
}

function spawnApple(num) {
    for(let i = 0; i < num; ++i){
        allApples.push({
            x: randFloat(pixelSize, canvas.width - pixelSize),
            y: randFloat(pixelSize, canvas.height - pixelSize)
        });
    }
}

function sendApples(){
    conn.send({
        header: "spawn_apple",
        allApples: allApples,
    });
}

function drawExplosions(){
    allExplosions.forEach((explosion, i) => {
        if(explosion.allParticles.length == 0) allExplosions.splice(i, 1);
        else explosion.update();
    });
}

function die() {
    let deathText = document.getElementById("gameOverText");
    let loserText = document.getElementById("loseText");
    gameOverContainer.style.display = "flex";

    var head = deadSnake.snakeSegments[0];
    allSnakes.forEach(snake => snake.speed = 0);
    allExplosions.push(new Explosion(head.x, head.y, ctx, deadSnake.color));

    if (gameMode == GAME_MODES.TWO_ONLINE) {
        if(deadSnake == allSnakes[0]) loserText.innerText = "You Lose!";
        else loserText.innerText = "You Win";
        playAgainBtn.innerText = "Play Again (0/2)";
    } else if(gameMode == GAME_MODES.TWO_LOCAL) {
        if(deadSnake == allSnakes[0]) loserText.innerText = "Player 2 Wins!";
        else loserText.innerText = "Player 1 Wins!";
        playAgainBtn.innerText = "Play Again"; // reset to correct if they've change gamemodes
    } else {
        loserText.innerText = "Player 1 Loses";
        playAgainBtn.innerText = "Play Again";
    }

    setTimeout(() => {
        runGame = false;
        let opacity = 0;
        
        const updateOpacity = () => {
            if(opacity == 0.8) {
                document.querySelector(".gameOverUIContainer").style.visibility = "visible";
            }
            opacity += 0.2;
            deathText.style.opacity = opacity;
            if(opacity != 1) setTimeout(updateOpacity, 500);
        }
        updateOpacity();    
    }, 500);
}

const mainKeys = ["w", "s", "d", "a"];
const twoPlayerKeys = ["arrowup", "arrowdown", "arrowright", "arrowleft"];
window.addEventListener("keydown", e => {
    if(!runGame) return;

    let key = e.key.toLowerCase();

    let snake;
    let validKeys;
    if(mainKeys.includes(key)){
        // set to main player //
        snake = allSnakes[0]; 
        validKeys = mainKeys;
    } else if(gameMode == GAME_MODES.TWO_LOCAL && twoPlayerKeys.includes(key)) {
        // set to secondary player //
        snake = allSnakes[1]; 
        validKeys = twoPlayerKeys;
    } else {
        return;
    }

    let newPos = getNewPosition(key, validKeys, snake.snakeSegments[0]);

    // send snake data if online
    if(gameMode == GAME_MODES.TWO_ONLINE) conn.send(snake.snakeSegments);

    snake.dirChanges.push(newPos);
});

function getNewPosition(key, validKeys, head) {
    if(key == validKeys[0] && head.dir.y != 1) { // up
        head.dir.y = -1;
        head.dir.x = 0;
    } else if (key == validKeys[1] && head.dir.y != -1) { // down
        head.dir.y = 1;
        head.dir.x = 0;
    }

    if(key == validKeys[2] && head.dir.x != -1) { // right
        head.dir.x = 1;
        head.dir.y = 0;
    } else if(key == validKeys[3] && head.dir.x != 1){ // left
        head.dir.x = -1;
        head.dir.y = 0;
    } 

    return structuredClone(head);
}


//==== Click Handlers ====//

playAgainBtn.onclick = () => {
    if(gameMode == GAME_MODES.TWO_ONLINE){
        if(!playAgainRequested){
            playAgainBtn.innerText = "Play Again (1/2)";
            conn.send({ header: "play_again_request" });
            return;
        } else {
            conn.send({ header: "new_game"});
            playAgainRequested = false;
        }
    } 
    newGame();
    
    
    // if(gameMode == GAME_MODES.TWO_LOCAL) {
    
    // } else {
    //     runGame = true;
    //     init();
    // }
}

function newGame() {
    hideGameOverScreen();
    countDown();
}

document.getElementById("singleBtn").onclick = () => {
    gameMode = GAME_MODES.SINGLE;
    hideMenu()
    countDown();
    // runGame = true;
    // init();
}

document.getElementById("twoLocalBtn").onclick = () => {
    gameMode = GAME_MODES.TWO_LOCAL;
    runGame = true;
    hideMenu();
    countDown();
}

document.getElementById("twoOnlineBtn").onclick = () => {
    const onlineMenu = document.querySelector(".onlineMenu");
    
    if(gameMode == GAME_MODES.TWO_ONLINE){
        gameMode = null;
        onlineMenu.style.pointerEvents = "none";
        onlineMenu.style.opacity = 0;
        onlineMenu.style.height = "0";
    } else {
        gameMode = GAME_MODES.TWO_ONLINE;
        onlineMenu.style.pointerEvents = "all";
        onlineMenu.style.opacity = 1;
        onlineMenu.style.height = "125px";
    }
}

document.getElementById("mainMenuBtn").onclick = () => {
    hideGameOverScreen();
    menuContainer.style.display = "flex";
    gameContainer.style.display = "none";
}

joinCodeInput.oninput = () => {
    joinCodeInput.style.color = "black";
}


//==== Online Play Handlers ====//

document.getElementById("createGameBtn").onclick = () => {
    hideMenu();

    onlineUI.style.display = "block"
    joiningGame = false;

    gameCode = (Math.floor(Math.random() * 9999) + 1000);
    peer = new Peer(connectionString + gameCode);
    peer.on('open', () => {
        const joinCodeText = document.getElementById("joinCodeText");
        joinCodeText.innerText = "Join Code: " + gameCode;
    });

    // Host Logic //

    peer.on('connection', (connObj) => {
        conn = connObj;
        statusText.innerText = "Connected.";

        conn.on('data', function(data){
            if(data.header){
                if(data.header == "start_game"){
                    let newDimensions = {width: canvas.width, height: canvas.height};

                    if(data.screenSize.width < canvas.width) newDimensions.width = data.screenSize.width;
                    if(data.screenSize.height < canvas.height) newDimensions.height = data.screenSize.height;

                    conn.send({ 
                        header: "update_game", 
                        screenSize: newDimensions,
                        settings: {
                            speed: speed,
                            pixelSize: pixelSize,
                            lengthGain: lengthGain,
                            applesAdded: applesAdded
                        }
                    });
                    canvas.width = newDimensions.width;
                    canvas.height = newDimensions.height;

                    countDown();
                } else if (data.header == "spawn_apple") {
                    allApples = data.allApples;
                } else if (data.header == "play_again_request") {
                    playAgainRequested = true;
                    playAgainBtn.innerText = "Play Again (1/2)"
                } else if (data.header == "new_game") {
                    playAgainRequested = false;
                    newGame();
                }
            } else {
                console.log(data);
                updateEnemySnake(data);
            }
        });

        conn.on('error', (err) => {
            const errText = document.querySelector(".errorText");
            errText.innerText = "Connection Error..."
            errText.style.opacity = 1;
        })
    });
}

document.getElementById("joinGameBtn").onclick = () => {
    joiningGame = true;

    const joinCode = joinCodeInput.value.trim();
    if(joinCode == "" || isNaN(joinCode)){
        joinCodeInput.style.color = "#F00";
        return;
    }

    joinGameText.innerText = "Joining";
    joinGameText.classList.add("loadingText")

    // Joining Logic //

    peer = new Peer();
    peer.on('open', () => {
        conn = peer.connect(connectionString + joinCode);

        conn.on('open', () => {
            hideMenu();
            onlineUI.style.display = "block"
            conn.send({
                header: "start_game",
                screenSize: {
                    width: window.innerWidth, 
                    height: window.innerHeight
                }
            });
        });

        conn.on('data', data => {
            console.log(data);
            if(data.header){
                if(data.header == "update_game"){
                    canvas.width = data.screenSize.width;
                    canvas.height = data.screenSize.height;

                    speed = data.settings.speed;
                    pixelSize = data.settings.pixelSize;
                    lengthGain = data.settings.lengthGain;
                    applesAdded = data.settings.applesAdded;

                    countDown();
                } else if (data.header == "spawn_apple") {
                    allApples = data.allApples;
                } else if (data.header == "play_again_request") {
                    playAgainRequested = true;
                    playAgainBtn.innerText = "Play Again (1/2)"
                } else if (data.header == "new_game") {
                    playAgainRequested = false;
                    newGame();
                }
            } else {
                updateEnemySnake(data);
            }
        });

        conn.on('error', (err) => {
            const errText = document.querySelector(".errorText");
            errText.innerText = "Connection Error..."
            errText.style.opacity = 1;
        });
    });
}

function updateEnemySnake(data){
    let enemy = allSnakes[1];
    enemy.snakeSegments = data;
    enemy.dirChanges.push(structuredClone(data[0]));
}

// helper functions //

function countDown() {
    let count = 3;
    let countDownContainer = document.querySelector(".countDownContainer");
    let countDownText = document.getElementById("countDown");

    let player1Controls = document.getElementById("player1Controls");
    let player2Controls = document.getElementById("player2Controls");
    if(gameMode == GAME_MODES.TWO_LOCAL) {
        player1Controls.style.display = "block";
        player2Controls.style.display = "block";
    } else {
        player2Controls.style.display = "none";
    }

    // countDownText.style.display = "block";
    countDownContainer.style.display = "flex";
    countDownText.innerText = count;

    if (gameMode == GAME_MODES.TWO_ONLINE) {
        onlineUI.style.display = "none";
    }

    runGame = false;
    init();

    const countDownInterval = setInterval(() => {
        count--;
        if(count == 0){
            clearInterval(countDownInterval);
            runGame = true;
            // countDownText.style.display = "none";
            countDownContainer.style.display = "none";
            init();
        } else countDownText.innerText = count;
    }, 1000);
}

function resize() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}

function randFloat (min, max) {
    return Math.random() * (max - min) + min;
};

function hideMenu() {
    resize();

    document.body.style.boxShadow = "none";
    menuContainer.style.display = "none";
    gameContainer.style.display = "block";
}

function hideGameOverScreen() {
    gameOverContainer.style.display = "none";
    document.getElementById("gameOverText").style.opacity = 0;
    document.querySelector(".gameOverUIContainer").style.visibility = "hidden";
}


//==== Settings Listeners ====//

const speedDisplay = document.getElementById("speedDisplay");
const pixelSizeDisplay = document.getElementById("pixelSizeDisplay");
const lengthGainDisplay = document.getElementById("lengthGainDisplay");
const applesAddedDisplay = document.getElementById("applesAddedDisplay");

document.getElementById("settingsBtn").onclick = () => {
    let settingsContainer = document.querySelector(".settingsContainer");

    if(settingsContainer.style.opacity == "1") {
        settingsContainer.style.height = 0;
        settingsContainer.style.opacity = 0;
        settingsContainer.style.pointerEvents = "none";
    } else {
        settingsContainer.style.height = "150px";
        settingsContainer.style.opacity = 1;
        settingsContainer.style.pointerEvents = "all";
    }
}

document.getElementById("speedSlider").oninput = (e) => {
    let value = e.target.valueAsNumber;
    speedDisplay.innerText = `(${value})`;
    speed = value;
}

document.getElementById("pixelSizeSlider").oninput = (e) => {
    let value = e.target.valueAsNumber;
    pixelSizeDisplay.innerText = `(${value})`;
    pixelSize = value;
}

document.getElementById("lengthGainSlider").oninput = (e) => {
    let value = e.target.valueAsNumber;
    lengthGainDisplay.innerText = `(${value})`;
    lengthGain = value;
}

document.getElementById("applesAddedSlider").oninput = (e) => {
    let value = e.target.valueAsNumber;
    applesAddedDisplay.innerText = `(${value})`;
    applesAdded = value;
}

document.getElementById("resetSettingsBtn").onclick = () => {
    speed = 1;
    pixelSize = 10;
    lengthGain = 5;
    applesAdded = 2;
    speedDisplay.innerText = `(${speed})`;
    pixelSizeDisplay.innerText = `(${pixelSize})`;
    lengthGainDisplay.innerText = `(${lengthGain})`;
    applesAddedDisplay.innerText = `(${applesAdded})`;

    document.getElementById("speedSlider").value = speed;
    document.getElementById("pixelSizeSlider").value = pixelSize;
    document.getElementById("lengthGainSlider").value = lengthGain;
    document.getElementById("applesAddedSlider").value = applesAdded;
}