'use strict';

function Enemy(id, game) {
  this.game = game;
  this.id = id;
  this.running = null;
  this.rng01 = null;
  this.rng02 = null;
};
var enemyBase = {
  create: function create (data) {
    console.log(data);
    this.sprite = this.game.monsterGroup.getFirstDead();
    this.sprite = this.game.add.sprite(64,64, 'beholder');
    this.sprite.physicsType = Phaser.SPRITE;
    this.sprite.animations.add('left', [0, 1, 2], 5, true);
    this.sprite.animations.play('left');
    this.game.physics.arcade.enable(this.sprite);
    this.sprite.x = data.x*16;
    this.sprite.id = data.id;
    this.sprite.y = data.y*16;
    this.sprite.allowGravity = false;
    this.sprite.slashed = false;
    this.sprite.body.velocity.x = data.velox;
    this.sprite.body.velocity.y = data.veloy;
    this.sprite.spawned = false;
    this.sprite.body.collideWorldBounds = true;
    this.sprite.hitpoints = data.hp;
    this.game.monsterGroup.add(this.sprite);
    this.aggro = false;
    //  console.log(this.sprite.spawned);
  },
  update: function update(data) {
    console.log(data);
  }
};

var enemies = {};
_.extend(enemies, enemyBase);

Enemy.prototype = enemies;

module.exports = Enemy;
