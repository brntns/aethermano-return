'use strict';

function Enemy(id, game) {
  this.game = game;
  this.id = id;
//  this.sprite.id = id;
	//this.map = map;
  // this.monsters = null;
  this.running = null;
  this.rng01 = null;
  this.rng02 = null;
};
var enemyBase = {
  create: function (x,y,id) {
    //log Data
    //console.log(data);
    // add every monster from server
    this.sprite = this.game.monsterGroup.getFirstDead();
    this.sprite = this.game.add.sprite(32,48, 'enemy');
    this.sprite.physicsType = Phaser.SPRITE;
    this.sprite.animations.add('left', [0, 1, 2], 5, true);
    this.sprite.animations.play('left');
    this.sprite.x = x;
    this.sprite.id = id;
    this.sprite.y = y;
    this.game.physics.arcade.enable(this.sprite);
    this.sprite.body.collideWorldBounds = true;
    this.rng01 = Math.random();
    this.rng02 = Math.random();
  //this.sprite.runleft = this.game.add.tween(this.sprite);
  //this.sprite.runleft
    //.to({x:  this.sprite.x + this.rng01*450+20}, this.rng02*2000+500)
    //.to({x:  this.sprite.x }, this.rng02*2000+500)
    //.to({x:  this.sprite.x + 200}, 2000)
    //.to({x:  this.sprite.x }, 2000)
    //.loop()
    //.start();
    this.game.monsterGroup.add(this.sprite);
  },
  update: function(data) {
    console.log(data);
  }
};

var enemies = {};
_.extend(enemies, enemyBase);

Enemy.prototype = enemies;

module.exports = Enemy;
