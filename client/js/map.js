'use strict';

function Map(game, player, myGame) {
	this.myGame = myGame;
	this.player = player;
	this.game = game;

	this.bg = null;
	this.tileset = null;
	this.tilemap = null;
	this.collisionLayer = null;
	this.items = [];

};

Map.prototype = {
	
	create: function (data) {
		console.log(data);
		this.game.stage.backgroundColor = '#440e62';
		this.myGame.survivorGroup = this.game.add.group();
		this.myGame.survivorGroup.createMultiple(100,'dude');

		//this.game.load.tilemap('level1', null, data, Phaser.Tilemap.TILED_JSON );

		//this.game.add.tilemap('level1');
  
  	this.tileset = this.game.add.tilemap('level1');

   	this.tileset.addTilesetImage('tiles-1');
		this.tileset.setCollisionByExclusion([ 13, 14, 15, 16, 46, 47, 48, 49, 50, 51 ]);
    this.collisionLayer = this.tileset.createLayer('collisionLayer');
	//	this.collisionLayer.resizeWorld();
	  
		
		this.player.sprite.bringToTop();

	},
	update: function(mapData) {
		//console.log(mapData);
		// for(var tileIndex = 0; tileIndex < mapData.tiles.length; tileIndex++) {
		// 		var tileInfo = mapData.tiles[tileIndex];
		// 		// {
		// 		// 	x:x, 
		// 		// 	y:y, 
		// 		// 	layer:layerIndex, 
		// 		// 	tile:this.mapData.layers[layerIndex].data[y][x]
		// 		// }
		// 		if(tileInfo.tile){
		// 			this.tilemap.layers[tileInfo.layer].data[tileInfo.y ][tileInfo.x ] = new Phaser.Tile(
		// 				this.tilemap.layers[tileInfo.layer], 
		// 				tileInfo.tile,
		// 				tileInfo.x,tileInfo.y,64,64);
		// 			var tile = this.tilemap.layers[tileInfo.layer].data[tileInfo.y][tileInfo.x];
		// 			if(tileInfo.layer > 0){
		// 				tile.setCollision(true,true,true,true);
		// 				tile.faceTop = true;
		// 				tile.faceBottom = true;
		// 				tile.faceLeft = true;
		// 				tile.faceRight = true;
		// 			}
		// 			//console.log(tile.collides);
		// 		}
		// }

		// //collision
		// //change this to only do it around player
		// for(var tileIndex = 0; tileIndex < mapData.tiles.length; tileIndex++) {
		// 	var tileInfo = mapData.tiles[tileIndex];
		// 	if(tileInfo.layer > 0){
		// 		var tile = this.tilemap.layers[tileInfo.layer].data[tileInfo.y][tileInfo.x];
		// 		if(tile){
		// 			var above = this.tilemap.getTileAbove(tileInfo.layer, tileInfo.x, tileInfo.y);
		// 			var below = this.tilemap.getTileBelow(tileInfo.layer, tileInfo.x, tileInfo.y);
		// 			var left = this.tilemap.getTileLeft(tileInfo.layer, tileInfo.x, tileInfo.y);
		// 			var right = this.tilemap.getTileRight(tileInfo.layer, tileInfo.x, tileInfo.y);
		// 			if (above && above.collides)
		// 				tile.faceTop = false;
		// 			if (below && below.collides)
		// 				tile.faceBottom = false;
		// 			if (left && left.collides)
		// 				tile.faceLeft = false;
		// 			if (right && right.collides)
		// 				tile.faceRight = false;
		// 		}
		// 	}
		// }
		// //TODO Code for recycling tiles when necessary...

		// this.updateItems(mapData.items);
	},

	updateItems: function (items){
		// item
		// {
		// 	x:x,
		// 	y:y,
		// 	key:'items',//sprite key
		// 	//frame:optional //spriteset frame
		// 	id:1, //branch
		// 	name:'branch',
		// 	stats: [] //optional for armor, damage, speed, food
		// 				//{type: ___, value:___}
		// }
		// for(var itemIndex = 0; itemIndex < items.length; itemIndex++) {
		// 	var item = items[itemIndex];
		// 	this.items.create(item.x * 64, item.y * 64, item.key, item.frame, true);
		// }
	}
};