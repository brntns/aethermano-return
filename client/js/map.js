'use strict';

function Map(game, player, myGame) {
	this.myGame = myGame;
	this.player = player;
	this.game = game;

	this.bg = null;
	this.tileset = null;
	this.collisionLayer = null;
	this.platforms = null;

};

Map.prototype = {
	
	create: function (data) {
		  
		console.log(data);
		this.game.stage.backgroundColor = '#440e62';

		this.game.load.tilemap('level1', null, data, Phaser.Tilemap.TILED_JSON );
		this.myGame.survivorGroup = this.game.add.group();
		this.myGame.survivorGroup.createMultiple(100,'dude');
		
		this.game.add.tilemap('level1');
  
  	this.tileset = this.game.add.tilemap('level1');

   	this.tileset.addTilesetImage('tiles-1');
		this.tileset.setCollisionByExclusion([ 13, 14, 15, 16, 46, 47, 48, 49, 50, 51 ]);
    this.collisionLayer = this.tileset.createLayer('Tile Layer 1');
		this.collisionLayer.resizeWorld();
	
		this.player.sprite.bringToTop();

	},

	update: function(mapData) {
	  

	}
};