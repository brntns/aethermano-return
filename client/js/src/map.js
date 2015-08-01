'use strict';

function Map(game, player, myGame) {
	this.myGame = myGame;
	this.player = player;
	this.game = game;
	this.bg = null;
  this.maps = null;
	this.room = null;
  this.tilemap = null;
  this.currentMap = null;
	this.tileset = null;
	this.collisionLayer = null;
  this.portal = {};
  this.portal.x = null;
  this.portal.y = null;
	this.bleft = null;
	this.bright =  null;
	this.btop =  null;
	this.bbottom =  null;
  this.client = null;
	this.lastPos = null;
  this.locationSprites = [];
}

var mapBase = {

	create: function (data) {
		this.game.stage.backgroundColor = '#79BFE2';
    this.maps = data;
    this.setCurrentLevel(this.maps[0],'level1');
		// add groups

	},
	update: function(data) {
		//  Scroll the background
    this.maps = data;
    var ll = this.player.level;
    //console.log(ll);
    this.setCurrentLevel(this.maps[ll],'level'+ll);
	},
  setCurrentLevel:function(level,name){
		//console.log(level);
    this.currentMap = level;
    if(this.collisionLayer !== null){
      this.collisionLayer.destroy();
    	console.log('destroyed');
    }
    this.tilemap = this.game.load.tilemap(name, null, this.currentMap, Phaser.Tilemap.TILED_JSON );
    this.tileset = this.game.add.tilemap(name);
		//set collision
    this.tileset.setCollisionByExclusion([ 13, 14, 15, 16, 46, 47, 48, 49, 50, 51, 99, 100, 101, 102, 103, 104, 105, 106, 107, 108, 109, 110, 111, 112, 113, 114, 115, 116, 117, 118, 119]);
    this.tileset.addTilesetImage('tiles-1');
    //set collisionLayer
    this.collisionLayer = this.tileset.createLayer('Tile Layer 1');
		this.collisionLayer.renderSettings.enableScrollDelta = true;
    this.collisionLayer.resizeWorld();
    this.portal.x = level.portalPosX * 16;
    this.portal.y = level.portalPosY * 16;
  },
	enterRoom: function enterRoom(){
	  this.collisionLayer.destroy();
		this.lastPos = {
			x: this.player.sprite.body.x,
			y: this.player.sprite.body.y,
			lvl:this.player.level
		};
		this.myGame.locationGroup.visible = false;
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
	leaveRoom: function leaveRoom(){
		this.myGame.locationGroup.visible = true;
		this.game.stage.backgroundColor = '#79BFE2';
		this.room.kill();
		this.player.sprite.x = this.lastPos.x;
		this.player.sprite.y = this.lastPos.y;
		this.player.level = this.lastPos.lvl;
		this.collisionLayer = this.tileset.createLayer('Tile Layer 1');
		this.collisionLayer.resizeWorld();
		this.player.sprite.inRoom = false;
	},
	setRoomSize:function(width,height){
		this.game.world.setBounds(0,0,width, height);
		this.myGame.boundsGroup.enableBody = true;
		var bound = this.myGame.boundsGroup.create(this.game.world.centerX - 115,this.game.world.centerY- 66, 'heightBound');
		bound.body.immovable = true;
		bound.body.allowGravity = false;
		bound.alpha = 0;
		var bound = this.myGame.boundsGroup.create(this.game.world.centerX + 95,this.game.world.centerY -66, 'heightBound');
 		bound.body.immovable = true;
  	bound.alpha = 0;
 		bound.body.allowGravity = false;
		var bound = this.myGame.boundsGroup.create(this.game.world.centerX- 95,this.game.world.centerY + 66, 'widthBound');
		bound.body.immovable = true;
	  bound.body.allowGravity = false;
		bound.alpha = 0;
		var bound = this.myGame.boundsGroup.create(this.game.world.centerX- 95,this.game.world.centerY - 66, 'widthBound');
 		bound.body.immovable = true;
 		bound.body.allowGravity = false;
		bound.alpha = 0;

	}
}

var map = {};
_.extend(map, mapBase);

Map.prototype = map;

module.exports = Map;
