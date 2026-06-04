// URL to explain PHASER scene: https://rexrainbow.github.io/phaser3-rex-notes/docs/site/scene/

export default class Game extends Phaser.Scene {
  constructor() {
    super("game");
  }

  init() {
  this.itemsRecolectados = 0;
}

  preload() {
  this.load.tilemapTiledJSON("map", "public/assets/tilemap/map.json");
  this.load.image("bg", "public/assets/bg.png");
  this.load.image("tileset", "public/assets/tiles.png");
  this.load.image("key", "public/assets/key.png");
  this.load.spritesheet("dude", "public/assets/pj.png", {
    frameWidth: 16,
    frameHeight: 16,
  });
}

  create() {
    const map = this.make.tilemap({ key: "map" });

    // Parameters are the name you gave the tileset in Tiled and then the key of the tileset image in
    // Phaser's cache (i.e. the name you used in preload)
    const tileset = map.addTilesetImage("tiles", "tileset");
    this.add.image(400, 288, "bg");
    const platformLayer = map.createLayer("walls", tileset, 0, 0);
    const objectsLayer = map.getObjectLayer("obj");

    // Find in the Object Layer, the name "dude" and get position
    const spawnPoint = map.findObject(
      "obj",
      (obj) => obj.name === "player"
    );
    console.log("spawnPoint", spawnPoint);

    this.player = this.physics.add.sprite(spawnPoint.x, spawnPoint.y, "dude");

    this.player.setCollideWorldBounds(true);

    this.anims.create({
  key: "walk",
  frames: this.anims.generateFrameNumbers("dude", { start: 0, end: 3 }),
  frameRate: 10,
  repeat: -1,
});

    this.cursors = this.input.keyboard.createCursorKeys();

    platformLayer.setCollisionByProperty({ esColisionable: true });
    this.physics.add.collider(this.player, platformLayer);

    // tiles marked as colliding
    /*
    const debugGraphics = this.add.graphics().setAlpha(0.75);
    platformLayer.renderDebug(debugGraphics, {
      tileColor: null, // Color of non-colliding tiles
      collidingTileColor: new Phaser.Display.Color(243, 134, 48, 255), // Color of colliding tiles
      faceColor: new Phaser.Display.Color(40, 39, 37, 255), // Color of colliding face edges
    });
    */

    // Create empty group of starts
    this.items = this.physics.add.group();

objectsLayer.objects.forEach((objData) => {
  
  const { x = 0, y = 0, name, type } = objData;
  switch (type) {
    case "key": {
      const item = this.items.create(x, y, "key");
      item.body.setAllowGravity(false);
      break;
    }
    case "llegada": {
      this.llegada = this.physics.add.sprite(x, y, null);
      this.llegada.setVisible(false);
      this.llegada.body.setAllowGravity(false);
      break;
    }
  }
});

this.physics.add.overlap(this.player, this.items, this.collectItem, null, this);
this.physics.add.overlap(this.player, this.llegada, this.checkWin, null, this);
this.physics.add.collider(this.items, platformLayer);

    this.itemsText = this.add.text(16, 16, `Items: ${this.itemsRecolectados}/5`, {
  fontSize: "16px",
  fill: "#fff",
  });
  }

  update() {
  this.player.setVelocity(0);

  if (this.cursors.left.isDown) {
    this.player.setVelocityX(-160);
    this.player.anims.play("walk", true);
  } else if (this.cursors.right.isDown) {
    this.player.setVelocityX(160);
    this.player.anims.play("walk", true);
  } else if (this.cursors.up.isDown) {
    this.player.setVelocityY(-160);
    this.player.anims.play("walk", true);
  } else if (this.cursors.down.isDown) {
    this.player.setVelocityY(160);
    this.player.anims.play("walk", true);
  } else {
    this.player.anims.stop();
  }
}

  collectItem(player, item) {
  item.disableBody(true, true);
  this.itemsRecolectados += 1;
  this.itemsText.setText(`Items: ${this.itemsRecolectados}/5`);
}

checkWin(player, llegada) {
  if (this.itemsRecolectados >= 5) {
    this.scene.start("endScene");
  } else {
    const centerX = this.scale.width / 2;
    const centerY = this.scale.height / 2;

    const texto = this.add.text(centerX, centerY, 
      `Te faltan ${5 - this.itemsRecolectados} llaves`, {
      fontSize: "32px",
      fill: "#ff0000",
    }).setOrigin(0.5);

    this.time.delayedCall(2000, () => {
      texto.destroy();
    });
  }
}
}
