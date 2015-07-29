'use strict';

function Map(game, player, myGame) {
	this.myGame = myGame;
	this.player = player;
	this.game = game;
	this.bg = null;
  this.maps = null;
  this.tilemap = null;
  this.currentMap = null;
	this.tileset = null;
	this.collisionLayer = null;
  this.portal = {};
  this.portal.x = null;
  this.portal.y = null;
  this.client = null;
}

var mapBase = {

	create: function (data) {
		this.game.stage.backgroundColor = '#79BFE2';
		// this.bg = this.game.add.Sprite(0, 0, 1024, 640,'bg');
		// this.bg.fixedToCamera = true;
    this.maps = data;
    this.setCurrentLevel(this.maps[0],'level1');
		this.game.stage.smoothed = false;
		// add groups
		this.myGame.monsterGroup = this.game.add.group();
		this.myGame.survivorGroup = this.game.add.group();
		this.myGame.talkGroup = this.game.add.group();
    this.myGame.ladders = this.game.add.group();
    this.myGame.locations = this.game.add.group();
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
    // console.log('//// PORTAL SPAWNED AT');
    // console.log('//// x:' +  this.portal.x + 'y:'+ this.portal.y);
    // console.log('starting game');

		//console.log(this.collisionLayer);
  }
}

var map = {};
_.extend(map, mapBase);

Map.prototype = map;

module.exports = Map;
