/**
 * Münze, die in der Luft schwebt und eingesammelt werden kann.
 * @extends DrawableObject
 */
class Coin extends DrawableObject {
  IMAGES = ['../assets/img/8_coin/coin_1.png', '../assets/img/8_coin/coin_2.png'];

  width = 100;
  height = 100;
  hitLeft = 25;
  hitRight = 25;
  hitTop = 20;
  hitBottom = 20;

  /**
   * Erstellt eine Münze an zufälliger X-Position (200 bis 2200) und Höhe (50 bis 200).
   */
  constructor() {
    super().loadImage(this.IMAGES[0]);
    this.loadImages(this.IMAGES);
    this.x = 200 + Math.random() * 2000;
    this.y = 50 + Math.random() * 150;
  }
}
