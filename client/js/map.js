'use strict';

function Map(game, player, myGame) {
	this.myGame = myGame;
	this.player = player;
	this.game = game;
	this.bg = null;
	this.tileset = null;
	this.collisionLayer = null;
  this.portal = {};
  this.portal.x = null;
  this.portal.y = null;
  this.client = null;

}

var mapBase = {

	create: function (data) {
		// Log Map infos
		console.log(data);


		this.game.stage.backgroundColor = '#440e62';
		//load map
		this.game.load.tilemap('level1', null, data, Phaser.Tilemap.TILED_JSON );
		// add player Group
		this.myGame.survivorGroup = this.game.add.group();
		this.myGame.survivorGroup.createMultiple(100,'dude');
		//add tilemap
  	this.tileset = this.game.add.tilemap('level1');
   	this.tileset.addTilesetImage('tiles-1');
		this.tileset.setCollisionByExclusion([ 13, 14, 15, 16, 46, 47, 48, 49, 50, 51 ]);
    //Set collisionLayer
    this.collisionLayer = this.tileset.createLayer('Tile Layer 1');
		this.collisionLayer.resizeWorld();
    this.portal.x = data.portalPosx * 16;
    this.portal.y = data.portalPosy * 16;


    console.log('//// PORTAL SPAWNED AT');
    console.log('//// x:' +(data.portalPosx * 16) + 'y:'+ (data.portalPosy * 16));
		console.log('starting game');

	},

	update: function(mapData) {
    console.log(mapData);
	}
}

var map = {};
_.extend(map, mapBase);

Map.prototype = map;
