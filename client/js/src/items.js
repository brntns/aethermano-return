'use strict';

function Items( items,game) {

  this.game = game;

};
var itemBase = {
  create: function (data) {

    console.log(data);
  	for (var i = 0; i < data.length; i++) {
      console.log('generating hut');
      console.log(data[i].x);
      console.log(data[i].y);
      console.log(data[i].i);
  		if (data[i].i === 1) {
        var sprite = null;
        sprite = this.game.locationGroup.getFirstDead();
      	sprite = this.game.add.sprite(96,64, 'jungle_hut');
        sprite.physicsType = Phaser.SPRITE;
        this.game.physics.arcade.enable(sprite);
        sprite.body.collideWorldBounds = true;
        sprite.body.allowGravity = false;
      	sprite.x = data[i].x*16;
      	sprite.y = data[i].y*16;
      	sprite.body.setSize(3,20,46,43);
        sprite.visible = true;
        sprite.i = 1;
        sprite.bringToTop();
      	this.game.locationGroup.add(sprite);
      }
      console.log(this.game.locationGroup);
    }
  }
};

var item = {};
_.extend(item, itemBase);

Items.prototype = item;

module.exports = Items;
