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
		this.game.stage.backgroundColor = '#440e62';
		this.myGame.survivorGroup = this.game.add.group();
		this.myGame.survivorGroup.createMultiple(100,'dude');
		this.game.load.tilemap('map', 'assets/tilemaps/maps/tile_collision_test.json', null, Phaser.Tilemap.TILED_JSON);
		this.game.add.tilemap('level1');
  
  	this.tileset = this.game.add.tilemap('level1');

   	this.tileset.addTilesetImage('tiles-1');
		this.tileset.setCollisionByExclusion([ 13, 14, 15, 16, 46, 47, 48, 49, 50, 51 ]);
    this.collisionLayer = this.tileset.createLayer('Tile Layer 1');
		this.collisionLayer.resizeWorld();
	  
		console.log(data);
		this.player.sprite.bringToTop();

	},

	update: function(mapData) {
	  

	}
};