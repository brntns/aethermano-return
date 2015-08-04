
'use strict';

function Preloader() {
  this.ready = false;
}

Preloader.prototype = {

  preload: function () {

    this.game.load.image("overlay", "assets/overlay.png");
    this.game.load.image('tiles-1', 'assets/tiles-1.png');
    this.game.load.image('item', 'assets/item.png');
    this.game.load.image('ball', 'assets/ball.png');
    this.game.load.image('hello', 'assets/hello.png');

    this.game.load.spritesheet('arrow', 'assets/player/arrow.png',32,32);
    this.game.load.spritesheet('fireball', 'assets/player/fireball.png',66,66);
    this.game.load.spritesheet('icelance', 'assets/player/icelance.png',64,64);
    this.game.load.spritesheet('voodoo_skull', 'assets/player/voodoo_skull.png',32,32);

    this.game.load.image('jungle_hut', 'assets/jungle_hut.png');
    this.game.load.image('jungle_hut_inner', 'assets/hut.png');
    this.game.load.image('door', 'assets/door_inner.png');
    this.game.load.image('widthBound', 'assets/width.png');
    this.game.load.image('heightBound', 'assets/height.png');


    this.game.load.image('rope_ladder_top_left', 'assets/rope_ladder/ladder_1.png');
    this.game.load.image('rope_ladder_top', 'assets/rope_ladder/ladder_2.png');
    this.game.load.image('rope_ladder_top_right', 'assets/rope_ladder/ladder_3.png');
    this.game.load.image('rope_ladder_middle', 'assets/rope_ladder/ladder_4.png');
    this.game.load.image('rope_ladder_bottom', 'assets/rope_ladder/ladder_5.png');

    this.game.load.image('vine_top_left', 'assets/vine/ladder_1.png');
    this.game.load.image('vine_top_right', 'assets/vine/ladder_2.png');
    this.game.load.image('vine_middle_left', 'assets/vine/ladder_3.png');
    this.game.load.image('vine_middle_right', 'assets/vine/ladder_4.png');
    this.game.load.image('vine_bottom_left', 'assets/vine/ladder_5.png');
    this.game.load.image('vine_bottom_right', 'assets/vine/ladder_6.png');

    this.game.load.spritesheet('monk_hitbox', 'assets/player/monk_hitbox.png', 29, 29);
    //
    // this.game.load.spritesheet('monk_slash_rightup', 'assets/monk_slash_rightup.png', 32, 32);
    // this.game.load.spritesheet('monk_slash_leftup', 'assets/monk_slash_leftup.png', 32, 32);
    // this.game.load.spritesheet('monk_slash_leftdown', 'assets/monk_slash_leftdown.png', 32, 32);
    // this.game.load.spritesheet('monk_slash_rightdown', 'assets/monk_slash_rightdown.png', 32, 32);
    //
    // this.game.load.spritesheet('monk_slash_right', 'assets/monk_slash_right.png', 32, 32);
    // this.game.load.spritesheet('monk_slash_up', 'assets/monk_slash_up.png', 32, 32);
    // this.game.load.spritesheet('monk_slash_left', 'assets/monk_slash_left.png', 32, 32);
    // this.game.load.spritesheet('monk_slash_down', 'assets/monk_slash_down.png', 32, 32);


  //  this.game.load.spritesheet('player', 'assets/player.png', 58, 58);
    this.game.load.spritesheet('explorer', 'assets/player/explorer.png',87, 87);
    this.game.load.spritesheet('wizard', 'assets/player/wizard.png',87, 87);
    this.game.load.spritesheet('monk', 'assets/player/monk.png',87, 87);
    this.game.load.spritesheet('tron', 'assets/player/tron.png', 87,87);
    this.game.load.spritesheet('demon', 'assets/player/demon.png', 87, 87);
    this.game.load.spritesheet('native', 'assets/player/native.png', 87, 87);
    this.game.load.spritesheet('icemage', 'assets/player/icemage.png', 87, 87);
    this.game.load.spritesheet('witchdoc', 'assets/player/witchdoc.png', 87, 87);
    this.game.load.spritesheet('witchdoc_shrunk', 'assets/player/witchmini.png', 87, 87);
    this.game.load.spritesheet('knight', 'assets/player/knight.png', 87, 87);



    this.game.load.spritesheet('enemy', 'assets/enemy.png', 64, 48);
    this.game.load.spritesheet('enemy2', 'assets/enemy2.png', 80, 64);
    //this.game.load.spritesheet('blackdude', 'assets/blackdude.png', 29, 29);
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
