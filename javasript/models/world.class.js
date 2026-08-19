class World {
  character = new Character();
  level = level1;
  canvas;
  ctx;
  keyboard;
  camera_x = 0;
  statusBar = new StatusBar();
  coinStatusBar = new CoinStatusBar();
  bottleStatusBar = new BottleStatusBar();
  endbossStatusBar = new EndbossStatusBar();
  endboss;
  throwableObjects = [];
  collectedCoins = 0;
  collectedBottles = 0;
  lastThrowTime = 0;
  gameOver = false;
  animationRequest;

  constructor(canvas, keyboard) {
    this.ctx = canvas.getContext('2d');
    this.canvas = canvas;
    this.keyboard = keyboard;
    this.coinStatusBar.y = 50;
    this.bottleStatusBar.y = 100;
    this.draw();
    this.setWorld();
    this.run();
  }

  setWorld() {
    this.character.world = this;
    this.level.enemies.forEach((enemy) => {
      if (enemy instanceof Endboss) {
        enemy.world = this;
        this.endboss = enemy;
      }
    });
  }

  run() {
    setInterval(() => {
      this.checkEnemyCollisions();
      this.checkThrowObjects();
    }, 200);

    setInterval(() => {
      this.checkItemCollisions();
      this.checkStompKills();
      this.checkBottleHits();
      this.cleanupBottles();
    }, 1000 / 60);

    setInterval(() => {
      this.checkGameOver();
    }, 200);
  }

  checkGameOver() {
    if (this.gameOver) {
      return;
    }
    if (this.character.isDead()) {
      this.gameOver = true;
      GameAudio.stopAll();
      GameAudio.play(GameAudio.LOSE);
      setTimeout(() => {
        showGameOverScreen();
      }, 1000);
    } else if (this.endboss && this.endboss.isDead()) {
      this.gameOver = true;
      GameAudio.stopAll();
      GameAudio.play(GameAudio.WIN);
      setTimeout(() => {
        showWinScreen();
      }, 1000);
    }
  }

  checkThrowObjects() {
    let timeSinceLastThrow = new Date().getTime() - this.lastThrowTime;
    if (this.keyboard.D && this.collectedBottles > 0 && timeSinceLastThrow > 150) {
      let bottle = new ThrowableObject(
        this.character.x + 100,
        this.character.y + 100,
      );
      this.throwableObjects.push(bottle);
      this.collectedBottles--;
      this.bottleStatusBar.setPercentage((this.collectedBottles / 6) * 100);
      this.lastThrowTime = new Date().getTime();
      GameAudio.play(GameAudio.THROW);
    }
  }

  checkEnemyCollisions() {
    if (this.character.isHurt() || this.character.isDead()) {
      return;
    }
    this.level.enemies.forEach((enemy) => {
      if (this.character.isColliding(enemy) && !this.character.isFallingOnTop(enemy)) {
        if (enemy instanceof Endboss) {
          this.character.hit();
          this.character.hit();
          this.character.hit();
        } else {
          this.character.hit();
        }
        this.statusBar.setPercentage(this.character.energy);
        GameAudio.play(GameAudio.HURT);
      }
    });
  }

  checkStompKills() {
    this.level.enemies.forEach((enemy) => {
      if (
        !(enemy instanceof Endboss) &&
        this.character.isFallingOnTop(enemy) &&
        !enemy.isDead()
      ) {
        enemy.hitpoints = 0;
        this.character.speedY = 15;
      }
    });
  }

  checkBottleHits() {
    this.throwableObjects.forEach((bottle) => {
      if (bottle.hasLanded) {
        return;
      }
      this.level.enemies.forEach((enemy) => {
        if (bottle.isColliding(enemy) && !enemy.isDead()) {
          bottle.hasLanded = true;
          if (enemy instanceof Endboss) {
            enemy.hit();
            this.endbossStatusBar.setPercentage((enemy.energy / 100) * 100);
          } else {
            enemy.hitpoints = 0;
          }
        }
      });
    });
  }

  cleanupBottles() {
    this.throwableObjects = this.throwableObjects.filter(
      (bottle) => !bottle.hasLanded || bottle.splashStep < bottle.IMAGES_SPLASH.length,
    );
    this.level.enemies = this.level.enemies.filter((enemy) => {
      if (enemy instanceof Endboss) {
        return true;
      }
      return enemy.hitpoints === undefined || enemy.hitpoints > 0;
    });
  }

  checkItemCollisions() {
    this.level.coins.forEach((coin) => {
      if (this.character.isColliding(coin) && this.collectedCoins < 6) {
        this.level.coins.splice(this.level.coins.indexOf(coin), 1);
        this.collectedCoins++;
        this.coinStatusBar.setPercentage((this.collectedCoins / 6) * 100);
        GameAudio.play(GameAudio.COIN);
      }
    });

    this.level.bottles.forEach((bottle) => {
      if (this.character.isColliding(bottle) && this.collectedBottles < 6) {
        this.level.bottles.splice(this.level.bottles.indexOf(bottle), 1);
        this.collectedBottles++;
        this.bottleStatusBar.setPercentage((this.collectedBottles / 6) * 100);
      }
    });
  }

  draw() {
    this.ctx.clearRect(0, 0, canvas.width, canvas.height);

    this.ctx.translate(this.camera_x, 0); 
    
    this.addObjectsToMap(this.level.backgroundObjects);
    this.addObjectsToMap(this.level.clouds);
    this.addToMap(this.character);
    this.addObjectsToMap(this.level.enemies);
    this.addObjectsToMap(this.level.coins);
    this.addObjectsToMap(this.level.bottles);
    this.addObjectsToMap(this.throwableObjects);

    this.ctx.translate(-this.camera_x, 0);

    this.addToMap(this.statusBar);
    this.addToMap(this.coinStatusBar);
    this.addToMap(this.bottleStatusBar);
    if (this.endboss && this.endboss.isAlerted) {
      this.addToMap(this.endbossStatusBar);
    }

    let self = this;
    this.animationRequest = requestAnimationFrame(function () {
      self.draw();
    });
  }

  addObjectsToMap(objects) {
    objects.forEach((o) => {
      this.addToMap(o);
    });
  }

  addToMap(mo) {
    if (mo.otherDirection) {
      this.flipImage(mo);
    }
    mo.draw(this.ctx);
    mo.drawFrame(this.ctx);

    if (mo.otherDirection) {
      this.flipImageBack(mo);
    }
  }

  flipImage(mo) {
    this.ctx.save();
    this.ctx.translate(mo.width, 0);
    this.ctx.scale(-1, 1);
    mo.x = mo.x * -1;
  }

  flipImageBack(mo) {
    mo.x = mo.x * -1;
    this.ctx.restore();
  }
}