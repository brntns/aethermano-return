'use strict';

function Items(game, map, items) {
  this.items = items;
  this.game = game;

};
var itemBase = {
  create: function (data) {
    // Log ITEMS
    console.log(data);
    this.phasebooties = this.game.add.sprite(480,320,'booties');
  }
};

var item = {};
_.extend(item, itemBase);

Items.prototype = item;
