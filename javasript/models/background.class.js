/**
 * Hintergrundobjekt (z. B. Gebäude oder Landschaft), das am Boden ausgerichtet wird.
 * @extends MovableObject
 */
class BackgroundObject extends MovableObject {
  width = 720;
  height = 500;

  /**
   * Lädt das Bild und setzt die X-Position; die Y-Position wird am Boden berechnet.
   * @param {string} imagePath - Pfad zur Bilddatei.
   * @param {number} x - X-Position des Objekts.
   * @param {number} y - Y-Position; wird durch calculateGroundY überschrieben.
   */
  constructor(imagePath, x, y) {
    super().loadImage(imagePath);
    this.x = x;
    this.y = this.calculateGroundY();
  }

  /**
   * Berechnet die Y-Position, sodass die Unterkante des Objekts bei Y=500 liegt.
   * @returns {number} Y-Position des Objekts.
   */
  calculateGroundY() {
    const groundLevel = 500;
    return groundLevel - this.height;
  }
}
