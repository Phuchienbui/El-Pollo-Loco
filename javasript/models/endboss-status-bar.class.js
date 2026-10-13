/**
 * Statusanzeige für die Energie des Endbosses.
 * @extends DrawableObject
 */
class EndbossStatusBar extends DrawableObject {
  IMAGES = [
    '../assets/img/7_statusbars/2_statusbar_endboss/orange/orange0.png',
    '../assets/img/7_statusbars/2_statusbar_endboss/orange/orange20.png',
    '../assets/img/7_statusbars/2_statusbar_endboss/orange/orange40.png',
    '../assets/img/7_statusbars/2_statusbar_endboss/orange/orange60.png',
    '../assets/img/7_statusbars/2_statusbar_endboss/orange/orange80.png',
    '../assets/img/7_statusbars/2_statusbar_endboss/orange/orange100.png',
  ];

  percentage = 100;

  /**
   * Lädt die Bilder und positioniert die Anzeige rechts oben mit 100 % Energie.
   */
  constructor() {
    super();
    this.loadImages(this.IMAGES);
    this.x = 500;
    this.y = 0;
    this.width = 200;
    this.height = 60;
    this.setPercentage(100);
  }

  /**
   * Setzt den Füllstand und wählt das passende Statusbild.
   * @param {number} percentage - Energie in Prozent (0 bis 100).
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