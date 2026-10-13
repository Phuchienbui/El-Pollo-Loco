/**
 * Spielfigur Pepe: steuert Bewegung, Sprung, Animationen und Schnarchsound per Tastatur.
 * @extends MovableObject
 */
class Character extends MovableObject {
  height = 250;
  y = 80;
  /** Referenz auf die Spielwelt mit Tastatur, Level und Kamera. */
  world;
  speed = 10;
  hitLeft = 25;
  hitRight = 25;
  hitTop = 80;
  hitBottom = 10;
  /** Zeitstempel (ms seit 1970) der letzten Bewegung; steuert den Schlafzustand. */
  lastMovement = new Date().getTime();
  /** Index des aktuellen Frames der Todesanimation. */
  deadFrame = 0;
  /** Zähler für langsamere Animationen (siehe playSlowAnimation). */
  animationTick = 0;

  /** Bildpfade der Animationen (Gehen, Springen, Tod, Verletzt, Idle, Schlafen). */
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

  /**
   * Lädt alle Animationsbilder und startet Schwerkraft sowie die Animationsschleifen.
   */
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

  /** Startet die Intervalle für Bewegung (60 Mal pro Sekunde) und Animation (alle 100 ms). */
  animate() {
    setInterval(() => this.updateMovement(), 1000 / 60);
    setInterval(() => this.updateAnimation(), 100);
  }

  /** Verarbeitet pro Tick Tastatureingaben und Sprung und richtet die Kamera an der Figur aus. */
  updateMovement() {
    if (!this.world) return;
    if (!this.isDead()) {
      this.moveByKeyboard();
      this.checkJump();
    }
    this.world.camera_x = -this.x + 100;
  }

  /** Bewegt die Figur nach links oder rechts, solange die Pfeiltaste gedrückt ist und das Levelende bzw. der Rand nicht überschritten wird. */
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

  /** Startet einen Sprung, wenn Leertaste oder Pfeil nach oben gedrückt ist und die Figur am Boden steht. */
  checkJump() {
    if ((this.world.keyboard.SPACE || this.world.keyboard.UP) && !this.isAboveGround()) {
      this.jump();
      GameAudio.play(GameAudio.JUMP);
      this.lastMovement = new Date().getTime();
    }
  }

  /** Wählt je nach Zustand (tot, verletzt, in der Luft, gehend, schlafend, Idle) die passende Animation. */
  updateAnimation() {
    if (!this.world) return;
    this.updateSnoreSound();
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

  /** Startet den Schnarchsound, wenn die Figur schläft, und stoppt ihn, wenn sie nicht mehr schläft. */
  updateSnoreSound() {
    let isSnoring =
      !this.isDead() && !this.isHurt() && !this.isAboveGround() && !this.isWalking() && this.isSleeping();
    if (isSnoring && GameAudio.SNORE.paused) {
      GameAudio.play(GameAudio.SNORE);
    } else if (!isSnoring && !GameAudio.SNORE.paused) {
      GameAudio.stop(GameAudio.SNORE);
    }
  }

  /**
   * Spielt eine Animation verlangsamt ab, indem nur bei jedem n-ten Tick ein Frame gewechselt wird.
   * @param {string[]} images - Bildpfade der Animation.
   * @param {number} everyNthTick - Anzahl der Ticks zwischen zwei Frame-Wechseln.
   */
  playSlowAnimation(images, everyNthTick) {
    this.animationTick++;
    if (this.animationTick % everyNthTick === 0) {
      this.playAnimation(images);
    }
  }

  /** Spielt die Todesanimation Frame für Frame ab und bleibt beim letzten Frame stehen. */
  playDeadAnimation() {
    if (this.deadFrame < this.IMAGES_DEAD.length - 1) {
      this.deadFrame++;
    }
    this.img = this.imageCache[this.IMAGES_DEAD[this.deadFrame]];
  }

  /**
   * Prüft, ob die Pfeiltaste nach links oder rechts gedrückt ist.
   * @returns {boolean} true, wenn sich die Figur per Tastatur bewegt.
   */
  isWalking() {
    return this.world.keyboard.RIGHT || this.world.keyboard.LEFT;
  }

  /**
   * Prüft, ob seit mehr als 15 Sekunden keine Bewegung stattgefunden hat.
   * @returns {boolean} true, wenn die Figur schläft.
   */
  isSleeping() {
    let timePassed = (new Date().getTime() - this.lastMovement) / 1000;
    return timePassed > 15;
  }

  /** Startet einen Sprung, indem speedY auf 30 gesetzt wird. */
  jump() {
    this.speedY = 30;
  }
}