
'use strict';

var Buttons = {
  pos: [-50, 50, 150],
  callbacks: ['playState', 'playState', 'playState'],
  draw: function () {


    this.btn1 = this.addButton(1,'explorerbtn', this.playState); //this.add.button(this.world.centerX, this.world.centerY - 50, 'explorerbtn', this.playState);
    this.btn2 = this.addButton(2,'knightbtn', this.playState);//this.add.button(this.world.centerX, this.world.centerY + 50, 'knightbtn', this.playState);
    this.btn3 = this.addButton(3,'conjurerbtn', this.playState);//this.add.button(this.world.centerX, this.world.centerY - 50, 'conjurerbtn', this.playState);

    this.btn1.anchor.set(0.5, 0.5);
    this.btn2.anchor.set(0.5, 0.5);
    this.btn3.anchor.set(0.5, 0.5);

  },
  addButton: function (weight,button, func) {
        return this.add.button(this.game.world.centerX,
        this.game.world.centerY + this.pos[weight - 1],
        button, func);
    },

  playState: function() {

  this.game.state.start('game');

  }
};

module.exports = Buttons;
