class Bird {
  constructor(brain) {
    // Pozycja i wielkość obiektu
    this.x = 64;
    this.y = height / 2;
    this.r = 12;

    // Grawitacja, podnoszenie i szybkość
    this.gravity = 0.8;
    this.lift = -12;
    this.velocity = 0;

    // Czy to jest kopia obiektu czy nowy obiekt
    // Sieć neuronowa jest "mózgiem" obiektu
    if (brain instanceof NeuralNetwork) {
      this.brain = brain.copy();
      this.brain.mutate(mutateWeight);
    } else {
      this.brain = new NeuralNetwork();
    }

    // Wynik ile klatek obiekt był żywy
    this.score = 0;
    // Dopasowanie jest znormalizowanym wynikiem
    this.fitness = 0;
  }

  // Stworzenie kopii obiektu
  copy() {
    return new Bird(this.brain);
  }

  dispose() {
    this.brain.dispose();
  }

  // Wyświetlaj obiekt
  show() {
    fill(255, 100);
    stroke(255);
    ellipse(this.x, this.y, this.r * 2, this.r * 2);
  }

  save() {
    this.brain.save();
  }

  // Kluczowa funkcja decydująca czy podskoczyć czy nie
  think(pipes) {
    // Po pierwsze znalezienie najbliższej rury
    let closest = null;
    let record = Infinity;
    for (let i = 0; i < pipes.length; i++) {
      let diff = pipes[i].x - this.x;
      if (diff > 0 && diff < record) {
        record = diff;
        closest = pipes[i];
      }
    }

    if (closest != null) {
      // Stowrzenie wejść do sieci neuronowej
      let inputs = [];
      // pozycja x od najbliższej rury
      inputs[0] = map(closest.x, this.x, width, 0, 1);
      // góra najbliższej rury
      inputs[1] = map(closest.top, 0, height, 0, 1);
      // dół najbliższej rury
      inputs[2] = map(closest.bottom, 0, height, 0, 1);
      // pozycja y od najbliższej rury
      inputs[3] = map(this.y, 0, height, 0, 1);
      // szybkość y obiektu
      inputs[4] = map(this.velocity, -5, 5, 0, 1);

      // Odbierz wyjścia z sieci
      let action = this.brain.predict(inputs);
      // Decyzja czy skakać czy nie
      if (action[1] > action[0]) {
        this.up();
      }
    }
  }

  // Skok w górę
  up() {
    this.velocity += this.lift;
  }

  bottomTop() {
    // Czy obiekt umiera kiedy dotknie dołu
    return this.y > height || this.y < 0;
  }

  // Aktualizacja pozycji obiektu na podstawie grawitacji i szybkości
  update() {
    this.velocity += this.gravity;
    // this.velocity *= 0.9;
    this.y += this.velocity;

    // Zwiększaj wynik z każdą klatką
    this.score++;
  }
}
