'use strict';

function Items(game, map, items) {
  this.items = items;
  this.game = game;
  this.map = map;

};
var itemBase = {
  create: function (data) {
  	this.sprite = this.game.add.sprite(96,64, 'jungle_hut');
  	this.sprite.x = 0;
  	this.sprite.y = 0;
  	this.sprite.body.setSize(3,20,46,43);
  	this.game.locations.add(this.sprite);
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
