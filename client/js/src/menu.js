'use strict';

function Menu(client,game) {
 this.game = game;
 //this.client = client;
 this.client = client;
// console.log(client);

}

var menuBase =  {

  create: function create() {
    var client = this.client;
    console.log(client);
    //		var game = this.game;
    this.btn1 = this.game.add.button(this.game.world.centerX, this.game.world.centerY + 50, 'explorerbtn',this.game.startPlay,this);
    this.btn2 = this.game.add.button(this.game.world.centerX, this.game.world.centerY , 'knightbtn',this.game.startPlay,this);
    this.btn3 = this.game.add.button(this.game.world.centerX, this.game.world.centerY - 50, 'conjurerbtn',this.game.startPlay,this);

    this.btn1.anchor.set(0.5, 0.5);
    this.btn2.anchor.set(0.5, 0.5);
    this.btn3.anchor.set(0.5, 0.5);

  },
  update: function update(cli) {
  }
}


var menu = {};
_.extend(menu, menuBase);

Menu.prototype = menu;



module.exports = Menu;
