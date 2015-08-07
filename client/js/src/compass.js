'use strict';

function Compass(id,game) {
  //console.log(game);
  this.game = game;
  this.id = id;
};
var compassBase = {
  create: function (data) {
    //log Data
  // console.log(this.game.player.sprite);
    this.sprite = this.game.compassGroup.getFirstDead();
    this.sprite = this.game.add.sprite(0,0,'ball');
  //  this.game.physics.arcade.enable(this.sprite);
    this.sprite.x = data.x;
    this.sprite.id = data.id;
    this.sprite.y = data.y;
    this.sprite.visible = true;
    this.game.compassGroup.add(this.sprite);
    // this.sprite.body.allowGravity = false;
    // this.sprite.immovable = true;
  },
  update: function(data) {
    var pX = this.game.player.sprite.x;
    var pY = this.game.player.sprite.y;
    var sX = data.x;
    var sY = data.y;
    var normi = 0.005*Math.sqrt((sX-(pX + 44))*(sX-(pX + 44)) + (sY-(pY + 44))*(sY-(pY + 44)));
    this.sprite.x = pX + 44 + Math.floor((sX-(pX + 44))/normi);
    this.sprite.y = pY + 44 + (Math.floor(sY-(pY + 44))/normi);
  }
};

var compass = {};
_.extend(compass, compassBase);

Compass.prototype = compass;

module.exports = Compass;
