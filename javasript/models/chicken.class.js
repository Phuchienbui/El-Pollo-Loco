class Chicken extends MovableObject {
  y = 370;
  height = 60;
  width = 100;
  hitpoints = 1;
  hitLeft = 12;
  hitRight = 12;
  hitTop = 4;
  hitBottom = 4;

  IMAGES_WALKING = [
    '../assets/img/3_enemies_chicken/chicken_normal/1_walk/1_w.png',
    '../assets/img/3_enemies_chicken/chicken_normal/1_walk/2_w.png',
    '../assets/img/3_enemies_chicken/chicken_normal/1_walk/3_w.png',
  ];

  IMAGE_SQUASHED = '../assets/img/3_enemies_chicken/chicken_normal/2_dead/dead.png';

  constructor() {
    super().loadImage(this.IMAGES_WALKING[0]);
    this.loadImages(this.IMAGES_WALKING);
    this.x = 500 + Math.random() * 1700;
    this.speed = 0.15 + Math.random() + 0.5;
    this.animate();
  }

  animate() {
    setInterval(() => {
      if (this.hitpoints > 0) {
        this.moveLeft();
      }
    }, 1000 / 60);

    setInterval(() => {
      if (this.hitpoints <= 0) {
        this.img = this.imageCache[this.IMAGE_SQUASHED];
      } else {
        this.playAnimation(this.IMAGES_WALKING);
      }
    }, 200);
  }

  isDead() {
    return this.hitpoints <= 0;
  }

  takeDamage() {
    this.hitpoints--;
  }
}
