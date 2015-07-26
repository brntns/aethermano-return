'use strict';

function Chat(id,game) {
  //console.log(game);
  this.game = game;
  this.id = id;
};
var chatBase = {
  create: function (data) {
    //log Data
  // console.log(this.game.player.sprite);
    this.sprite = this.game.talkGroup.getFirstDead();
    this.sprite = this.game.add.sprite(0,0,'ball');
  //  this.game.physics.arcade.enable(this.sprite);
    this.sprite.x = data.x;
    this.sprite.id = data.id;
    this.sprite.y = data.y;
    this.sprite.visible = true;
    this.game.talkGroup.add(this.sprite);
    // this.sprite.body.allowGravity = false;
    // this.sprite.immovable = true;
  },
  update: function(data) {
    pX = this.game.player.sprite.x;
    pY = this.game.player.sprite.y;
    sX = data.x;
    sY = data.y;
    var normi = 200*Math.swrt((sX-(pX + 44))*(sX-(pX + 44)) + (sY-(pY + 44))*(sY-(pY + 44)));
    this.sprite.x = pX + 44 + (sX-(pX + 44))/normi;
    this.sprite.y = pY + 44 + (sY-(pY + 44))/normi;
  }
};

var chats = {};
_.extend(chats, chatBase);

Chat.prototype = chats;

module.exports = Chat;
