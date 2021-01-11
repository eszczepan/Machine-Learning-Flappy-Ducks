// Jak duża jest populacja
let totalPopulation = 100;
// Aktywne obiekty (te które nie miały kolizji z rurą)
let activeBirds = [];
// Kopia wszystkich elementów danej populacji (potrzebna dla algorytmu genetycznego, gdyż z activeBirds są usuwane obiekty)
let allBirds = [];
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

let bg;
let img;

function preload() {
  img = loadImage("./bird.png");
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
  runBestButton.mousePressed(toggleState);

  // Stworzenie populacji
  for (let i = 0; i < totalPopulation; i++) {
    let bird = new Bird();
    activeBirds[i] = bird;
    allBirds[i] = bird;
  }
}

// Toggle zmiany stanu symulacji
function toggleState() {
  runBest = !runBest;
  // Pokazywanie najlepszego obiektu
  if (runBest) {
    resetGame();
    runBestButton.html("continue training");
    // Jeżeli nie to trenuj dalej
  } else {
    nextGeneration();
    runBestButton.html("run best");
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
      bestBird.think(pipes);
      bestBird.update();
      for (let j = 0; j < pipes.length; j++) {
        // Reset gry jeżeli wystąpiła kolizja z rurą
        if (pipes[j].hits(bestBird)) {
          resetGame();
          break;
        }
      }

      if (bestBird.bottomTop()) {
        resetGame();
      }
      // Jeżeli pozwalamy wszystkim obiektom grać
    } else {
      for (let i = activeBirds.length - 1; i >= 0; i--) {
        let bird = activeBirds[i];
        // Obiekt używa swojego "mózgu" czyli sieci neuronowej
        bird.think(pipes);
        bird.update();

        // Sprawdzenie wszystkich rur
        for (let j = 0; j < pipes.length; j++) {
          // Kolizja z rurą
          if (pipes[j].hits(activeBirds[i])) {
            // Usunięcue wszystkich obiektów
            activeBirds.splice(i, 1);
            break;
          }
        }

        if (bird.bottomTop()) {
          activeBirds.splice(i, 1);
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
    let tempBestBird = null;
    for (let i = 0; i < activeBirds.length; i++) {
      let s = activeBirds[i].score;
      if (s > tempHighScore) {
        tempHighScore = s;
        tempBestBird = activeBirds[i];
      }
    }

    // Czy obecny obiekt ma lepszy wynik od najlepszego poprzedniego
    if (tempHighScore > highScore) {
      highScore = tempHighScore;
      bestBird = tempBestBird;
    }
  } else {
    // Jeden obiekt najlepszy dotychczas
    tempHighScore = bestBird.score;
    if (tempHighScore > highScore) {
      highScore = tempHighScore;
    }
  }

  // Aktualizowanie elementów DOM
  highScoreSpan.html(tempHighScore);
  allTimeHighScoreSpan.html(highScore);

  // Rysowanie wszystkiego
  for (let i = 0; i < pipes.length; i++) {
    pipes[i].show();
  }

  if (runBest) {
    bestBird.show();
  } else {
    for (let i = 0; i < activeBirds.length; i++) {
      activeBirds[i].show();
    }
    // Pojawienie się nowej generacji jeżeli nie ma aktywnych obiektów
    if (activeBirds.length == 0) {
      nextGeneration();
      console.log("Next generation");
    }
  }
}
