'use strict';

function Items( items,game) {

  this.game = game;

};
var itemBase = {
  create: function (data) {

    console.log(data);
  	for (var i = 0; i < data.length; i++) {
      console.log(data[i].x);
      console.log(data[i].y);
  		if (data[i].i === 1) {
          this.sprite = this.game.locationGroup.getFirstDead();
      	this.sprite = this.game.add.sprite(96,64, 'jungle_hut');
          this.sprite.physicsType = Phaser.SPRITE;
         this.game.physics.arcade.enable(this.sprite);
         this.sprite.body.collideWorldBounds = true;
      	this.sprite.x = data[i].x;
      	this.sprite.y = data[i].y;
      	this.sprite.body.setSize(3,20,46,43);
      	this.game.locationGroup.add(this.sprite);
      }
    }
  }
};

var item = {};
_.extend(item, itemBase);

Items.prototype = item;

module.exports = Items;
