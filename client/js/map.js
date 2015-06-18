'use strict';

function Map(game, player, myGame) {
	this.myGame = myGame;
	this.player = player;
	this.game = game;

	var bg;
	var tileset;
	var layer;
	


};

Map.prototype = {
	
	create: function (data) {
	
		this.bg = this.game.add.tileSprite(0, 0, 800, 600, 'background');
		this.myGame.survivorGroup = this.game.add.group();
		this.myGame.survivorGroup.createMultiple(100,'dude');
		
		this.game.add.tilemap('level1');
  
  	this.tileset = this.game.add.tilemap('level1');

   	this.tileset.addTilesetImage('tiles-1');

    this.tileset.setCollisionByExclusion([ 13, 14, 15, 16, 46, 47, 48, 49, 50, 51 ]);

    this.layer = this.tileset.createLayer('Tile Layer 1');

		console.log(this.map);
	
	  this.bg.fixedToCamera = true;
		this.player.sprite.bringToTop();
	},

	update: function(mapData) {
	
	}
};