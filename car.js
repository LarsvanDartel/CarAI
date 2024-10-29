class Car {
    constructor(x, y, angle){
        this.startPos = createVector(x, y);
        this.pos = createVector(x, y);
        this.heading = angle;
        this.rays = [];
        this.rays.push(new Ray(this.pos, -PI/2 + radians(this.heading)));
        this.rays.push(new Ray(this.pos, -PI/4 + radians(this.heading)));
        this.rays.push(new Ray(this.pos, 0 + radians(this.heading)));
        this.rays.push(new Ray(this.pos, PI/4 + radians(this.heading)));
        this.rays.push(new Ray(this.pos, PI/2 + radians(this.heading)));
        this.brain = new NeuralNetwork(5, [4, 3], 2);
        this.vel = createVector(0, 0);
        this.speed = 0;
        this.size = 25;
        this.dead = false;
        this.fitness = 0;
    }

    show(){
        if(this.dead){
            return;
        }
        noStroke();
        fill(0, 255, 0);
        push();
        translate(this.pos.x, this.pos.y);
        rectMode(CENTER);
        rotate(radians(this.heading));
        rect(0, 0, 2*this.size, this.size);
        fill(255, 255, 0);
        ellipse(this.size * 4/5, this.size/5, this.size/6, this.size/6);
        ellipse(this.size * 4/5, -this.size/5, this.size/6, this.size/6);
        pop();
        // for(let ray of this.rays){
        //     ray.show();
        // }
    }

    accelerate(n){
        let a = map(n, -1, 1, -0.1, 0.1); 
        this.speed += a;
        if(this.speed <= 0){
            this.speed = 0;
            this.dead = true;
        }
        this.vel = p5.Vector.fromAngle(radians(this.heading)).mult(this.speed);
    }

    rotate(n){
        // if(this.speed <= 0.1){
        //     return;
        // }
        let a = map(n, -1, 1, 10, -10);
        this.heading += a;
        this.heading %= 360;
        this.rays[0] = new Ray(this.pos, -PI/2 + radians(this.heading));
        this.rays[1] = new Ray(this.pos, -PI/4 + radians(this.heading));
        this.rays[2] = new Ray(this.pos, 0 + radians(this.heading));
        this.rays[3] = new Ray(this.pos, PI/4 + radians(this.heading));
        this.rays[4] = new Ray(this.pos, PI/2 + radians(this.heading));
        this.vel = p5.Vector.fromAngle(radians(this.heading)).mult(this.speed);
    }

    update(){
        this.checkCollisions();
        if(this.dead){
            return;
        }
        let input = [];
        for (let i = 0; i < this.rays.length; i++) {
            const ray = this.rays[i];
            let closest = null;
            let record = Infinity;
            for (let wall of walls) {
                const pt = ray.cast(wall);
                if (pt) {
                    const d = p5.Vector.dist(this.pos, pt);
                    if (d < record) {
                        record = d;
                        closest = pt;
                    }
                }
            }
            // if (closest) {
            //     stroke(255);
            //     fill(255);
            //     ellipse(closest.x, closest.y, 4, 4);
            //     line(this.pos.x, this.pos.y, closest.x, closest.y);
            // }
            input[i] = record;
        }
        let output = this.brain.feedForward(input);
        let throttle = output[0];
        let steering = output[1];

        this.accelerate(throttle);
        this.rotate(steering);
        if(this.startPos.dist(this.pos) > 100){
            this.fitness += this.speed;
        }
        this.pos.add(this.vel);
    }

    lineLine(x1, y1, x2, y2, x3, y3, x4, y4) {
        let uA = ((x4-x3)*(y1-y3) - (y4-y3)*(x1-x3)) / ((y4-y3)*(x2-x1) - (x4-x3)*(y2-y1));
        let uB = ((x2-x1)*(y1-y3) - (y2-y1)*(x1-x3)) / ((y4-y3)*(x2-x1) - (x4-x3)*(y2-y1));
      
        if (uA >= 0 && uA <= 1 && uB >= 0 && uB <= 1) {
          return true;
        }
        return false;
    }

    lineThis(x1, y1, x2, y2){   
        const x3 = -this.size;
        const y3 = this.size/2;
        const x4 = -this.size;
        const y4 = -this.size/2;
        const x5 = this.size;
        const y5 = -this.size/2;
        const x6 = this.size;
        const y6 = this.size/2;

        const cost = cos(radians(this.heading));
        const sint = sin(radians(this.heading));

        const rx3 = this.pos.x + x3 * cost - y3 * sint;
        const ry3 = this.pos.y + x3 * sint + y3 * cost;
        const rx4 = this.pos.x + x4 * cost - y4 * sint;
        const ry4 = this.pos.y + x4 * sint + y4 * cost;
        const rx5 = this.pos.x + x5 * cost - y5 * sint;
        const ry5 = this.pos.y + x5 * sint + y5 * cost;
        const rx6 = this.pos.x + x6 * cost - y6 * sint;
        const ry6 = this.pos.y + x6 * sint + y6 * cost;

        let left = this.lineLine(x1,y1,x2,y2, rx3,ry3,rx4,ry4);
        let right = this.lineLine(x1,y1,x2,y2, rx4,ry4,rx5,ry5);
        let top = this.lineLine(x1,y1,x2,y2, rx5,ry5,rx6,ry6);
        let bottom = this.lineLine(x1,y1,x2,y2, rx6,ry6,rx3,ry3);
        if (left || right || top || bottom) {
          return true;
        }
        return false;
    }

    checkCollisions(){
        for(let wall of walls){
            if(this.lineThis(wall.a.x, wall.a.y, wall.b.x, wall.b.y)){
                this.dead = true;
                this.speed = 0;
                this.fitness -= this.speed * 500;
                return;
            }
        }
        if (this.lineThis(30, 375, 230, 375) && (this.heading < 0 && this.heading > -180 || this.heading > 180)) {
            this.dead = true;
            this.speed = 0;
            this.fitness -= this.speed * 500;
            return;
        }
    }

}