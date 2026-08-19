const SALSA_GROUND_Y = 360;

class ThrowableObject extends MovableObject {
  height = 60;
  width = 50;
  hasLanded = false;
  splashStep = 0;
  hitLeft = 6;
  hitRight = 6;
  hitTop = 6;
  hitBottom = 6;

  IMAGES_FLYING = [
    '../assets/img/6_salsa_bottle/bottle_rotation/1_bottle_rotation.png',
    '../assets/img/6_salsa_bottle/bottle_rotation/2_bottle_rotation.png',
    '../assets/img/6_salsa_bottle/bottle_rotation/3_bottle_rotation.png',
    '../assets/img/6_salsa_bottle/bottle_rotation/4_bottle_rotation.png',
  ];

  IMAGES_SPLASH = [
    '../assets/img/6_salsa_bottle/bottle_rotation/bottle_splash/1_bottle_splash.png',
    '../assets/img/6_salsa_bottle/bottle_rotation/bottle_splash/2_bottle_splash.png',
    '../assets/img/6_salsa_bottle/bottle_rotation/bottle_splash/3_bottle_splash.png',
    '../assets/img/6_salsa_bottle/bottle_rotation/bottle_splash/4_bottle_splash.png',
    '../assets/img/6_salsa_bottle/bottle_rotation/bottle_splash/5_bottle_splash.png',
    '../assets/img/6_salsa_bottle/bottle_rotation/bottle_splash/6_bottle_splash.png',
  ];

  constructor(x, y) {
    super().loadImage(this.IMAGES_FLYING[0]);
    this.loadImages(this.IMAGES_FLYING);
    this.loadImages(this.IMAGES_SPLASH);
    this.x = x;
    this.y = y;
    this.throw();
  }

  throw() {
    this.speedY = 30;
    this.applyGravity();

    this.flightTimer = setInterval(() => {
      if (this.hasLanded) {
        return;
      }
      this.x += 10;
      if (this.y > SALSA_GROUND_Y) {
        this.hasLanded = true;
        this.speedY = 0;
      }
    }, 25);

    this.animationTimer = setInterval(() => {
      if (!this.hasLanded) {
        this.playAnimation(this.IMAGES_FLYING);
        return;
      }
      if (this.splashStep < this.IMAGES_SPLASH.length) {
        this.img = this.imageCache[this.IMAGES_SPLASH[this.splashStep]];
        this.splashStep++;
      } else {
        clearInterval(this.flightTimer);
        clearInterval(this.animationTimer);
      }
    }, 50);
  }
}
