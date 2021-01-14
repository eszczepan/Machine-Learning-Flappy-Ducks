class Bird {
  constructor(brain) {
    // Pozycja i wielkość obiektu
    this.x = 64;
    this.y = height / 2;
    this.r = 12;
    this.gravity = 0.8; // grawitacja
    this.lift = -12; // wartość podnoszenia agenta
    this.velocity = 0; // szybkość agenta

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
    // fill(0, 255);
    // stroke(255);
    // ellipse(this.x, this.y, this.r * 2, this.r * 2);
    image(img, this.x, this.y, this.r * 2, this.r * 2);
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
      // Obliczenie dystansu między obiektem a rurami
      let distance = pipes[i].x + pipes[i].w - this.x;
      // Jeżeli dystans jest większy od 0 i mniejszy od zanotowanego wcześniej dystansu
      if (distance > 0 && distance < record) {
        record = distance;
        closest = pipes[i];
      }
    }
    // Jeżeli istnieje najbliższa rura
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
      let outputs = this.brain.predict(inputs);
      // Decyzja czy skakać czy nie
      if (outputs[1] > outputs[0]) {
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
