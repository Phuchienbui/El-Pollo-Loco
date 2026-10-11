class Endboss extends MovableObject {
  height = 400;
  width = 250;
  y = 55;
  speed = 2;
  world;
  isAlerted = false;
  energy = 100;
  isHurtNow = false;
  hitLeft = 40;
  hitRight = 30;
  hitTop = 60;
  hitBottom = 15;

  IMAGES_WALKING = [
    '../assets/img/4_enemie_boss_chicken/1_walk/G1.png',
    '../assets/img/4_enemie_boss_chicken/1_walk/G2.png',
    '../assets/img/4_enemie_boss_chicken/1_walk/G3.png',
    '../assets/img/4_enemie_boss_chicken/1_walk/G4.png',
  ];

  IMAGES_ATTACK = [
    '../assets/img/4_enemie_boss_chicken/3_attack/G13.png',
    '../assets/img/4_enemie_boss_chicken/3_attack/G14.png',
    '../assets/img/4_enemie_boss_chicken/3_attack/G15.png',
    '../assets/img/4_enemie_boss_chicken/3_attack/G16.png',
    '../assets/img/4_enemie_boss_chicken/3_attack/G17.png',
    '../assets/img/4_enemie_boss_chicken/3_attack/G18.png',
    '../assets/img/4_enemie_boss_chicken/3_attack/G19.png',
    '../assets/img/4_enemie_boss_chicken/3_attack/G20.png',
  ];

  IMAGES_HURT = [
    '../assets/img/4_enemie_boss_chicken/4_hurt/G21.png',
    '../assets/img/4_enemie_boss_chicken/4_hurt/G22.png',
    '../assets/img/4_enemie_boss_chicken/4_hurt/G23.png',
  ];

  IMAGES_DEAD = [
    '../assets/img/4_enemie_boss_chicken/5_dead/G24.png',
    '../assets/img/4_enemie_boss_chicken/5_dead/G25.png',
    '../assets/img/4_enemie_boss_chicken/5_dead/G26.png',
  ];

  constructor() {
    super().loadImage(this.IMAGES_WALKING[0]);
    this.loadImages(this.IMAGES_WALKING);
    this.loadImages(this.IMAGES_ATTACK);
    this.loadImages(this.IMAGES_HURT);
    this.loadImages(this.IMAGES_DEAD);
    this.x = 2500;
    this.animate();
  }

  hit() {
    this.energy -= 20;
    if (this.energy < 0) {
      this.energy = 0;
    }
    this.isHurtNow = true;
    setTimeout(() => {
      this.isHurtNow = false;
    }, 500);
  }

  isDead() {
    return this.energy <= 0;
  }

  animate() {
    setInterval(() => {
      if (
        !this.isAlerted &&
        this.world &&
        this.world.character.x > this.x - 600
      ) {
        this.isAlerted = true;
        GameAudio.play(GameAudio.BOSS_ALERT);
      }

      if (this.isAlerted && !this.isDead()) {
        if (this.world.character.x < this.x) {
          this.moveLeft();
          this.otherDirection = false;
        } else {
          this.moveRight();
          this.otherDirection = true;
        }
      }
    }, 1000 / 60);

    setInterval(() => {
      if (this.isDead()) {
        this.playAnimation(this.IMAGES_DEAD);
      } else if (this.isHurtNow) {
        this.playAnimation(this.IMAGES_HURT);
      } else if (this.world && this.world.character.isColliding(this)) {
        this.playAnimation(this.IMAGES_ATTACK);
      } else if (this.isAlerted) {
        this.playAnimation(this.IMAGES_WALKING);
      }
    }, 200);
  }
}
