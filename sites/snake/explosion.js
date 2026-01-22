

class Explosion {
    allParticles = []

    constructor(x, y, ctx, color){
        for (let i = 0; i < 3; ++i) {
            this.allParticles.push(
                new Particle(
                    x, y, 
                    this.randSpeed(-5, 5, 1), 
                    this.randSpeed(-2, 5, 1), 
                    ctx, color
                )
            );
        }
    }
    update() {
        this.allParticles.forEach((particle, i) => {
            if(particle.a <= 0) this.allParticles.splice(i, 1);

            particle.draw();
            particle.update();
        });
    }
    randSpeed(min, max, globalMin) {
        let num = (Math.random() * (max - min)) + min;
        if(Math.abs(num) < globalMin) num = (num / Math.abs(num)) 
        return num;
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
        this.da = this.randFloat(0.01, 0.05);
        
        this.size = 4;
        this.rotation = this.randFloat(0, 360);
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
    randFloat(min, max) {
        return (Math.random() * (max - min)) + min;
    }
}