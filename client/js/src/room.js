'use strict';

function Room(game, player) {
  //console.log(game);
  this.game = game;
  this.player = player;
};
var roomBase = {
  create: function () {
    this.lastPos = {
			x: this.player.sprite.body.x,
			y: this.player.sprite.body.y,
			lvl:this.player.level
		};
		this.game.locationGroup.visible = false;
		this.game.stage.backgroundColor = '#333333';
		this.setRoomSize(800,480);
		this.player.sprite.x = this.game.world.centerX;
		this.player.sprite.y = this.game.world.centerY;
		this.player.sprite.inRoom = true;
		this.room = this.game.add.sprite(this.game.world.centerX - 115,this.game.world.centerY- 66, 'jungle_hut_inner');
		this.room.fixedToCamera = true;
		this.game.physics.arcade.enable(this.room);
		this.room.body.allowGravity  = false;
		this.room.body.setSize(140, 130, 190, 112);
  },
  setRoomSize:function(width,height){
    this.game.world.setBounds(0,0,width, height);
    this.game.boundsGroup.enableBody = true;
    var bound = this.game.boundsGroup.create(this.game.world.centerX - 115,this.game.world.centerY- 66, 'heightBound');
    bound.body.immovable = true;
    bound.body.allowGravity = false;
    bound.alpha = 0;
    var bound = this.game.boundsGroup.create(this.game.world.centerX + 95,this.game.world.centerY -66, 'heightBound');
    bound.body.immovable = true;
    bound.alpha = 0;
    bound.body.allowGravity = false;
    var bound = this.game.boundsGroup.create(this.game.world.centerX- 95,this.game.world.centerY + 66, 'widthBound');
    bound.body.immovable = true;
    bound.body.allowGravity = false;
    bound.alpha = 0;
    var bound = this.game.boundsGroup.create(this.game.world.centerX- 95,this.game.world.centerY - 66, 'widthBound');
    bound.body.immovable = true;
    bound.body.allowGravity = false;
    bound.alpha = 0;

  }

};

var rooms = {};
_.extend(rooms, roomBase);

Room.prototype = rooms;

module.exports = Room;
