// Funkcja resetująca
function resetGame() {
  counter = 0;
  // Resetowanie wyniku najlepszego obiektu
  if (bestBird) {
    bestBird.score = 0;
  }
  pipes = [];
}

// Stworzenie nowej generacji
function nextGeneration() {
  resetGame();
  // Normalizacja dopasowanie do wartości 0 - 1
  normalizeFitness(allBirds);
  // Generowanie nowych obiektów
  activeBirds = generate(allBirds);

  // Usuwanie z pamięci
  for (let bird of allBirds) {
    if (bird !== bestBird) {
      bird.dispose();
    }
  }

  // Kopiowanie obiektów do osobnej tablicy
  allBirds = activeBirds.slice();
}

// Generowanie nowej populacji obiektów
function generate(oldBirds) {
  let newBirds = [];
  for (let i = 0; i < oldBirds.length; i++) {
    // Wybranie obiektu na podstawie dopasowania
    let bird = poolSelection(oldBirds);
    newBirds[i] = bird;
  }
  return newBirds;
}

// Normalizowanie dopasowania wszystkich obiektów
function normalizeFitness(birds) {
  // Wynik wykładniczy
  for (let i = 0; i < birds.length; i++) {
    birds[i].score = pow(birds[i].score, 2);
  }

  // Dodanie wszystkich wyników
  let sum = 0;
  for (let i = 0; i < birds.length; i++) {
    sum += birds[i].score;
  }
  // Podzielenie przez sum
  for (let i = 0; i < birds.length; i++) {
    birds[i].fitness = birds[i].score / sum;
  }
}

// Algorytm do wybierania obiektu na podstawie dopasowania
function poolSelection(birds) {
  // Rozpoczęcie od 0
  let index = 0;

  // Wybranie losowego numeru z zakresu 0 - 1
  let r = random(1);

  // Odejmuj prawdopodobieństwo aż uzyskasz mniej niż zero
  // Wieksze prawdopodobieństwo będzie naprawione
  // Odejmuj większą liczbę aż do 0
  while (r > 0) {
    r -= birds[index].fitness;
    // Dodaj do indexu
    index += 1;
  }

  // Odejmij od indexu
  index -= 1;

  // Upewnij się że to jest kopia
  // (zawiera mutacje)
  return birds[index].copy();
}
