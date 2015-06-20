'use strict';
var noise = require('./js/noise.js');
//var fs = require('fs');
var _ = require('lodash');
var debug = true;
var start = process.hrtime();
var ret = 640;
exports.Map = function(){
	this.mapData = { 
    "height":16,
    "layers":[{
       "data":[],
        "height":ret,
        "name":"Tile Layer 1",
        "opacity":1,
        "type":"tilelayer",
        "visible":true,
        "width":ret,
        "x":0,
        "y":0
    }],
    "orientation":"orthogonal",
    "properties":{},
    "tileheight":16,
    "tilesets":[{
       "firstgid":1,
       "image":"tiles-1.png",
       "imageheight":64,
       "imagewidth":272,
       "margin":0,
       "name":"tiles-1",
       "properties":{},
       "spacing":0,
       "tileheight":16,
       "tilewidth":16
    }],
    "tilewidth":16,
    "version":1,
    "width":16,
  };
  this.map = [];
  this.maps;
};
exports.Map.prototype = {
	create: function () {
	console.log('Creating New Map...');
    this.generate(ret);
    this.setMap();
	console.log('Done Creating Map!');
	},
  	clear: function() {
    this.mapSize = null;
    this.map = [];
  	}, 
  	generate: function (size) {
    this.clear();
    this.mapSize = size * size;
    //Clear Terrain
    	for (var y = 0; y < this.mapSize; y++) {
      		this.map[y] = 0;
    	}
    //Build Terrain
    	var platformNum = Math.floor(this.mapSize/100);
    	for (var y = 0; y < platformNum; y++) {
    		var platformPosition = Math.floor(this.mapSize*Math.random());
    		var platformSize = Math.floor(27*Math.random())+3;
    		for (var z = 0; z < platformSize;z++){
    			var platformColour = Math.floor(28*Math.random())+17;
    			this.map[platformPosition+z] = platformColour;
    			var platformColour = Math.floor(28*Math.random())+17;
    			this.map[platformPosition+z+ret] = platformColour;
    		}
    	}
    //Create Cavities
    	var caveNum = Math.floor(this.mapSize/1000);
    	for (var y = 0; y < caveNum; y++){
    		var cavePosition = Math.floor(this.mapSize*Math.random());
    		var caveSize_x = Math.floor(27*Math.random())+3;
    		var caveSize_y = Math.floor(27*Math.random())+3;
    	}
  	},
  	setMap: function(){
    	this.mapData.layers[0].data = this.map;
  	}
};
















