/**
 * Statusanzeige für die Anzahl gesammelter Münzen.
 * @extends DrawableObject
 */
class CoinStatusBar extends DrawableObject {
  IMAGES = [
    '../assets/img/7_statusbars/1_statusbar/1_statusbar_coin/orange/0.png',
    '../assets/img/7_statusbars/1_statusbar/1_statusbar_coin/orange/20.png',
    '../assets/img/7_statusbars/1_statusbar/1_statusbar_coin/orange/40.png',
    '../assets/img/7_statusbars/1_statusbar/1_statusbar_coin/orange/60.png',
    '../assets/img/7_statusbars/1_statusbar/1_statusbar_coin/orange/80.png',
    '../assets/img/7_statusbars/1_statusbar/1_statusbar_coin/orange/100.png',
  ];

  percentage = 0;

  /**
   * Lädt die Bilder und positioniert die Anzeige oben links mit 0 % Füllstand.
   */
  constructor() {
    super();
    this.loadImages(this.IMAGES);
    this.x = 30;
    this.y = 0;
    this.width = 200;
    this.height = 60;
    this.setPercentage(0);
  }

  /**
   * Setzt den Füllstand und wählt das passende Statusbild.
   * @param {number} percentage - Füllstand in Prozent (0 bis 100).
   */
  setPercentage(percentage) {
    this.percentage = percentage;
    let path = this.IMAGES[this.resolveImageIndex()];
    this.img = this.imageCache[path];
  }

  /**
   * Ermittelt den Index des Statusbildes proportional zum Prozentwert; sechs Münzen entsprechen 100 %.
   * @returns {number} Index im IMAGES-Array (0 bis 5).
   */
  resolveImageIndex() {
    return Math.min(5, Math.round(this.percentage / (100 / 6)));
  }
}
