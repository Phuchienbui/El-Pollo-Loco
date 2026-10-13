/**
 * Statusanzeige für die Lebensenergie der Figur.
 * @extends DrawableObject
 */
class StatusBar extends DrawableObject {
  IMAGES = [
    '../assets/img/7_statusbars/1_statusbar/2_statusbar_health/orange/0.png',
    '../assets/img/7_statusbars/1_statusbar/2_statusbar_health/orange/20.png',
    '../assets/img/7_statusbars/1_statusbar/2_statusbar_health/orange/40.png',
    '../assets/img/7_statusbars/1_statusbar/2_statusbar_health/orange/60.png',
    '../assets/img/7_statusbars/1_statusbar/2_statusbar_health/orange/80.png',
    '../assets/img/7_statusbars/1_statusbar/2_statusbar_health/orange/100.png',
  ];

  percentage = 100;

  /**
   * Lädt die Bilder und positioniert die Anzeige oben links mit 100 % Energie.
   */
  constructor() {
    super();
    this.loadImages(this.IMAGES);
    this.x = 30;
    this.y = 0;
    this.width = 200;
    this.height = 60;
    this.setPercentage(100);
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
   * Ermittelt den Index des Statusbildes anhand des Prozentwerts.
   * @returns {number} Index im IMAGES-Array (0 bis 5).
   */
  resolveImageIndex() {
    if (this.percentage == 100) {
      return 5;
    } else if (this.percentage >= 80) {
      return 4;
    } else if (this.percentage >= 60) {
      return 3;
    } else if (this.percentage >= 40) {
      return 2;
    } else if (this.percentage >= 20) {
      return 1;
    } else {
      return 0;
    }
  }
}
