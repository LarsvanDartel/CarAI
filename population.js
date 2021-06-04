class Population{
    constructor(size){
        this.size = size;
        this.cars = [];
        for(let i = 0; i < size; i++){
            this.cars[i] = new Car(100, 400, 90);
        }
        this.generation = 1;
        this.startFrame = 0;
        this.chooseRandomMap();
    }
    update(){
        for(let car of this.cars){
            car.update();
        }
        if(this.allDead() || (frameCount - this.startFrame)%1800 == 0){
            this.startFrame = frameCount;
            this.generation++;
            this.sortByFitness();
            console.log('Best fitness of generation ' + (this.generation-1) + ' was ' + floor(this.cars[0].fitness));
            console.log(this.cars[0]);            
            this.mutateRandomly();
            this.resetCars();
            this.chooseRandomMap();
            if(this.generation > 500){
                randomMaps = true;
            }
        }
    }

    chooseRandomMap(){
        if(!randomMaps){
            walls = doThisIfRandomMapsFalse;
            return;
        }
        if(Math.random() < 0.33){
            walls = walls1;
        } else if(Math.random() < 0.5){
            walls = walls2;
        } else {
            walls = walls3;
        }
    }


    mutateRandomly(){

        // let sumOfFitness = 0;
        // for(let car of this.cars){
        //     sumOfFitness += car.fitness;
        // }   

        // for(let i = 1; i < this.size; i++){
        //     let targetFitness = random(sumOfFitness);
        //     let currentFitness = 0;
        //     for(let j = 0; j < this.size; j++){
        //         currentFitness += this.cars[j].fitness;
        //         if(currentFitness >= targetFitness){
        //             this.cars[i].brain = this.cars[j].brain.copy();
        //         }
        //     }
            
        // }

        const toKeep = 10;

        for(let i = toKeep; i < this.size; i++){
            this.cars[i].brain = this.cars[i%toKeep].brain.copy();
            this.cars[i].brain.randomizeAgain();
        }
        for(let i = 1; i < this.size; i++){
            this.cars[i].brain = this.cars[0].brain.copy();
            this.cars[i].brain.randomizeAgain();
        }
    }

    resetCars(){
        for(let car of this.cars){
            car.pos = createVector(100, 400);
            car.heading = 90;
            car.speed = 0;
            car.rotate(random(-10, 10));
            car.vel.set(0, 0);
            car.dead = false;
            car.fitness = 0;
        }
    }

    sortByFitness(){
        this.cars.sort(function(a, b){
            return b.fitness - a.fitness;
        });
    }

    show(){
        for(let car of this.cars){
            car.show();
        }
    }
    allDead(){
        for(let car of this.cars){
            if((!car.dead) || car.speed > 0.1){
                return false;
            }
        }
        return true;
    }
}