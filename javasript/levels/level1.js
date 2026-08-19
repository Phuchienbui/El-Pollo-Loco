let level1;

function initLevel() {
  level1 = new Level(
    createEnemies(),
    createClouds(),
    createBackgroundObjects(),
    createCoins(),
    createBottles(),
  );
}

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

function createClouds() {
  let clouds = [];
  for (let i = 0; i < 8; i++) {
    clouds.push(new Cloud());
  }
  return clouds;
}

function createBackgroundObjects() {
  let objects = [];
  for (let i = -1; i < 8; i++) {
    objects = objects.concat(createBackgroundLayers(i));
  }
  return objects;
}

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

function backgroundPath(name) {
  return '../assets/img/5_background/layers/' + name + '.png';
}

function createCoins() {
  let coins = [];
  for (let i = 0; i < 5; i++) {
    coins.push(new Coin(600 + i * 800));
  }
  return coins;
}

function createBottles() {
  let bottles = [];
  for (let i = 0; i < 16; i++) {
    bottles.push(new Bottle(400 + i * 250));
  }
  return bottles;
}