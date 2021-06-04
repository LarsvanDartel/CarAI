class Particle {
    constructor() {
      this.pos = createVector(sceneW / 2, sceneH / 2);
      this.rays = [];
      this.heading = 0;
      for (let a = -fov/2; a < fov/2; a += 1) {
        this.rays.push(new Ray(this.pos, radians(a)));
      }
    }
    walk(speed){
        const movementDir = p5.Vector.fromAngle(this.heading);
        movementDir.mult(speed);
        this.pos.add(movementDir);
    }
    rotate(angle){
        this.heading += angle;
        for(let i = 0; i < this.rays.length; i++){
            this.rays[i].setAngle(radians(i-fov/2) + this.heading);
        }
    }

    update(x, y) {
      this.pos.set(x, y);
    }
  
    look(walls) {
      let scene = [];
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
        if (closest) {
        //   colorMode(HSB);
        //   stroke((i + frameCount * 2) % 360, 255, 255, 50);
          stroke(255, 100);
          line(this.pos.x, this.pos.y, closest.x, closest.y);
        }
        scene[i] = record;
      }
      return scene;
    }
  
    show() {
      fill(255);
      ellipse(this.pos.x, this.pos.y, 4);
      for (let ray of this.rays) {
        ray.show();
      }
    }
  }