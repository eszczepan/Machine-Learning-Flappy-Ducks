// Funkcja resetująca
function resetGame() {
  counter = 0;
  // Resetowanie wyniku najlepszego obiektu
  if (bestDuck) {
    bestDuck.score = 0;
  }
  pipes = [];
}

// Stworzenie nowej generacji
function nextGeneration() {
  resetGame();
  // Normalizacja dopasowanie do wartości 0 - 1
  normalizeFitness(allDucks);
  // Generowanie nowych obiektów
  activeDucks = generate(allDucks);

  // Usuwanie z pamięci
  for (let duck of allDucks) {
    if (duck !== bestDuck) {
      duck.dispose();
    }
  }

  // Kopiowanie obiektów do osobnej tablicy
  allDucks = activeDucks.slice();
}

// Generowanie nowej populacji obiektów
function generate(oldDucks) {
  const newDucks = [];
  for (let i = 0; i < oldDucks.length; i++) {
    // Wybranie obiektu na podstawie dopasowania
    const duck = poolSelection(oldDucks);
    newDucks[i] = duck;
  }
  return newDucks;
}

// Normalizowanie dopasowania wszystkich obiektów
function normalizeFitness(ducks) {
  // Wynik wykładniczy
  for (let i = 0; i < ducks.length; i++) {
    ducks[i].score = pow(ducks[i].score, 2);
  }
  // Dodanie wszystkich wyników
  let sum = 0;
  for (let i = 0; i < ducks.length; i++) {
    sum += ducks[i].score;
  }
  // Podzielenie przez sum
  for (let i = 0; i < ducks.length; i++) {
    ducks[i].fitness = ducks[i].score / sum;
  }
}

// Algorytm do wybierania obiektu na podstawie dopasowania
function poolSelection(ducks) {
  // Rozpoczęcie od 0
  let index = 0;
  // Wybranie losowego numeru z zakresu 0 - 1
  let r = random(1);
  while (r > 0) {
    // ducks[index].fitness - wybór na podstawie prawodpodobieństwa
    r -= ducks[index].fitness;
    index += 1;
  }
  index -= 1;
  return ducks[index].copy();
}
