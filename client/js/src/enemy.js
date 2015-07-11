'use strict';

function Enemy(game,map,enemy) {
  this.game = game;
	this.map = map;
  this.monster = enemy;
  this.monsters = null;
  this.running = null;
  this.rng01 = null;
  this.rng02 = null;
};
var enemyBase = {
  create: function (data) {
    //log Data
    console.log(data);
    this.monsters = this.game.add.group();
    //this.monsters.visible = false;
    // add every monster from server
    for (var i = 0; i < data.length; i++) {
      var monster = this.game.add.sprite(32,48, 'enemy');
      monster.physicsType = Phaser.SPRITE;
      monster.x = data[i].spawn.x;
      monster.y = data[i].spawn.y;
      this.game.physics.arcade.enable(monster);
      monster.animations.add('left', [0, 1, 2], 10, true);
      monster.animations.play('left');
      monster.body.collideWorldBounds = true;
          monster.runleft = this.game.add.tween(monster);
          this.rng01 = Math.random();
          this.rng02 = Math.random();
      monster.runleft
           .to({x:monster.x + this.rng01*450+20}, this.rng02*2000+500)
           .to({x:monster.x }, this.rng02*2000+500)
           .loop()
           .start();
      this.monsters.add(monster);
    }
 }
 // ,
  // spawn: function(data) {
  //   // spawn all monsters
  //   this.monsters.forEach(function(monster) {
  //     //choose random spawnpoint
  //     var spawnPoint = Math.floor((Math.random() * data.length));
  //     monster.reset = null;
  //     monster.x = data[spawnPoint].x;
  //     monster.y = data[spawnPoint].y;
  //     monster.runleft = this.game.add.tween(monster);
  //     this.rng01 = Math.random();
  //     this.rng02 = Math.random();
  //     monster.runleft
  //       .to({x:monster.x + this.rng01*450+20}, this.rng02*2000+500)
  //       .to({x:monster.x }, this.rng02*2000+500)
  //       .loop()
  //       .start();
  //   }, this);
  //   this.monsters.visible = true;
  // }
};

var enemies = {};
_.extend(enemies, enemyBase);

Enemy.prototype = enemies;

module.exports = Enemy;
