
'use strict';

function Splash() {

}

Splash.prototype = {

  create: function () {

    this.stage.backgroundColor = 0xFFFFFF;
    this.logo = this.add.sprite(this.world.centerX, this.world.centerY, 'logo');
    this.logo.smoothed = false;
    this.logo.anchor.set(0.5, 0.5);
    this.logo.scale.set(0.75);
    this.logo.alpha = 0;

    this.createTween();
  },
  createTween() {
      var logoTween = this.add.tween(this.logo).to({alpha: 1}, 1000,
          Phaser.Easing.Cubic.In, true, 0, 0, true);

      logoTween.onComplete.add(startGame,this);
      function startGame(){
        this.game.state.start('game');
      }
  }
};

module.exports = Splash;
