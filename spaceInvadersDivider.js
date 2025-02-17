var tabbedOut = false;

document.addEventListener("visibilitychange", () => {            
    if (document.hidden) tabbedOut = true;
    else tabbedOut = false;
});

function randFloat(min, max) {
    return (Math.random() * (max - min)) + min;
}

function randSpeed(min, max, globalMin) {
    let num = (Math.random() * (max - min)) + min;

    if(Math.abs(num) < globalMin) num = (num / Math.abs(num)) 

    return num;
}

class SpaceInvaders {
    idealPixelSize = 12; // pixels will shoot for approximately this size based on screen width and number of pixels

    lasers = [];
    explosions = [];
    allPixels = [];
    pixelDimensions = [150, 10];

    playerPos;
    pixelSize;
    targetPixel;

    shootWaitOver = true;

    constructor(canvas, pixelColor){
        this.canvas = canvas;
        this.ctx = canvas.getContext("2d");
        this.pixelColor = pixelColor;

        window.addEventListener("resize", this.resize);

        this.init();
    }

    init() {
        this.resize();
        this.generatePixels();
        this.targetPixel = this.findTargetPixel();

        this.draw();

        // separate loop to control movement speed while still moving on pixel grid
        setInterval(this.playerNavigation, 50);
    }

    playerNavigation = () => {
        let targetX = Math.round(this.targetPixel.x * this.pixelSize);
        let playerX = Math.round(this.playerPos.x + this.pixelSize);

        let shootPercent = 0.25;

        if(targetX > playerX) {
            this.playerPos.x += this.pixelSize;
            if(Math.random() > 1 - shootPercent && this.shootWaitOver) this.shoot();

        } else if (targetX < playerX) {
            this.playerPos.x -= this.pixelSize;

            if(Math.random() > 1 - shootPercent && this.shootWaitOver) this.shoot();
        } else if(this.shootWaitOver && !tabbedOut) {
            this.shoot();
            this.targetPixel = this.findTargetPixel();
        }
    }

    shoot() {
        // shootWait allows control of shoot speed 
        this.lasers.push({x: this.playerPos.x + (this.pixelSize * 1.35), y: this.playerPos.y});
        this.shootWaitOver = false;
        setTimeout(() => {this.shootWaitOver = true;}, 150);
    }

    resize = () => {
        let pageWidth = document.documentElement.clientWidth;
    
        let pixelsAcross = Math.round(pageWidth / this.idealPixelSize);
    
        this.pixelDimensions[0] = pixelsAcross;
        this.pixelSize = pageWidth / pixelsAcross;
    
        // generate more pixels in the list if the page becomes larger than it was first generated as
        if(this.allPixels.length != 0 && pixelsAcross > this.allPixels[0].length){
            let len = this.allPixels[0].length;
            for(let i = 0; i < this.pixelDimensions[1]; ++i){
                for(let j = len; j < pixelsAcross; ++j){
                    if(i > 3 && ((this.allPixels[i - 1][j] == 1 && Math.random() > 0.75) || this.allPixels[i - 1][j] == 0)){ 
                        this.allPixels[i].push(0); 
                    } else {
                        this.allPixels[i].push(1); 
                    }
                }
            }
        }
    
        this.canvas.width = pageWidth;
        this.canvas.height = window.innerHeight / 4;
    
        if (this.playerPos === undefined) {
            // set initial player position to the center (closest pixel)
            this.playerPos = {x: Math.round((this.canvas.width / 2) / this.pixelSize) * this.pixelSize, y: this.canvas.height - this.pixelSize};
        } else {
            // ensure player is still aligned to pixel grid on resize
            this.playerPos.x = Math.round(this.playerPos.x / this.pixelSize) * this.pixelSize;
        }
    
    }

