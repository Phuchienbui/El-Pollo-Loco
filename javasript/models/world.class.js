/**
 * Spielwelt: verwaltet Figur, Level, Statusanzeigen, Kollisionen, Wurfobjekte und das Zeichnen auf dem Canvas.
 */
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

  /**
   * Initialisiert die Welt, positioniert die Münz- und Flaschenanzeige und startet Zeichnen und Spielschleifen.
   * @param {HTMLCanvasElement} canvas - Canvas-Element, auf das gezeichnet wird.
   * @param {Keyboard} keyboard - Tastatur-Zustand des Spielers.
   */
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

  /**
   * Verknüpft die Figur und den Endboss des Levels mit dieser Welt.
   */
  setWorld() {
    this.character.world = this;
    this.level.enemies.forEach((enemy) => {
      if (enemy instanceof Endboss) {
        enemy.world = this;
        this.endboss = enemy;
      }
    });
  }

  /**
   * Startet die Spielintervalle für Gegner- und Wurfprüfung, Item- und Treffer-Logik sowie die Spielende-Prüfung.
   */
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

  /**
   * Prüft Niederlage (Figur tot) und Sieg (Endboss tot), spielt die passende Audioausgabe und zeigt danach den Endscreen.
   */
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

  /**
   * Erzeugt eine Wurfflasche, wenn die Taste D gedrückt ist, Flaschen vorhanden sind und seit dem letzten Wurf mehr als 150 ms vergangen sind.
   */
  checkThrowObjects() {
    let timeSinceLastThrow = new Date().getTime() - this.lastThrowTime;
    if (this.keyboard.D && this.collectedBottles > 0 && timeSinceLastThrow > 150) {
      let bottle = new ThrowableObject(
        this.character.x + 60,
        this.character.y + 60,
      );
      this.throwableObjects.push(bottle);
      this.collectedBottles--;
      this.bottleStatusBar.setPercentage((this.collectedBottles / 6) * 100);
      this.lastThrowTime = new Date().getTime();
      GameAudio.play(GameAudio.THROW);
    }
  }

  /**
   * Fügt der Figur Schaden zu, wenn sie einen Gegner berührt und nicht von oben auf ihn fällt. Der Endboss verursacht dreifachen Schaden.
   */
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

  /**
   * Tötet normale Gegner, auf die die Figur von oben fällt, und lässt die Figur abprallen.
   */
  checkStompKills() {
    this.level.enemies.forEach((enemy) => {
      if (
        !(enemy instanceof Endboss) &&
        this.character.isFallingOnTop(enemy) &&
        !enemy.isDead()
      ) {
        enemy.hitpoints = 0;
        this.character.speedY = 15;
        GameAudio.play(GameAudio.CHICKEN);
      }
    });
  }

  /**
   * Prüft, ob gelandete Flaschen Gegner treffen. Der Endboss verliert Energie, andere Gegner werden getötet.
   */
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
            GameAudio.play(GameAudio.BOSS_HIT);
          } else {
            enemy.hitpoints = 0;
            GameAudio.play(GameAudio.CHICKEN);
          }
        }
      });
    });
  }

  /**
   * Entfernt Flaschen, die gelandet und vollständig zersplittert sind, sowie tote Gegner. Der Endboss bleibt erhalten.
   */
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

  /**
   * Sammelt Münzen und Flaschen ein, solange weniger als 6 eingesammelt sind, und aktualisiert die Statusanzeigen.
   */
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
        GameAudio.play(GameAudio.BOTTLE);
      }
    });
  }

  /**
   * Zeichnet einen Frame mit Hintergrund, Figur, Gegnern und Items (kamera-versetzt) sowie den Statusanzeigen und plant den nächsten Frame.
   */
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

  /**
   * Zeichnet alle Objekte einer Liste über addToMap.
   * @param {Array<DrawableObject>} objects - Liste der zu zeichnenden Objekte.
   */
  addObjectsToMap(objects) {
    objects.forEach((o) => {
      this.addToMap(o);
    });
  }

  /**
   * Zeichnet ein einzelnes Objekt auf den Canvas und spiegelt es bei Bedarf in Blickrichtung.
   * @param {DrawableObject} mo - Das zu zeichnende Objekt.
   */
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

  /**
   * Spiegelt den Canvas horizontal für das Objekt (Zustand wird gespeichert) und kehrt dessen x-Position um.
   * @param {DrawableObject} mo - Das zu spiegelnde Objekt.
   */
  flipImage(mo) {
    this.ctx.save();
    this.ctx.translate(mo.width, 0);
    this.ctx.scale(-1, 1);
    mo.x = mo.x * -1;
  }

  /**
   * Kehrt die x-Position des Objekts zurück und stellt den vorherigen Canvas-Zustand wieder her.
   * @param {DrawableObject} mo - Das zuvor gespiegelte Objekt.
   */
  flipImageBack(mo) {
    mo.x = mo.x * -1;
    this.ctx.restore();
  }
}