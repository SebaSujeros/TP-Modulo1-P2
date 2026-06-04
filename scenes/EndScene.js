export default class EndScene extends Phaser.Scene {
  constructor() {
    super("endScene");
  }

  create() {
    const centerX = this.scale.width / 2;
    const centerY = this.scale.height / 2;

    this.add.text(centerX, centerY - 60, "¡Ganaste!", {
      fontSize: "48px",
      fill: "#fff",
    }).setOrigin(0.5);

    this.add.text(centerX, centerY, "Juntaste las 5 llaves", {
      fontSize: "24px",
      fill: "#fff",
    }).setOrigin(0.5);

    const boton = this.add.text(centerX, centerY + 60, "[ Reiniciar ]", {
      fontSize: "24px",
      fill: "#ff0",
    }).setOrigin(0.5).setInteractive();

    boton.on("pointerdown", () => {
      this.scene.start("game");
    });

    boton.on("pointerover", () => boton.setStyle({ fill: "#f90" }));
    boton.on("pointerout", () => boton.setStyle({ fill: "#ff0" }));
  }
}