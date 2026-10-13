/** Y-Koordinate, auf der Charaktere am Boden stehen. */
const CHARACTER_GROUND_Y = 198;

/**
 * Basisklasse für bewegliche Objekte mit Schwerkraft, Trefferprüfung und Lebensenergie.
 * @extends DrawableObject
 */
class MovableObject extends DrawableObject {
  /** Horizontale Bewegungsgeschwindigkeit in Pixel pro Schritt. */
  speed = 0.15;
  /** Blickrichtung: true, wenn das Objekt nach links schaut. */
  otherDirection = false;
  /** Vertikale Geschwindigkeit; positive Werte bewegen nach oben. */
  speedY = 0;
  /** Wert, der pro Schritt von speedY abgezogen wird (Schwerkraft). */
  acceleration = 2.5;
  /** Lebensenergie von 0 bis 100. */
  energy = 100;
  /** Zeitstempel (ms seit 1970) des letzten Treffers. */
  lastHit = 0;

  /**
   * Startet einen Intervall-Loop, der Sprung- und Fallbewegung mit 25 Schritten pro Sekunde berechnet.
   */
  applyGravity() {
    setInterval(() => {
      if (this.isAboveGround() || this.speedY > 0) {
        this.y -= this.speedY;
        this.speedY -= this.acceleration;
      } else {
        this.y = CHARACTER_GROUND_Y;
        this.speedY = 0;
      }
    }, 1000 / 25);
  }

  /**
   * Prüft, ob das Objekt über dem Boden schwebt. Wurfobjekte gelten immer als in der Luft.
   * @returns {boolean} true, wenn das Objekt über der Bodenlinie ist.
   */
  isAboveGround() {
    if (this instanceof ThrowableObject) {
      return true;
    } else {
      return this.y < CHARACTER_GROUND_Y;
    }
  }

  /**
   * Prüft, ob sich die Trefferboxen dieses Objekts und des übergebenen Objekts überschneiden.
   * @param {DrawableObject} mo - Das Objekt, mit dem die Kollision geprüft wird.
   * @returns {boolean} true bei Überlappung der Trefferboxen.
   */
  isColliding(mo) {
    return (
      this.x + this.width - this.hitRight > mo.x + mo.hitLeft &&
      this.y + this.height - this.hitBottom > mo.y + mo.hitTop &&
      this.x + this.hitLeft < mo.x + mo.width - mo.hitRight &&
      this.y + this.hitTop < mo.y + mo.height - mo.hitBottom
    );
  }

  /**
   * Prüft, ob das Objekt fallend (speedY < 0) von oben auf mo trifft.
   * @param {DrawableObject} mo - Das Objekt, auf dem das Objekt landen könnte.
   * @returns {boolean} true, wenn die Kollision von oben erfolgt.
   */
  isFallingOnTop(mo) {
    return (
      this.isColliding(mo) &&
      this.isAboveGround() &&
      this.speedY < 0 &&
      this.y < mo.y
    );
  }

  /**
   * Reduziert die Energie um 5 und speichert bei verbleibender Energie den Zeitpunkt des Treffers.
   */
  hit() {
    this.energy -= 5;
    if (this.energy < 0) {
      this.energy = 0;
    } else {
      this.lastHit = new Date().getTime();
    }
  }

  /**
   * Prüft, ob der letzte Treffer weniger als 0,2 Sekunden zurückliegt.
   * @returns {boolean} true, solange das Objekt als verletzt gilt.
   */
  isHurt() {
    let timepassed = new Date().getTime() - this.lastHit;
    timepassed = timepassed / 1000;
    return timepassed < 0.2;
  }

  /**
   * Prüft, ob die Lebensenergie auf 0 gesunken ist.
   * @returns {boolean} true, wenn das Objekt tot ist.
   */
  isDead() {
    return this.energy == 0;
  }

  /**
   * Zeigt den nächsten Frame aus der Bildliste und erhöht den Frame-Zähler.
   * @param {string[]} images - Pfade der Bilder der Animation.
   */
  playAnimation(images) {
    let i = this.currentImage % images.length;
    let path = images[i];
    this.img = this.imageCache[path];
    this.currentImage++;
  }

  /** Bewegt das Objekt um speed nach rechts. */
  moveRight() {
    this.x += this.speed;
  }

  /** Bewegt das Objekt um speed nach links. */
  moveLeft() {
    this.x -= this.speed;
  }

  /** Startet einen Sprung, indem speedY auf 30 gesetzt wird. */
  jump() {
    this.speedY = 30;
  }
}