    draw = () => {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    
        // lasers
        this.ctx.fillStyle = "#ff0000";
        for (let i = 0; i < this.lasers.length; i++) {
    
            this.lasers[i].y -= 4;
            this.ctx.fillRect(this.lasers[i].x + (this.pixelSize / 15), this.lasers[i].y - (this.pixelSize * 1) , this.pixelSize / 5, this.pixelSize);
    
            // check offscreen
            if (this.lasers[i].y < -10) {
                this.lasers.splice(i, 1);
                break;
            }
    
            // check collisions 
            for(let j = 0; j < this.pixelDimensions[1]; ++ j){
                let pixelPosX = Math.round(this.lasers[i].x / this.pixelSize);
    
                if (this.allPixels[j][pixelPosX] && this.lasers[i].y < (j * this.pixelSize) + this.pixelSize) {
    
                    this.explosions.push(new Explosion(this.lasers[i].x, j * this.pixelSize, this.ctx, this.pixelColor));
                    
                    this.allPixels[j][pixelPosX] = 0;
                    this.lasers.splice(i, 1);
    
                    if(j == 1) {
                        this.addRow();
                        this.addRow();
                    }
                    break;
                }
            }
            
        }
    
        // pixels
        this.ctx.fillStyle = this.pixelColor;
        for (let i = 0; i < this.pixelDimensions[1]; ++i) {
            for (let j = 0; j < this.pixelDimensions[0]; ++j) {
                // add extra size (0.9) because js canvas sizing on floating point positions leaves odd spaces between pixels
                if (this.allPixels[i][j]) this.ctx.fillRect(j * this.pixelSize, i * this.pixelSize, this.pixelSize + 0.9, this.pixelSize + 0.9); 
            }
        }
    
        // player
        this.ctx.fillStyle = "#00FF00";
        this.ctx.fillRect(this.playerPos.x, this.playerPos.y, this.pixelSize * 3, this.pixelSize);
        this.ctx.fillRect(this.playerPos.x + (this.pixelSize / 3.6), this.playerPos.y - (this.pixelSize / 3) + 1, this.pixelSize * 2.5, this.pixelSize / 3);
        
        this.ctx.fillRect(this.playerPos.x + (this.pixelSize * 1.13), this.playerPos.y - (this.pixelSize / 1.4), this.pixelSize / 1.25, this.pixelSize / 1.5);
        this.ctx.fillRect(this.playerPos.x + (this.pixelSize * 1.36), this.playerPos.y - this.pixelSize, this.pixelSize / 3, this.pixelSize / 1.5);
    
        // explosions
        if(this.explosions.length > 0){
            this.explosions.forEach((explosion, i) => {
                if(explosion.allParticles.length == 0) this.explosions.splice(i, 1);
                else explosion.update()
            });
        }
        
        requestAnimationFrame(this.draw);
    }

    generatePixels(){
        for (let i = 0; i < this.pixelDimensions[1]; ++i) {
            let temp = [];
    
            for (let j = 0; j < this.pixelDimensions[0]; ++j) {
                let startLevel = 3;
                let deadChance = 0.50;
                
                // 0 for dead 1 for alive
                if(i > startLevel && ((this.allPixels[i - 1][j] == 1 && Math.random() > 1 - deadChance) || this.allPixels[i - 1][j] == 0)){ 
                    temp.push(0); 
                } else {
                    temp.push(1); 
                }
            }
            this.allPixels.push(temp);
        }
    }

    // look for lowest pixel based on distance from player
    findTargetPixel() {
        for(let i = this.pixelDimensions[1] - 1; i >= 0; --i){
            let pixelsLeft = [];
    
            for(let j = 0; j < this.pixelDimensions[0]; ++j){
                if (this.allPixels[i][j]) pixelsLeft.push({x: j, y: i});
            }
    
            switch (pixelsLeft.length) {
                case 0:
                    continue;
                case 1:
                    return pixelsLeft[0];
                default:
                    return this.getClosest(pixelsLeft);
    
            }
        }
    }

    // binary search
    getClosest(points){
        // since playPos starts at left side it may be biased left
    
        let l = 0, r = points.length - 1, target = (this.playerPos.x / this.pixelSize);
    
        while (l < r) {
            let mid = Math.floor((l + r) / 2);
    
            if (points[mid].x === target) return points[mid];
            else if (points[mid].x < target) l = mid + 1;
            else r = mid;
        }
    
        if (l > 0) {
            const prevDiff = Math.abs(points[l - 1].x - target);
            const currDiff = Math.abs(points[l].x - target);
            if (prevDiff < currDiff) {
                return points[l - 1];
            }
        }
    
        return points[l];
    }

    addRow() {
        for(let i = this.pixelDimensions[1] - 1; i > 0; --i){
            for(let j = 0; j < this.pixelDimensions[0]; ++j){
                this.allPixels[i][j] = this.allPixels[i - 1][j];
            }
        }
    }
}

class Explosion {
    constructor(x, y, ctx, color){
        this.allParticles = [];

        for (let i = 0; i < 3; ++i) {
            this.allParticles.push(new Particle(x, y, randSpeed(-5, 5, 1), randSpeed(-2, 5, 1), ctx, color));
        }
    }
    update() {
        this.allParticles.forEach((particle, i) => {
            if(particle.a <= 0) this.allParticles.splice(i);

            particle.draw();
            particle.update();
        });
    }
}

class Particle {
    constructor(x, y, dx, dy, ctx, color) {
        this.color = color;
        this.ctx = ctx;

        this.x = x;
        this.y = y;
        this.a = 1;

        this.dx = dx;
        this.dy = dy;
        this.da = randFloat(0.01, 0.05);
        
        this.size = 4;
        this.rotation = randFloat(0, 360);

    }
    update() {
        this.x += this.dx;
        this.y += this.dy;
        this.a -= this.da;

        if(this.a < 0) this.a = 0;
    }
    draw() {
        this.ctx.fillStyle = this.color;
        
        this.ctx.save();
        
        this.ctx.globalAlpha = this.a;
        
        this.ctx.translate(this.x + (this.size / 2), this.y + (this.size / 2));
        this.ctx.rotate(this.rotation * Math.PI / 180);
        
        this.ctx.fillRect(-this.size, -this.size, this.size, this.size);
        
        this.ctx.restore();
    }
}