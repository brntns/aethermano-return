'use strict';

function Items(game, map, items) {
  this.items = items;
  this.game = game;
  this.map = map;

};
var itemBase = {
  create: function (data) {
  	for (var i = 0; i < this.map.locationSprites.length; i++) {
  		if (this.map.locationSprites[i].i === 1) {
      	this.sprite = this.game.add.sprite(96,64, 'jungle_hut');
      	this.sprite.x = map.locationSprites[i].x;
      	this.sprite.y = map.locationSprites[i].y;
      	this.sprite.body.setSize(3,20,46,43);
      	this.game.locations.add(this.sprite);
      }
    }
  //  Log ITEMS
  //  console.log(data);
  //  this.item = this.game.add.sprite(600, 600, 'item');
  //  this.game.physics.arcade.enable(this.item);
  //  this.item.body.collideWorldBounds = true;
  }
};

var item = {};
_.extend(item, itemBase);

Items.prototype = item;

module.exports = Items;
