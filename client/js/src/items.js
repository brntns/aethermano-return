'use strict';

function Items(game, map, items) {
  this.items = items;
  this.game = game;

};
var itemBase = {
  create: function (data) {
  //  Log ITEMS
   console.log(data);
   this.item = this.game.add.sprite(600, 600, 'item');
   this.game.physics.arcade.enable(this.item);
   this.item.body.collideWorldBounds = true;
  }
};

var item = {};
_.extend(item, itemBase);

Items.prototype = item;

module.exports = Items;
