/** @type {Level|undefined} Das aktuell geladene Level 1. */
let level1;

/** Erstellt Level 1 mit Gegnern, Wolken, Hintergrund, Münzen und Flaschen. */
function initLevel() {
  level1 = new Level(
    createEnemies(),
    createClouds(),
    createBackgroundObjects(),
    createCoins(),
    createBottles(),
  );
}

/**
 * Erzeugt sechs Hühner (abwechselnd Chicken und ChickenSmall) und den Endboss.
 * @returns {Array<Object>} Liste aller Gegner.
 */
function createEnemies() {
  let enemies = [];
  for (let i = 0; i < 6; i++) {
    if (i % 2 === 0) {
      enemies.push(new Chicken());
    } else {
      enemies.push(new ChickenSmall());
    }
  }
  enemies.push(new Endboss());
  return enemies;
}

/**
 * Erzeugt acht Wolken.
 * @returns {Array<Cloud>} Liste der Wolken.
 */
function createClouds() {
  let clouds = [];
  for (let i = 0; i < 8; i++) {
    clouds.push(new Cloud());
  }
  return clouds;
}

/**
 * Erzeugt die Hintergrundobjekte für die Abschnitte mit Index -1 bis 7.
 * @returns {Array<BackgroundObject>} Liste aller Hintergrundobjekte.
 */
function createBackgroundObjects() {
  let objects = [];
  for (let i = -1; i < 8; i++) {
    objects = objects.concat(createBackgroundLayers(i));
  }
  return objects;
}

/**
 * Erzeugt die vier Hintergrundebenen (Luft und drei Schichten) an der Position index * 719.
 * @param {number} index - Abschnittsindex; gerade Indizes nutzen Variante '1', ungerade Variante '2'.
 * @returns {Array<BackgroundObject>} Die vier Ebenen des Abschnitts.
 */
function createBackgroundLayers(index) {
  let x = 719 * index;
  let variant = '2';
  if (index % 2 === 0) {
    variant = '1';
  }
  return [
    new BackgroundObject(backgroundPath('air'), x),
    new BackgroundObject(backgroundPath('3_third_layer/' + variant), x),
    new BackgroundObject(backgroundPath('2_second_layer/' + variant), x),
    new BackgroundObject(backgroundPath('1_first_layer/' + variant), x),
  ];
}

/**
 * Liefert den Pfad einer Hintergrundgrafik im Ordner 5_background/layers.
 * @param {string} name - Dateiname ohne Endung, ggf. mit Unterordner.
 * @returns {string} Relativer Pfad zur PNG-Datei.
 */
function backgroundPath(name) {
  return '../assets/img/5_background/layers/' + name + '.png';
}

/**
 * Erzeugt fünf Münzen im Abstand von 800 Pixel, beginnend bei x = 600.
 * @returns {Array<Coin>} Liste der Münzen.
 */
function createCoins() {
  let coins = [];
  for (let i = 0; i < 5; i++) {
    coins.push(new Coin(600 + i * 800));
  }
  return coins;
}

/**
 * Erzeugt 16 Flaschen im Abstand von 250 Pixel, beginnend bei x = 400.
 * @returns {Array<Bottle>} Liste der Flaschen.
 */
function createBottles() {
  let bottles = [];
  for (let i = 0; i < 16; i++) {
    bottles.push(new Bottle(400 + i * 250));
  }
  return bottles;
}