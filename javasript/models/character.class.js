class Character extends MovableObject {
  height = 250;
  y = 80;
  world;
  speed = 10;
  hitLeft = 25;
  hitRight = 25;
  hitTop = 80;
  hitBottom = 10;
  lastMovement = new Date().getTime();
  deadFrame = 0;
  animationTick = 0;

  IMAGES_WALKING = [
    '../assets/img/2_character_pepe/2_walk/W-21.png',
    '../assets/img/2_character_pepe/2_walk/W-22.png',
    '../assets/img/2_character_pepe/2_walk/W-23.png',
    '../assets/img/2_character_pepe/2_walk/W-24.png',
    '../assets/img/2_character_pepe/2_walk/W-25.png',
    '../assets/img/2_character_pepe/2_walk/W-26.png',
  ];

  IMAGES_JUMPING = [
    '../assets/img/2_character_pepe/3_jump/J-31.png',
    '../assets/img/2_character_pepe/3_jump/J-32.png',
    '../assets/img/2_character_pepe/3_jump/J-33.png',
    '../assets/img/2_character_pepe/3_jump/J-34.png',
    '../assets/img/2_character_pepe/3_jump/J-35.png',
    '../assets/img/2_character_pepe/3_jump/J-36.png',
    '../assets/img/2_character_pepe/3_jump/J-37.png',
    '../assets/img/2_character_pepe/3_jump/J-38.png',
    '../assets/img/2_character_pepe/3_jump/J-39.png',
  ];

  IMAGES_DEAD = [
    '../assets/img/2_character_pepe/5_dead/D-51.png',
    '../assets/img/2_character_pepe/5_dead/D-52.png',
    '../assets/img/2_character_pepe/5_dead/D-53.png',
    '../assets/img/2_character_pepe/5_dead/D-54.png',
    '../assets/img/2_character_pepe/5_dead/D-55.png',
    '../assets/img/2_character_pepe/5_dead/D-56.png',
    '../assets/img/2_character_pepe/5_dead/D-57.png',
  ];

  IMAGES_HURT = [
    '../assets/img/2_character_pepe/4_hurt/H-41.png',
    '../assets/img/2_character_pepe/4_hurt/H-42.png',
    '../assets/img/2_character_pepe/4_hurt/H-43.png',
  ];

  IMAGES_IDLE = [
    '../assets/img/2_character_pepe/1_idle/idle/I-1.png',
    '../assets/img/2_character_pepe/1_idle/idle/I-2.png',
    '../assets/img/2_character_pepe/1_idle/idle/I-3.png',
    '../assets/img/2_character_pepe/1_idle/idle/I-4.png',
    '../assets/img/2_character_pepe/1_idle/idle/I-5.png',
    '../assets/img/2_character_pepe/1_idle/idle/I-6.png',
    '../assets/img/2_character_pepe/1_idle/idle/I-7.png',
    '../assets/img/2_character_pepe/1_idle/idle/I-8.png',
    '../assets/img/2_character_pepe/1_idle/idle/I-9.png',
    '../assets/img/2_character_pepe/1_idle/idle/I-10.png',
  ];

  IMAGES_SLEEPING = [
    '../assets/img/2_character_pepe/1_idle/long_idle/I-11.png',
    '../assets/img/2_character_pepe/1_idle/long_idle/I-12.png',
    '../assets/img/2_character_pepe/1_idle/long_idle/I-13.png',
    '../assets/img/2_character_pepe/1_idle/long_idle/I-14.png',
    '../assets/img/2_character_pepe/1_idle/long_idle/I-15.png',
    '../assets/img/2_character_pepe/1_idle/long_idle/I-16.png',
    '../assets/img/2_character_pepe/1_idle/long_idle/I-17.png',
    '../assets/img/2_character_pepe/1_idle/long_idle/I-18.png',
    '../assets/img/2_character_pepe/1_idle/long_idle/I-19.png',
    '../assets/img/2_character_pepe/1_idle/long_idle/I-20.png',
  ];

  constructor() {
    super().loadImage('../assets/img/2_character_pepe/2_walk/W-21.png');
    this.loadImages(this.IMAGES_WALKING);
    this.loadImages(this.IMAGES_JUMPING);
    this.loadImages(this.IMAGES_DEAD);
    this.loadImages(this.IMAGES_HURT);
    this.loadImages(this.IMAGES_IDLE);
    this.loadImages(this.IMAGES_SLEEPING);
    this.applyGravity();
    this.animate();
  }

  animate() {
    setInterval(() => this.updateMovement(), 1000 / 60);
    setInterval(() => this.updateAnimation(), 100);
  }

  updateMovement() {
    if (!this.world) return;
    if (!this.isDead()) {
      this.moveByKeyboard();
      this.checkJump();
    }
    this.world.camera_x = -this.x + 100;
  }

  moveByKeyboard() {
    if (this.world.keyboard.RIGHT && this.x < this.world.level.level_end_x) {
      this.moveRight();
      this.otherDirection = false;
      this.lastMovement = new Date().getTime();
    }
    if (this.world.keyboard.LEFT && this.x > 0) {
      this.moveLeft();
      this.otherDirection = true;
      this.lastMovement = new Date().getTime();
    }
  }

  checkJump() {
    if ((this.world.keyboard.SPACE || this.world.keyboard.UP) && !this.isAboveGround()) {
      this.jump();
      GameAudio.play(GameAudio.JUMP);
      this.lastMovement = new Date().getTime();
    }
  }

  updateAnimation() {
    if (!this.world) return;
    if (this.isDead()) {
      this.playDeadAnimation();
    } else if (this.isHurt()) {
      this.playAnimation(this.IMAGES_HURT);
    } else if (this.isAboveGround()) {
      this.playAnimation(this.IMAGES_JUMPING);
    } else if (this.isWalking()) {
      this.playAnimation(this.IMAGES_WALKING);
    } else if (this.isSleeping()) {
      this.playSlowAnimation(this.IMAGES_SLEEPING, 3);
    } else {
      this.playSlowAnimation(this.IMAGES_IDLE, 2);
    }
  }

  playSlowAnimation(images, everyNthTick) {
    this.animationTick++;
    if (this.animationTick % everyNthTick === 0) {
      this.playAnimation(images);
    }
  }

  playDeadAnimation() {
    if (this.deadFrame < this.IMAGES_DEAD.length - 1) {
      this.deadFrame++;
    }
    this.img = this.imageCache[this.IMAGES_DEAD[this.deadFrame]];
  }

  isWalking() {
    return this.world.keyboard.RIGHT || this.world.keyboard.LEFT;
  }

  isSleeping() {
    let timePassed = (new Date().getTime() - this.lastMovement) / 1000;
    return timePassed > 15;
  }

  jump() {
    this.speedY = 30;
  }
}