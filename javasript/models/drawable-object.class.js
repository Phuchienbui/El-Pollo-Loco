/**
 * Basisklasse für alle zeichenbaren Spielobjekte mit Position, Größe und Trefferbox.
 */
class DrawableObject {
  img;
  /** Vorgeladene Bilder, indiziert nach Dateipfad. */
  imageCache = {};
  /** Index des aktuell angezeigten Frames einer Animation. */
  currentImage = 0;
  x = 120;
  y = 280;
  height = 150;
  width = 100;
  /** Abstände der Trefferbox zu den vier Objekträndern in Pixel (Insets). */
  hitTop = 0;
  hitBottom = 0;
  hitLeft = 0;
  hitRight = 0;

  /**
   * Lädt ein einzelnes Bild und setzt es als aktuell angezeigtes Bild.
   * @param {string} path - Pfad zur Bilddatei.
   */
  loadImage(path) {
    this.img = new Image();
    this.img.src = path;
  }

  /**
   * Lädt mehrere Bilder vor und legt sie im imageCache ab.
   * @param {string[]} arr - Liste der Bildpfade.
   */
  loadImages(arr) {
    arr.forEach((path) => {
      let img = new Image();
      img.src = path;
      this.imageCache[path] = img;
    });
  }

  /**
   * Zeichnet das aktuelle Bild an Position x/y mit der eingestellten Breite und Höhe.
   * @param {CanvasRenderingContext2D} ctx - Zeichenkontext des Canvas.
   */
  draw(ctx) {
    ctx.drawImage(this.img, this.x, this.y, this.width, this.height);
  }

  /**
   * Zeichnet im Debug-Modus einen blauen Rahmen um Character, Chicken, ChickenSmall und Endboss.
   * @param {CanvasRenderingContext2D} ctx - Zeichenkontext des Canvas.
   */
  drawFrame(ctx) {
    if (!debugMode) {
      return;
    }
    if (
      this instanceof Character ||
      this instanceof Chicken ||
      this instanceof ChickenSmall ||
      this instanceof Endboss
    ) {
      ctx.beginPath();
      ctx.lineWidth = '5';
      ctx.strokeStyle = 'blue';
      ctx.rect(this.x, this.y, this.width, this.height);
      ctx.stroke();
    }
  }
}
