class BackgroundObject extends MovableObject {
  width = 720;
  height = 500;

  constructor(imagePath, x, y) {
    super().loadImage(imagePath);
    this.x = x;
    this.y = this.calculateGroundY();
  }

  calculateGroundY() {
    const groundLevel = 500;
    return groundLevel - this.height;
  }
}
