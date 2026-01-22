class Snake {
    snakeSegments = [];
    dirChanges = [];
    hitSelf = false;

    constructor(x, y, startingDir, color, ctx, speed = 1, pixelSize = 10) {
        this.startX = x;
        this.startY = y;
        this.startingDir = startingDir;
        this.color = color;
        this.ctx = ctx;
        this.speed = speed;
        this.pixelSize = pixelSize;

        this.init();
    }

    init() {
        for(let i = 0; i < 3; ++i) {
            this.snakeSegments.push({
                x: this.startX + (this.startingDir.x * this.pixelSize * -i), 
                y: this.startX + (this.startingDir.y * this.pixelSize * -i), 
                dir: {
                    x: this.startingDir.x,
                    y: this.startingDir.y,
                }
            });
        }
    }

    update() {
        drawSnake();
        allExplosions.forEach((explosion, i) => {
            if(explosion.allParticles.length == 0) allExplosions.splice(i, 1);
            else explosion.update();
        });
    }

    drawSnake() {
        ctx.fillStyle = this.color

        for (let i = 0; i < this.snakeSegments.length; ++i) {
            let seg = this.snakeSegments[i];

            if (i != 0) {
                let dirChange = null;
                let minDist = 1;

                this.dirChanges.forEach((dirCng, j) => {
                    let xDiff = Math.abs(seg.x - dirCng.x);
                    let yDiff = Math.abs(seg.y - dirCng.y);
                    let tot = xDiff + yDiff;

                    const distTolerance = 0.1;
                    if(tot <= distTolerance && tot < minDist) {
                        minDist = tot;
                        dirChange = dirCng;

                        // remove turn point once tail passes
                        if(i == this.snakeSegments.length - 1) this.dirChanges.splice(j, 1);
                    }
                });

                if (dirChange) {
                    seg.dir.x = dirChange.dirX;
                    seg.dir.y = dirChange.dirY;
                    seg.x = dirChange.x;
                    seg.y = dirChange.y;
                }

                if(this.selfCollision(seg)) this.hitSelf = true;
            }

            seg.x += this.speed * seg.dir.x;
            seg.y += this.speed * seg.dir.y;

            ctx.beginPath();
            ctx.rect(seg.x, seg.y, this.pixelSize, this.pixelSize);
            ctx.fill();
        }
    }

    hitBoundary() {
        let head = this.snakeSegments[0];
            
        // boundary collisions
        let outOfXBounds = head.x > window.innerWidth || head.x < 0;
        let outofYBounds = head.y < 0 || head.y > window.innerHeight;
        if(outOfXBounds || outofYBounds) return true;
        return false;
    }

    selfCollision(seg) {
        const tolerance = 0.1;
        let head = this.snakeSegments[0];

        let headBox = {
            x: head.x,
            y: head.y,
        }
        let segBox = {
            x: seg.x,
            y: seg.y,
        }

        if(head.dir.y != 0){
            if (head.dir.y == 1) headBox.y += this.pixelSize;
            else if (head.dir.y == -1) segBox.y += this.pixelSize;
            let xDiff = Math.abs(headBox.x - segBox.x);
            let yDiff = Math.abs(headBox.y - segBox.y);

            if(yDiff < tolerance && xDiff < this.pixelSize) return true;
        } else if(head.dir.x != 0){
            if (head.dir.x == 1) headBox.x += this.pixelSize;
            else if (head.dir.x == -1) segBox.x += this.pixelSize;
            let xDiff = Math.abs(headBox.x - segBox.x);
            let yDiff = Math.abs(headBox.y - segBox.y);

            if(xDiff < tolerance && yDiff < this.pixelSize) return true;
        }
        
        return false;
    }

    enemyCollision(segments) {
        let collision = false
        segments.forEach(seg => {
            if(this.selfCollision(seg)) collision = true;
        });
        return collision;
    }

    addLength(len) {
        for(let i = 0; i < len; ++i){
            let tailSeg = this.snakeSegments[this.snakeSegments.length - 1];
            let newSeg = {
                x: tailSeg.x + (tailSeg.dir.x * this.pixelSize * -1),
                y: tailSeg.y + (tailSeg.dir.y * this.pixelSize * -1),
                dir: { 
                    x: tailSeg.dir.x,
                    y: tailSeg.dir.y,
                },
            }
            this.snakeSegments.push(newSeg);
        }
    }
}