'use strict';
var noise = require('./js/noise.js');
//var fs = require('fs');
var _ = require('lodash');

var debug = true;
var start = process.hrtime();

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
	
	create: function () {
		console.log('Creating New Map...');
		console.log('Done Creating Map!');
	}

};