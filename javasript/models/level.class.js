/**
 * Container für die Objekte eines Levels: Gegner, Wolken, Hintergrund, Münzen und Flaschen.
 */
class Level {
  enemies;
  clouds;
  backgroundObjects;
  coins;
  bottles;
  /** X-Koordinate, an der das Level endet. */
  level_end_x = 2400;

  /**
   * Erstellt ein Level aus den übergebenen Objektlisten.
   * @param {Array<MovableObject>} enemies - Gegner des Levels.
   * @param {Array<Cloud>} clouds - Wolken des Levels.
   * @param {Array<BackgroundObject>} backgroundObjects - Hintergrundobjekte.
   * @param {Array<Coin>} coins - Münzen des Levels.
   * @param {Array<Bottle>} bottles - Flaschen des Levels.
   */
  constructor(enemies, clouds, backgroundObjects, coins, bottles) {
    this.enemies = enemies;
    this.clouds = clouds;
    this.backgroundObjects = backgroundObjects;
    this.coins = coins;
    this.bottles = bottles;
  }
}