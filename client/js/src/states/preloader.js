
'use strict';

function Preloader() {
  this.ready = false;
}

Preloader.prototype = {

  preload: function () {
    // misc
    this.game.load.image("overlay", "assets/overlay.png");
    this.game.load.image('tiles-1', 'assets/tiles-1.png');
    this.game.load.image('item', 'assets/item.png');
    this.game.load.image('ball', 'assets/ball.png');
    this.game.load.image('hello', 'assets/hello.png');
    this.game.load.image('skull', 'assets/menu/skull.png');
    this.game.load.image('knightbtn', 'assets/menu/knight.png');
    this.game.load.image('explorerbtn', 'assets/menu/explorer.png');
    this.game.load.image('conjurerbtn', 'assets/menu/conjurer.png');
    this.game.load.image('logo', 'assets/title.png');
    // player projectiles
    this.game.load.spritesheet('arrow', 'assets/player/arrow.png', 32, 32);
    this.game.load.spritesheet('fireball', 'assets/player/fireball.png', 66, 66);
    this.game.load.spritesheet('icelance', 'assets/player/icelance.png', 64, 64);
    this.game.load.spritesheet('voodoo_skull', 'assets/player/voodoo_skull.png', 32, 32);
    this.game.load.spritesheet('magic_missile', 'assets/player/magic_missile.png', 32, 32);
    this.game.load.spritesheet('rotten', 'assets/player/magic_missile.png', 32, 32);
    this.game.load.spritesheet('spoon', 'assets/player/magic_missile.png', 32, 32);
    // hut
    this.game.load.image('jungle_hut', 'assets/jungle_hut.png');
    this.game.load.image('jungle_hut_inner', 'assets/hut.png');
    // ladder
    this.game.load.image('rope_ladder_top_left', 'assets/rope_ladder/ladder_1.png');
    this.game.load.image('rope_ladder_top', 'assets/rope_ladder/ladder_2.png');
    this.game.load.image('rope_ladder_top_right', 'assets/rope_ladder/ladder_3.png');
    this.game.load.image('rope_ladder_middle', 'assets/rope_ladder/ladder_4.png');
    this.game.load.image('rope_ladder_bottom', 'assets/rope_ladder/ladder_5.png');
    // vines
    this.game.load.image('vine_top_left', 'assets/vine/ladder_1.png');
    this.game.load.image('vine_top_right', 'assets/vine/ladder_2.png');
    this.game.load.image('vine_middle_left', 'assets/vine/ladder_3.png');
    this.game.load.image('vine_middle_right', 'assets/vine/ladder_4.png');
    this.game.load.image('vine_bottom_left', 'assets/vine/ladder_5.png');
    this.game.load.image('vine_bottom_right', 'assets/vine/ladder_6.png');
    // attacks
    this.game.load.spritesheet('monk_hitbox', 'assets/player/monk_hitbox.png', 29, 29);
    // classes
    this.game.load.spritesheet('explorer', 'assets/player/explorer.png', 87, 87);
    this.game.load.spritesheet('wizard', 'assets/player/wizard.png', 87, 87);
    this.game.load.spritesheet('monk', 'assets/player/monk.png', 87, 87);
    this.game.load.spritesheet('tron', 'assets/player/tron.png', 87,87);
    this.game.load.spritesheet('demon', 'assets/player/demon.png', 87, 87);
    this.game.load.spritesheet('native', 'assets/player/native.png', 87, 87);
    this.game.load.spritesheet('icemage', 'assets/player/icemage.png', 87, 87);
    this.game.load.spritesheet('witchdoc', 'assets/player/witchdoc.png', 87, 87);
    this.game.load.spritesheet('witchdoc_shrunk', 'assets/player/witchmini.png', 87, 87);
    this.game.load.spritesheet('knight', 'assets/player/knight.png', 87, 87);
    this.game.load.spritesheet('conjurer', 'assets/player/conjurer.png', 87, 87);
    this.game.load.spritesheet('jester', 'assets/player/jester.png', 87, 87);
    this.game.load.spritesheet('climbbox', 'assets/climbbox.png', 18, 18);
    // monster
    this.game.load.spritesheet('ratking', 'assets/monster/ratking.png', 172, 172);
    this.game.load.spritesheet('beholder', 'assets/monster/beholder.png', 64, 64);
    this.game.load.spritesheet('beholder_laser', 'assets/monster/beholder_laser.png', 32, 16);

    this.ready = true;
  },
  update: function () {
    if (!!this.ready) {
      this.game.state.start('splash');


    }
  }
};

module.exports = Preloader;
