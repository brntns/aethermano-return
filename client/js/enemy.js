'use strict';

function Enemy(game,map,enemy) {
  this.game = game;
	this.map = map;
  this.monster = enemy;
  this.running = null;

};
var enemyBase = {
  create: function (data) {
    console.log(data);

		this.monster = this.game.add.sprite(0, 0, 'enemy');
  	this.game.physics.arcade.enable(this.monster);
    this.monster.body.collideWorldBounds = true;
    this.running = this.game.add.tween(this.monster);
    this.running.to({x:150}, 1000);
 },
  spawn: function(x, y,level) {
    this.alive = true;
    this.monster.x = x;
    this.monster.y = y;
    this.level = level;
    this.running.start();
    this.running.repeat(100, 1000);
  }
};

var enemies = {};
_.extend(enemies, enemyBase);

Enemy.prototype = enemies;
