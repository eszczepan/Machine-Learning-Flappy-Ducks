class Pipe {
  constructor() {
    // Jak duża jest przerwa między rurami
    let spacing = 125;
    // Gdzie jest środek pustego miejsca
    let centery = random(spacing, height - spacing);

    // Góra i dół rury
    this.top = centery - spacing / 2;
    this.bottom = height - (centery + spacing / 2);
    // Początek krawędzi
    this.x = width;
    // Szerokość rury
    this.w = 80;
    // Szybkość
    this.speed = 6;
  }

  // Funkcja sprawdzająca czy rura dotkęła obiekt
  hits(bird) {
    if (bird.y - bird.r < this.top || bird.y + bird.r > height - this.bottom) {
      if (bird.x > this.x && bird.x < this.x + this.w) {
        return true;
      }
    }
    return false;
  }

  // Rysowanie rury
  show() {
    stroke(255);
    fill(200);
    rect(this.x, 0, this.w, this.top);
    rect(this.x, height - this.bottom, this.w, this.bottom);
  }

  // Aktualizacja rury
  update() {
    this.x -= this.speed;
  }

  // Funkcja sprawdzająca czy rura jest poza obszarem ekranu
  offscreen() {
    if (this.x < -this.w) {
      return true;
    } else {
      return false;
    }
  }
}
