'use strict';

function Map(game, player, myGame) {
	this.myGame = myGame;
	this.player = player;
	this.game = game;
	this.sprites = [];
	this.tilemap = null;
	this.tileset = null;
	this.canvas = null;
	this.pix = null;
	this.threshold = 140;//200;//115;
	this.bottomLayer = null;
	this.collisionLayer = null;

};

Map.prototype = {

	create: function (data) {
		//this.game.stage.backgroundColor = '#7ec622';
		this.game.load.tilemap('map', null, data, Phaser.Tilemap.TILED_JSON );
		this.tilemap = this.game.add.tilemap('map');
		//CrateLayers and bring groups to top.
		this.bottomLayer = this.tilemap.createLayer('bottomLayer');
		this.myGame.survivorGroup = this.game.add.group();
		this.myGame.survivorGroup.createMultiple(100,'dude');
		this.player.sprite.bringToTop();
		this.collisionLayer = this.game.add.group();
	

		for(var y = 0; y < this.tilemap.height; y++) {
			for(var index = 0; index < this.tilemap.layers.length; index++){
				this.tilemap.layers[index].data[y] = [];
			}
		}
	
	},

	update: function(mapData) {
		
	}
};