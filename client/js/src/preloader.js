
'use strict';

function Preloader() {
  this.ready = false;
}

Preloader.prototype = {

  preload: function () {
    this.game.load.image("bg", "assets/bg.png");
    this.game.load.image('tiles-1', 'assets/tiles-1.png');
    this.game.load.image('item', 'assets/item.png');
    this.game.load.spritesheet('hitbox', 'assets/slashhitbox.png', 32, 32);

    this.game.load.spritesheet('monk_slash_rightup', 'assets/monk_slash_rightup.png', 32, 32);
    this.game.load.spritesheet('monk_slash_leftup', 'assets/monk_slash_leftup.png', 32, 32);
    this.game.load.spritesheet('monk_slash_leftdown', 'assets/monk_slash_leftdown.png', 32, 32);
    this.game.load.spritesheet('monk_slash_rightdown', 'assets/monk_slash_rightdown.png', 32, 32);

    this.game.load.spritesheet('monk_slash_right', 'assets/monk_slash_right.png', 32, 32);
    this.game.load.spritesheet('monk_slash_up', 'assets/monk_slash_up.png', 32, 32);
    this.game.load.spritesheet('monk_slash_left', 'assets/monk_slash_left.png', 32, 32);
    this.game.load.spritesheet('monk_slash_down', 'assets/monk_slash_down.png', 32, 32);


    this.game.load.spritesheet('player', 'assets/player.png', 29, 29);
    this.game.load.spritesheet('explorer', 'assets/explorer.png', 29, 29);
    this.game.load.spritesheet('wizard', 'assets/wizard.png', 29, 29);
    this.game.load.spritesheet('monk', 'assets/monk.png', 29, 29);
    this.game.load.spritesheet('tron', 'assets/tron.png', 29, 29);
    this.game.load.spritesheet('brawny', 'assets/brawny_snakeeyes.png', 29, 29);


    this.game.load.spritesheet('enemy', 'assets/enemy.png', 64, 48);
    this.game.load.spritesheet('enemy2', 'assets/enemy2.png', 80, 64);
    this.game.load.spritesheet('blackdude', 'assets/blackdude.png', 29, 29);
    this.game.load.spritesheet('climbbox', 'assets/climbbox.png', 18, 18);
    this.game.load.image('logo', 'assets/title.png');
    this.ready = true;
  },
  update: function () {
    if (!!this.ready) {
      this.game.state.start('splash');
    }
  }
};

module.exports = Preloader;
