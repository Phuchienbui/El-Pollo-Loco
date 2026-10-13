/**
 * Wolke, die langsam nach links driftet.
 * @extends MovableObject
 */
class Cloud extends MovableObject {
  y = 20;
  height = 250;
  width = 500;
  driftSpeed = 0.3;

  /**
   * Erstellt eine Wolke an zufälliger Startposition und startet ihre Bewegung.
   */
  constructor() {
    super().loadImage('../assets/img/5_background/layers/4_clouds/1.png');
    this.x = Math.random() * 500;
    this.animate();
  }

  /**
   * Verschiebt die Wolke etwa alle 16 ms um driftSpeed nach links.
   */
  animate() {
    setInterval(() => {
      this.x -= this.driftSpeed;
    }, 1000 / 60);
  }
}
