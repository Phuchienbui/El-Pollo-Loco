/**
 * Flasche auf dem Boden, die der Spieler einsammeln kann.
 * @extends DrawableObject
 */
class Bottle extends DrawableObject {
  IMAGES = [
    '../assets/img/6_salsa_bottle/1_salsa_bottle_on_ground.png',
    '../assets/img/6_salsa_bottle/2_salsa_bottle_on_ground.png',
  ];

  width = 60;
  height = 60;
  y = 382;
  hitLeft = 15;
  hitRight = 15;
  hitTop = 10;
  hitBottom = 6;

  /**
   * Erstellt eine Flasche an einer zufälligen X-Position zwischen 200 und 2200.
   */
  constructor() {
    super().loadImage(this.IMAGES[0]);
    this.loadImages(this.IMAGES);
    this.x = 200 + Math.random() * 2000;
  }
}
