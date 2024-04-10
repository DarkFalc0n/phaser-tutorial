class Game extends Phaser.Scene {
  preload() {
    this.load.image("dino", "assets/dino.png");
    this.load.image("sky", "assets/sky.png");
    this.load.image("ground", "assets/ground.png");
    this.load.image("cactus", "assets/cactus.png");
  }
  create() {
    this.add.image(400, 300, "sky").setScrollFactor(0);

    this.prevGround = this.physics.add
      .image(-400, 600 - 20, "ground")
      .setGravityY(0)
      .setImmovable(true);

    this.currGround = this.physics.add
      .image(400, 600 - 20, "ground")
      .setGravityY(0)
      .setImmovable(true);

    this.nextGround = this.physics.add
      .image(1200, 600 - 20, "ground")
      .setGravityY(0)
      .setImmovable(true);

    this.dino = this.physics.add
      .image(64, 600 - 114, "dino")
      .setGravityY(1500)
      .setVelocity(300, 0);

    this.dino.body.width = 90;

    this.physics.add.collider(this.dino, this.prevGround);
    this.physics.add.collider(this.dino, this.currGround);
    this.physics.add.collider(this.dino, this.nextGround);

    this.cameras.main.startFollow(this.dino, true, 1, 0, 0, 300 - 114);

    this.cactusArray = [];

    this.scoreText = this.add
      .text(12, 12, "Score: 0", {
        fontSize: "32px",
        fill: "#000",
      })
      .setScrollFactor(0);
  }
  update() {
    if (
      this.input.keyboard.addKey("SPACE").isDown &&
      this.dino.y >= 600 - 114
    ) {
      this.jump(this.dino);
    }

    this.updateGroundPosition();

    this.updateCactusArray();

    this.score = Math.floor(this.dino.x / 100);
    this.scoreText.setText("Score: " + this.score);
  }

  jump() {
    this.dino.setVelocityY(-700);
  }

  updateGroundPosition() {
    if (this.dino.x > this.currGround.x) {
      this.prevGround.x = this.nextGround.x + 800;
      let temp = this.nextGround;
      this.nextGround = this.prevGround;
      this.prevGround = this.currGround;
      this.currGround = temp;
    }
  }

  updateCactusArray() {
    if (
      this.cactusArray.length === 0 ||
      this.cactusArray[this.cactusArray.length - 1].x < this.dino.x + 400
    ) {
      let nextCactusX = this.dino.x + 800 + Math.floor(Math.random() * 400 + 1);
      this.addCactus(nextCactusX);
      return;
    }

    if (this.cactusArray[0].x < this.dino.x - 400) {
      this.cactusArray.shift().destroy();
    }
  }

  addCactus(xPos) {
    let cactus = this.physics.add
      .image(xPos, 600 - 70, "cactus")
      .setGravityY(0)
      .setImmovable(true);
    this.cactusArray.push(cactus);
    this.physics.add.collider(this.dino, cactus, () => {
      this.dino.setVelocity(0, 0);
    });
  }
}

const config = {
  type: Phaser.AUTO,
  width: 800,
  height: 600,
  scene: Game,
  physics: {
    default: "arcade",
    arcade: {
      gravity: { y: 0 },
      debug: true,
    },
  },
};

const game = new Phaser.Game(config);
