let walls = [];
let walls1 = [];
let walls2 = [];
let walls3 = [];
// let ray;
// let particle;
// const fov = 45;
// const sceneW = 400;
// const sceneH = 400;
let randomMaps = false;
let population;
const learningRate = 0.05;
let doThisIfRandomMapsFalse = walls2;


function setup() {
  createCanvas(1600, 800);
  // createCanvas(sceneW*2, sceneH);
  // particle = new Particle();
  loadWalls();
  population = new Population(500);
}

function draw() {
  background(0);
  for (let wall of walls) {
    wall.show();
  }
  // for(let i = 0; i < 10; i++){
  //   population.update();
  // }
  // population.sortByFitness();
  // population.cars[0].show();
  population.update();
  population.show();
}
