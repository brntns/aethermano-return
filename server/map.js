'use strict';
var noise = require('./js/noise.js');
//var fs = require('fs');
var _ = require('lodash');

var debug = true;
var start = process.hrtime();

var elapsed_time = function(note){
    var precision = 3; // 3 decimal places
    var elapsed = process.hrtime(start)[1] / 1000000; // divide by a million to get nano to milli
    console.log(process.hrtime(start)[0] + " s, " + elapsed.toFixed(precision) + " ms - " + note); // print message + time
    start = process.hrtime(); // reset the timer
}


exports.Map = function(){
	this.mapData = { 	
		"height":1000,
		"width":1000,
		"tileheight":64,
		"tilewidth":64,
		"x": 0,
		"y": 0,
		"orientation":"orthogonal",
		"layers":[{
				"data":[],
				"height":1000,
				"width":1000,
				"collision":false,
				"name":"bottomLayer",
				"type":"tilelayer"
			},
			{
				"data":[],
				"height":1000,
				"width":1000,
				"collision":true,
				"name":"collisionLayer",
				"type":"tilelayer"
			},
			{
				"data":[],
				"height":1000,
				"width":1000,
				"collision":true,
				"name":"fogLayer",
				"type":"tilelayer"
			},
			{
				"data":[],
				"height":1000,
				"width":1000,
				"collision":false,
				"name":"treeLayer",
				"type":"tilelayer"
			}],
		"tilesets":[{
			"firstgid":1,
			"imageheight":1024,
			"imagewidth":1024,
			"margin":0,
			"name":"grassdesert",
			"properties":{},
			"spacing":0,
			"tileheight":64,
			"tilewidth":64
		}]
	};
	this.canvas = null;
	this.context = null;
	this.imageData = null;
	this.threshold = 170;//170
	this.spawnThreshold = 240;
	this.width = 1000;
	this.height = 1000;
	this.tileEnum = {none: 0, empty: 1, ground: 2, 
					br_peice:51, tr_peice:50, bl_peice: 52, tl_peice: 49,
					top_side: 17, bottom_side: 19, right_side: 18, left_side: 20,
					br_corner: 35, tr_corner:34, bl_corner: 36, tl_corner: 33};

	this.playerSpawnPoints = [];
	this.itemSpawnPoints = [];
	this.items = [];
};

