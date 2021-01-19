// Jak duża jest populacja
let totalPopulation = 200;
// Aktywne obiekty (te które nie miały kolizji z rurą)
let activeDucks = [];
// Kopia wszystkich elementów danej populacji (potrzebna dla algorytmu genetycznego, gdyż z activeDucks są usuwane obiekty)
let allDucks = [];
// Pipes
let pipes = [];
// Licznik klatek żeby wiedzieć czy generować następną rurę
let counter = 0;

// Elementy interfejsu wspomagające
let speedSlider;
let speedSpan;
let highScoreSpan;
let allTimeHighScoreSpan;

// Najlepszy wynik
let highScore = 0;

// Trenować czy pokazywać obecnie najlepszy
let runBest = false;
let runBestButton;
let saveButton;
let generation = 1;

let bg;
let img;

function preload() {
  img = loadImage("./duck.svg");
}

function setup() {
  bg = loadImage("./bg.png");
  let canvas = createCanvas(600, 400);
  tf.setBackend("cpu");
  canvas.parent("canvascontainer");
  // Dostęp do elementów interfajsu
  speedSlider = select("#speedSlider");
  speedSpan = select("#speed");
  highScoreSpan = select("#hs");
  allTimeHighScoreSpan = select("#ahs");
  runBestButton = select("#best");
  gen = select("#gen");
  runBestButton.mousePressed(toggleState);

  // Stworzenie populacji
  for (let i = 0; i < totalPopulation; i++) {
    let duck = new Duck();
    activeDucks[i] = duck;
    allDucks[i] = duck;
  }
}

// Toggle zmiany stanu symulacji
function toggleState() {
  runBest = !runBest;
  // Pokazywanie najlepszego obiektu
  if (runBest) {
    resetGame();
    runBestButton.html("Continue training");
    // Jeżeli nie to trenuj dalej
  } else {
    nextGeneration();
    runBestButton.html("Save model");
  }
}

function draw() {
  background(bg);

  // Czy powinniśmy zwiększyć szybkość cykli na klatke
  let cycles = speedSlider.value();
  speedSpan.html(cycles);

  // Ile razy pójść do przodu w grze
  for (let n = 0; n < cycles; n++) {
    // Pokazywanie wszystkich rur
    for (let i = pipes.length - 1; i >= 0; i--) {
      pipes[i].update();
      if (pipes[i].offscreen()) {
        pipes.splice(i, 1);
      }
    }
    // Jeżeli pozwalamy najlepszemu obiektowi grać
    if (runBest) {
      bestDuck.think(pipes);
      bestDuck.update();
      for (let j = 0; j < pipes.length; j++) {
        // Reset gry jeżeli wystąpiła kolizja z rurą
        if (pipes[j].hits(bestDuck)) {
          resetGame();
          break;
        }
      }

      if (bestDuck.bottomTop()) {
        resetGame();
      }
      // Jeżeli pozwalamy wszystkim obiektom grać
    } else {
      for (let i = activeDucks.length - 1; i >= 0; i--) {
        let duck = activeDucks[i];
        duck.think(pipes);
        duck.update();

        // Sprawdzenie wszystkich rur
        for (let j = 0; j < pipes.length; j++) {
          // Kolizja z rurą
          if (pipes[j].hits(activeDucks[i])) {
            // Usunięcue wszystkich obiektów
            activeDucks.splice(i, 1);
            break;
          }
        }

        if (duck.bottomTop()) {
          activeDucks.splice(i, 1);
        }
      }
    }

    // Dodawanie nowych rur
    if (counter % 75 == 0) {
      pipes.push(new Pipe());
    }
    counter++;
  }

  // Jaki  jest najlepszy wynik obecnej populacji
  let tempHighScore = 0;
  // Jeżeli trenujemy obiekty
  if (!runBest) {
    // Który obiekt jest najlepszy
    let tempbestDuck = null;
    for (let i = 0; i < activeDucks.length; i++) {
      let s = activeDucks[i].score;
      if (s > tempHighScore) {
        tempHighScore = s;
        tempbestDuck = activeDucks[i];
      }
    }

    // Czy obecny obiekt ma lepszy wynik od najlepszego poprzedniego
    if (tempHighScore > highScore) {
      highScore = tempHighScore;
      bestDuck = tempbestDuck;
    }
  } else {
    // Jeden obiekt najlepszy dotychczas
    tempHighScore = bestDuck.score;
    if (tempHighScore > highScore) {
      highScore = tempHighScore;
    }
  }

  // Aktualizowanie elementów DOM
  highScoreSpan.html(Math.floor(tempHighScore));
  allTimeHighScoreSpan.html(Math.floor(highScore));

  // Rysowanie wszystkiego
  for (let i = 0; i < pipes.length; i++) {
    pipes[i].show();
  }

  if (runBest) {
    bestDuck.show();
  } else {
    for (let i = 0; i < activeDucks.length; i++) {
      activeDucks[i].show();
    }
    // Pojawienie się nowej generacji jeżeli nie ma aktywnych obiektów
    if (activeDucks.length == 0) {
      nextGeneration();
      generation++;
      gen.html(`${generation}`);
    }
  }
}
