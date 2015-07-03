'use strict';

function Enemy(game,map,enemy) {
  this.game = game;
	this.map = map;
  this.monster = enemy;
  this.running = null;
};
var enemyBase = {
  create: function (data) {
    //log Data
    //console.log(data);
		this.monster = this.game.add.sprite(0, 0, 'enemy');
  	this.game.physics.arcade.enable(this.monster);
    this.monster.body.collideWorldBounds = true;
    this.monster.animations.add('left', [0, 1, 2], 10, true);
    this.monster.animations.play('left');
    this.runleft = this.game.add.tween(this.monster);
    this.runright = this.game.add.tween(this.monster);
    this.runleft.to({x:10}, 2500);
    this.runright.to({x:450}, 2500);
    this.runleft.onComplete.add(this.right, this);
    this.runright.onComplete.add(this.left, this);
 },
  spawn: function(x, y,level) {
    this.alive = true;
    this.monster.x = x;
    this.monster.y = y;
    this.level = level;
    this.runright.start();
  },
  right: function() {
    this.runright.start();
  },
  left: function() {
    this.runleft.start();
  }
};

var enemies = {};
_.extend(enemies, enemyBase);

Enemy.prototype = enemies;
