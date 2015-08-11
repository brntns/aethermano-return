'use strict';

function Enemy(id, game) {
  this.game = game;
  this.id = id;
};
var enemyBase = {
  create: function create (data) {
    //console.log(data);
    this.sprite = this.game.monsterGroup.getFirstDead();
    this.sprite = this.game.add.sprite(0,0, 'beholder');

    this.sprite.physicsType = Phaser.SPRITE;
    this.sprite.animations.add('right', [0,1,2,3], 8, true);
    this.sprite.animations.add('left', [10,11,12,13], 8, true);
    this.sprite.animations.add('death', [20,21,22,23,24,25,26], 8, false);
    this.sprite.animations.add('chargeUp_right', [30,31,32,33,34,35,36,37], 8, false);
    this.sprite.animations.add('chargeUp_left', [40,41,42,43,44,45,46,47], 8, false);
    this.sprite.animations.add('firing_right', [38,39], 8, true);
    this.sprite.animations.add('firing_left', [48,49], 8, true);
    var randy = Math.random();
    if (randy > 0.5) {
      this.sprite.animations.play('left');
    } else {
      this.sprite.animations.play('right');
    }
    this.game.physics.arcade.enable(this.sprite);
    this.sprite.x = data.x*16;
    this.sprite.y = data.y*16;
    this.sprite.id = data.id;
    this.sprite.body.allowGravity = false;
    this.sprite.slashed = false;
    this.sprite.body.velocity.x = data.velox;
    this.sprite.body.velocity.y = data.veloy;
    this.sprite.spawned = false;
    this.sprite.body.collideWorldBounds = true;
    this.sprite.hitpoints = data.hp;
    this.sprite.charging = false;
    this.sprite.idle = false;
    this.sprite.laser = null;
    this.sprite.laser = this.game.add.group();
    this.sprite.body.setSize(16,18,22,22);
    this.game.monsterGroup.add(this.sprite);
    this.aggro = data.aggro;
    this.aggrotarget = false;
    //  console.log(this.sprite.spawned);
  }
};

var enemies = {};
_.extend(enemies, enemyBase);

Enemy.prototype = enemies;

module.exports = Enemy;
