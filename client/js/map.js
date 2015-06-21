'use strict';

function Map(game, player, myGame) {
	this.myGame = myGame;
	this.player = player;
	this.game = game;

	this.bg = null;
	this.tileset = null;
	this.collisionLayer = null;

};

Map.prototype = {

	create: function (data) {
		// Log Map infos
		//console.log(data);
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
		// bring player infront of world

		console.log('starting game');
	},

	update: function(mapData) {


	}
};
