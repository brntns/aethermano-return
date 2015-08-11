module.exports = {
  draw: function (game) {
    this.game = game;
    this.arrow = game.add.image(game.world.centerX - 100, game.world.centerY, 'skull');
    this.arrow.anchor.setTo(0.5, 0.5);
    this.arrow.moveDelay = 200;
    this.arrow.canMove = true;
    this.arrow.currentButton = 1;
    this.game.menuGroup.add(this.arrow);
  },
  move: function (cursors, buttons) {
    if (cursors.down.isDown && this.arrow.canMove) {
      this.arrow.canMove = false;
      this.allowMovement();
      if (this.arrow.currentButton === 1) {
        this.game.player.setPlayerClass(8);
        this.tween(buttons, 2);
      } else if (this.arrow.currentButton === 2) {
        this.game.player.setPlayerClass(9);
        this.tween(buttons, 3);
      } else {
        this.game.player.setPlayerClass(0);
        this.tween(buttons, 1);
      }
    }
    if (cursors.up.isDown && this.arrow.canMove) {
      this.arrow.canMove = false;
      this.allowMovement();
      if (this.arrow.currentButton === 1) {
        this.game.player.setPlayerClass(9);
        this.tween(buttons, 3);
      } else if (this.arrow.currentButton === 2) {
        this.game.player.setPlayerClass(0);
        this.tween(buttons, 1);
      } else {
        this.game.player.setPlayerClass(8);
        this.tween(buttons, 2);
      }
    }
    if (this.game.input.keyboard.isDown(Phaser.Keyboard.ENTER)) {
      this.activateButton(buttons, this.arrow.currentButton);
    }
  },
  tween: function (buttons, buttonNum) {
    this.game.add.tween(this.arrow)
        .to({
            y: this.game.world.centerY + buttons.pos[buttonNum - 1]
        }, this.arrow.moveDelay, Phaser.Easing.Quadratic.In)
        .start();
    this.arrow.currentButton = buttonNum;
  },
  allowMovement: function () {
    this.game.time.events.add(255, (function () {
      this.arrow.canMove = true;
    }), this);
  },
  activateButton: function (buttons, currentButton) {
    if(currentButton === 1){
      this.game.startExplorer(this);
    } else if (currentButton === 2){
      this.game.startKnight(this);
    } else{
      this.game.startConjurer(this);
    }
  }
};
