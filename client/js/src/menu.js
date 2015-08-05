'use strict';
var buttons = require('./menu/buttons');
var arrow = require('./menu/arrow');

function Menu(client,game) {
 this.game = game;
 this.client = client;
}

var menuBase =  {
  create: function create() {
    buttons.draw(this.game);
    arrow.draw(this.game);
    console.log(this.game.player.cursors);
  },
   update: function(cursors){
    //console.log(player);
     arrow.move(cursors,buttons);
   }
}


var menu = {};
_.extend(menu, menuBase);

Menu.prototype = menu;



module.exports = Menu;
