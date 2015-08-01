'use strict';

function Room(id,game) {
  //console.log(game);
  this.game = game;
  this.id = id;
};
var roomBase = {
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

  }
};

var rooms = {};
_.extend(rooms, roomBase);

Room.prototype = rooms;

module.exports = Room;