exports.Map.prototype = {
	noiseGen: function() {
		var defaultPresetArgs = {
			seed: (new Date()).toString(),
			color: 'greyscale',
			noiseFunction: 'perlin_classic', // value , simplex , perlin_classic , perlin_improved
			smoothing: 'quintic', // quintic, hermite, cosine
			scale: 33,
			size: 178,
			octaves: 3,
			persistence: 0.1,
			lacunarity: 3,
			gradientStart: '000000',
			gradientEnd: 'ffffff',
			independent: false,
			octaveFunction: 'none',
			customOctaveFunction: 'return n;',
			sumFunction: 'modular',
			customSumFunction: 'return n;',
			sineFrequencyCoeff: 1,
			modularAmplitude: 2
		};
		this.imageData = { height: this.height, width: this.width, data: new Array()};
		this.imageData = noise.Noise.update({ 
			action: 'update',
			imageData: this.imageData,
			args: defaultPresetArgs 
		});
	},

	create: function () {
		console.log('Creating New Map...');
		// this.noiseGen();
		// this.parseNoise();
		//fs.writeFile('file', JSON.stringify(this.mapData.layers));
		console.log('Done Creating Map!');
	},

	getColorOfTile: function(x,y){
		return {
			red: this.imageData.data[((this.imageData.width * y) + x) * 4],
			green: this.imageData.data[((this.imageData.width * y) + x) * 4 + 1],
			blue: this.imageData.data[((this.imageData.width * y) + x) * 4 + 2],
			alpha: this.imageData.data[((this.imageData.width * y) + x) * 4 + 3]
		};
	},

	getRandomPlayerSpawn: function(){
		var tile = this.playerSpawnPoints[parseInt(Math.random()*this.playerSpawnPoints.length)];
		tile.x *= this.mapData.tilewidth ;
		tile.y *= this.mapData.tileheight ;
		return tile;
	},

	getRandomItemSpawn: function(){
		var tile = this.itemSpawnPoints[parseInt(Math.random()*this.itemSpawnPoints.length)];
		tile.x *= this.mapData.tilewidth ;
		tile.y *= this.mapData.tileheight ;
		return tile;
	},

	getNewMapUpdate: function(newTile, oldTile){
		var length = 10;
		var tileUpdate = {};
		tileUpdate.x = newTile.x - length;
		tileUpdate.y = newTile.y - length;
		tileUpdate.width  = length * 2 + 1;
		tileUpdate.height = length * 2 + 1;
		tileUpdate.layers = [];
		tileUpdate = {
			x: newTile.x - length,
			y: newTile.y - length,
			width: length * 2 + 1, 
			height: length * 2 + 1, 
			tiles: [],
			items: []
		};

		if(debug) elapsed_time("recieved  update request, starting map");
		
		for(var y = newTile.y - length; y <= newTile.y  + length; y++){
			for(var x = newTile.x - length; x <= newTile.x + length; x++){

				//TODO has a bug where some tiles arent sent.
				if(oldTile.x !== undefined && oldTile.y !== undefined){
					if(newTile.x > oldTile.x  && x < oldTile.x + length)
						//continue;
						if(newTile.y === oldTile.y)
							continue;
						if(newTile.y > oldTile.y && y < oldTile.y + length)
							continue;
						if(newTile.y < oldTile.y  && y > oldTile.y - length)
							continue;
					if(newTile.x < oldTile.x  && x > oldTile.x - length)
						//continue;
						if(newTile.y === oldTile.y)
							continue;
						if(newTile.y > oldTile.y  && y < oldTile.y + length)
							continue;
						if(newTile.y < oldTile.y  && y > oldTile.y - length)
							continue;
				}

				for(var layerIndex = 0; layerIndex < this.mapData.layers.length; layerIndex++){
					if(this.mapData.layers[layerIndex].data[y]){
						var tileData = this.mapData.layers[layerIndex].data[y][x];
						if(tileData){
							tileUpdate.tiles.push({
								x:x, 
								y:y, 
								layer:layerIndex, 
								tile:tileData
							});
						}
					}
				}
				if(this.items[y]){
					var items = this.items[y][x];
					if(items){
						for(var itemIndex = 0; itemIndex < items.length; itemIndex++){
							tileUpdate.items.push(items[itemIndex]);
						}
					}
				}
			}
		}
		if(debug) elapsed_time("finished map update");
		return tileUpdate;
	},
	distanceBetween: function (source, target) {

        var _dx = source.x - target.x;
        var _dy = source.y - target.y;
        
        return Math.sqrt(_dx * _dx + _dy * _dy);

    },

	findoutTile: function (xin, yin){
		var foundList = [];
		var foundCornerList = [];
		var foundSides = [];
		var darkList = [];
		var darkCornerList = [];
		var darkSides = [];

		for(var x = -1; x < 2; x++) {
			for(var y = -1; y < 2; y++) {

				//Skip out of bounds.
				if(xin + x < 0 || 
					yin + y < 0 || 
					xin + x >= this.imageData.width || 
					yin + y >= this.imageData.height)
					continue;

				var color = this.getColorOfTile(xin + x, yin + y);
				if(!(color.red < this.threshold && color.green < this.threshold && color.blue < this.threshold)){
					foundList.push({
						x: x,
						y: y
					});
					if(x != 0 && y != 0){
						foundCornerList.push({
							x: x,
							y: y
						});
					}else{
						foundSides.push({
							x: x,
							y: y
						});
					}
				}else{
					darkList.push({
						x: x,
						y: y
					});
					if(x != 0 && y != 0){
						darkCornerList.push({
							x: x,
							y: y
						});
					}else{
						darkSides.push({
							x: x,
							y: y
						});
					}
				}
			}
		}

		if(foundList.length === 0 ){
			return this.tileEnum.empty;
		}

		//if no two dark sides and a corner connects.
		//skip with a empty
		var possible = false;
		var possibleCorners = [];
		for(var index = 0; index < darkCornerList.length; index++ ){
				var darkSide1 = _.find(darkSides, function(side){
					return side.x === darkCornerList[index].x && side.y === 0;
				});
				var darkSide2 = _.find(darkSides, function(side){
					return side.y === darkCornerList[index].y && side.x === 0;
				});
				if(darkSide1 !== undefined && darkSide2 !== undefined){
					possible = true;
					possibleCorners.push(darkCornerList[index]);
				}
		}

		//console.log(this.tileEnum.tl_peices);
		if(!possible)
			return 2; // will be 2

		if(possibleCorners.length === 1){
			if(possibleCorners[0].x < 0 && possibleCorners[0].y < 0)
				return this.tileEnum.tl_peice; //49
			else if(possibleCorners[0].x < 0 && possibleCorners[0].y > 0)
				return this.tileEnum.bl_peice; //50
			else if(possibleCorners[0].x > 0 && possibleCorners[0].y < 0)
				return this.tileEnum.tr_peice; //52
			else if(possibleCorners[0].x > 0 && possibleCorners[0].y > 0)
				return this.tileEnum.br_peice; //51
		}

		if(foundCornerList.length === 3){
			if(foundList.length === 6 || foundList.length === 5)
				return 12;
			var lastCorner = this.lastCorner(foundCornerList);
			if(lastCorner.x < 0 && lastCorner.y < 0)
				return this.tileEnum.tl_peice; //49
			if(lastCorner.x < 0 && lastCorner.y > 0)
				return this.tileEnum.tr_peice;
			if(lastCorner.x > 0 && lastCorner.y < 0)
				return this.tileEnum.bl_peice; //50
			if(lastCorner.x > 0 && lastCorner.y > 0)
				return this.tileEnum.br_peice;

		}else if(foundCornerList.length === 2){
			//check to see if they together... or diag
			//if together
			//return 84;
			//same

			//diag
		}

		if(foundSides.length === 2){
			if(foundSides[0].x < 0 && foundSides[1].y < 0 ||
				foundSides[1].x < 0 && foundSides[0].y < 0)
				return this.tileEnum.br_peice;
			if(foundSides[0].x < 0 && foundSides[1].y > 0 ||
				foundSides[1].x < 0 && foundSides[0].y > 0)
				return this.tileEnum.bl_peice; //50
			if(foundSides[0].x > 0 && foundSides[1].y < 0 ||
				foundSides[1].x > 0 && foundSides[0].y < 0)
				return this.tileEnum.tr_peice;
			if(foundSides[0].x > 0 && foundSides[1].y > 0 ||
				foundSides[1].x > 0 && foundSides[0].y > 0)
				return this.tileEnum.tl_peice; //49
			// if(foundList.length === 3 || foundList.length === 2)
			// 	return 2;

			//return 8;
		}
		// 			this.tileEnum = {none: 0, empty: 1, ground: 2, 
// 					br_peice:51, bl_peice:50, tr_peice: 52, tl_peice: 49,
// 					top_side: 17, bottom_side: 19, right_side: 18, left_side: 20,
// 					br_corner: 35, tr_corner:34, bl_corner: 36, tl_corner: 33};
// };
// 			return this.tileEnum.left_side;
// 			return this.tileEnum.right_side;
// 			return this.tileEnum.top_side;
// 			return this.tileEnum.bottom_side;

		if(foundList.length === 1 ){
			if(foundCornerList.length === 1){
				if(foundList[0].x < 0 && foundList[0].y < 0)
					return this.tileEnum.br_corner;
				if(foundList[0].x < 0 && foundList[0].y > 0)
					return this.tileEnum.tr_corner;
				if(foundList[0].x > 0 && foundList[0].y < 0)
					return this.tileEnum.bl_corner;
				if(foundList[0].x > 0 && foundList[0].y > 0)
					return this.tileEnum.tl_corner;
			}else{
				if(foundList[0].x > 0)
					return this.tileEnum.left_side;
				if(foundList[0].x < 0)
					return this.tileEnum.right_side;
				if(foundList[0].y > 0)
					return this.tileEnum.top_side;
				if(foundList[0].y < 0)
					return this.tileEnum.bottom_side;
			}
		}

		if(foundList.length === 2){
			if (foundCornerList.length === 1){
				if(foundList[0].x === foundList[1].x){
					if(foundList[0].x < 0)
						return this.tileEnum.right_side;
					if (foundList[0].x > 0)
						return this.tileEnum.left_side;
				}else if(foundList[0].y === foundList[1].y){
					if(foundList[0].y < 0)
						return this.tileEnum.bottom_side;
					if (foundList[0].y > 0)
						return this.tileEnum.top_side;
				}
			}else if(foundCornerList.length === 0){
				if(foundList[0].x < 0 && foundList[1].y < 0)
					return this.tileEnum.tl_peice;
				if(foundList[0].x < 0 && foundList[1].y > 0)
					return this.tileEnum.bl_peice;
				if(foundList[0].x > 0 && foundList[1].y < 0)
					return this.tileEnum.tr_peice;
				if(foundList[0].x > 0 && foundList[1].y > 0)
					return this.tileEnum.br_peice;
			}else if(foundCornerList.length === 2){
				//same
				if(foundCornerList[0].x === foundCornerList[1].x){
					if(foundCornerList[0].x < 0)
						return this.tileEnum.right_side;
					if(foundCornerList[0].x > 0)
						return this.tileEnum.left_side;

				} 
				if (foundCornerList[0].y === foundCornerList[1].y){
					if(foundCornerList[0].y < 0)
						return this.tileEnum.bottom_side;
					if(foundCornerList[0].y > 0)
						return this.tileEnum.top_side;
				}
				//diagnal
				return 84;
			}
		}

		if(foundList.length === 3){
			if(foundCornerList.length === 1){
				var foundTile = foundCornerList[0];
				if(foundTile.x < 0 && foundTile.y < 0)
					return this.tileEnum.br_peice;
				if(foundTile.x < 0 && foundTile.y > 0)
					return this.tileEnum.bl_peice;
				if(foundTile.x > 0 && foundTile.y < 0)
					return this.tileEnum.tr_peice;
				if(foundTile.x > 0 && foundTile.y > 0)
					return this.tileEnum.tl_peice;
			}else if(foundCornerList.length === 2){
				var lastTile = this.lastCorner(foundCornerList, foundList);
				if(foundCornerList[0].x === foundCornerList[1].x
					&& foundCornerList[1].x === lastTile.x){
					if(foundCornerList[0].x > 0)
						return this.tileEnum.left_side;
					if(foundCornerList[0].x < 0)
						return this.tileEnum.right_side;	
				}else if(foundCornerList[0].y === foundCornerList[1].y 
					&& foundCornerList[1].y === lastTile.y){
					if(foundCornerList[0].y > 0)
						return this.tileEnum.top_side;
					if(foundCornerList[0].y < 0)
						return this.tileEnum.bottom_side;
				}

				if(lastTile.x < 0){
					var tile = _.find(foundCornerList, function(tile) {
						return tile.x === -1 * lastTile.x;
					});
					if(tile.y < 0)
						return this.tileEnum.br_peice;
					else
						return this.tileEnum.bl_peice;
				}
				if(lastTile.x > 0){
					var tile = _.find(foundCornerList, function(tile) {
						return tile.x === -1 * lastTile.x;
					});
					if(tile.y < 0)
						return this.tileEnum.tr_peice;
					else
						return this.tileEnum.tl_peice;
				}
				if(lastTile.y < 0){
					var tile = _.find(foundCornerList, function(tile) {
						return tile.y === -1 * lastTile.y;
					});
					if(tile.x < 0)
						return this.tileEnum.br_peice;
					else
						return this.tileEnum.bl_peice;
				}
				if(lastTile.y > 0){
					var tile = _.find(foundCornerList, function(tile) {
						return tile.y === -1 * lastTile.y;
					});
					if(tile.x < 0)
						return this.tileEnum.tr_peice;
					else
						return this.tileEnum.tl_peice;
				}

			}
		}
		if(foundList.length === 4 ){
			if(foundCornerList.length === 2){
				if(foundCornerList[0].x === foundCornerList[1].x){
					var tile = _.find(foundList, function(tile) {
						return tile.x !== foundCornerList[0].x;
					});
					if(tile.y < 0 && foundCornerList[0].x < 0)
						return this.tileEnum.br_peice;
					if(tile.y > 0 && foundCornerList[0].x < 0)
						return this.tileEnum.bl_peice;
					if(tile.y < 0 && foundCornerList[0].x > 0)
						return this.tileEnum.tr_peice;
					if(tile.y > 0 && foundCornerList[0].x > 0)
						return this.tileEnum.tl_peice;
				}else if(foundCornerList[0].y === foundCornerList[1].y){
					var tile = _.find(foundList, function(tile) {
						return tile.y !== foundCornerList[0].y;
					});
					if(tile.x < 0 && foundCornerList[0].y < 0)
						return this.tileEnum.br_peice;
					if(tile.x > 0 && foundCornerList[0].y < 0)
						return this.tileEnum.tr_peice;
					if(tile.x < 0 && foundCornerList[0].y > 0)
						return this.tileEnum.bl_peice;
					if(tile.x > 0 && foundCornerList[0].y > 0)
						return this.tileEnum.tl_peice;
				}
			}
		}
		if(foundList.length === 5 
			|| foundList.length === 6 
			|| foundList.length === 7 
			|| foundList.length === 8)
			return 11;
		return 8; // should be 2 but for debuggin 8 is more noticable
	},

	lastCorner: function(corners, from){
		var possibleCorners = from || [{x: -1 , y: -1},{x: 1 , y: -1},
								{x: -1 , y: 1},{x: 1 , y: 1}];
		_.each(corners, function(corner){
			_.remove(possibleCorners, function(possibleCorner) { 
				return possibleCorner.x === corner.x &&
						possibleCorner.y === corner.y; 
			});
		});
		return possibleCorners[0];
	}
};