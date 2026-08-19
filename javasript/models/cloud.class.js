class Cloud extends MovableObject {
  y = 20;
  height = 250;
  width = 500;
  driftSpeed = 0.3;

  constructor() {
    super().loadImage('../assets/img/5_background/layers/4_clouds/1.png');
    this.x = Math.random() * 500;
    this.animate();
  }

  animate() {
    setInterval(() => {
      this.x -= this.driftSpeed;
    }, 1000 / 60);
  }
}
