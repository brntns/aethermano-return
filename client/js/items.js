'use strict';

function Items(game, map, items) {
  this.items = items;
  this.game = game;

};
var itemBase = {
  create: function (data) {
    // Log ITEMS
    console.log(data);
  }
};

var items = {};
_.extend(items, itemBase);

Items.prototype = items;
