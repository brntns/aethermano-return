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
  	randomTerrain: function (numb, pos_xMin, pos_xMax, pos_yMin, pos_yMax, size_xMin, size_xMax, size_yMin, size_yMax, colourMin, colourMax) {
  		var num = Math.floor(this.mapSize/numb);
    	for (var y = 0; y < num; y++) {
    		var Position_x = Math.floor(Math.random()*(pos_xMax-pos_xMin+1)+pos_xMin);
    		var Position_y = Math.floor(Math.random()*(pos_yMax-pos_yMin+1)+pos_yMin);
    		var Size_x = Math.floor(Math.random()*(size_xMax-size_xMin+1)+size_xMin);
    		var Size_y = Math.floor(Math.random()*(size_yMax-size_yMin+1)+size_yMin);
    		for (var z = 0; z < Size_x;z++){
    			for (var i = 0; i < Size_y; i++){
    				var Colour = Math.floor(Math.random()*(colourMax-colourMin+1)+colourMin);
    				this.map[Position_x+Position_y*ret+z+i*ret] = Colour;
    			}
    		}
    	}
  	},
  	portal: function(pos_xMin, pos_xMax, pos_yMin, pos_yMax, size_x, size_y, portalRadius) {
    	var Position_x = Math.floor(Math.random()*(pos_xMax-pos_xMin+1)+pos_xMin);
    	var Position_y = Math.floor(Math.random()*(pos_yMax-pos_yMin+1)+pos_yMin);
    	for (var z = 0; z < size_x; z++){
    		for (var i = 0; i < size_y; i++){
    			if(Math.sqrt((z-size_x/2)*(z-size_x/2)+(i-size_y/2)*(i-size_y/2)) < portalRadius){
    				var portalColour = Math.floor(Math.random()*4+13);
    				this.map[Position_x+Position_y*ret+z+i*ret] = portalColour;
    			}
    			else {
    				this.map[Position_x+Position_y*ret+z+i*ret] = 0;
    			}
    		}
    	}
  	},
  	generate: function (size) {
    	this.clear();
    	this.mapSize = size * size;
    //Clear Terrain
    	for (var y = 0; y < this.mapSize; y++) {
      		this.map[y] = 0;
    	}
    //Build Terrain
    	this.randomTerrain(100, 0, ret , 0 , ret, 3, 30, 1, 2, 17, 45);
    	this.randomTerrain(1000, 0, ret , 0 , ret, 3, 30, 3, 30, 0, 0);
    	this.randomTerrain(700, 0, ret , 0 , ret, 1, 10, 1, 1, 17, 45);
    	this.portal(0,ret,0,ret,24,24,8);
    /*	var platformNum = Math.floor(this.mapSize/100);
    	for (var y = 0; y < platformNum; y++) {
    		var platformPosition = Math.floor(this.mapSize*Math.random());
    		var platformSize_x = Math.floor(27*Math.random())+3;
    		var platformSize_y = 2;
    		for (var z = 0; z < platformSize_x;z++){
    			for (var i = 0; i < platformSize_y; i++){
    				var platformColour = Math.floor(28*Math.random())+17;
    				this.map[platformPosition+z+(i*ret)] = platformColour;
    			}
    		}
    	}
    //Create Cavities
    	var caveNum = Math.floor(this.mapSize/2000);
    	for (var y = 0; y < caveNum; y++){
    		var cavePosition = Math.floor(this.mapSize*Math.random());
    		var caveSize_x = Math.floor(27*Math.random())+3;
    		var caveSize_y = Math.floor(27*Math.random())+3;
    		for (var z = 0; z < caveSize_x;z++){
    			for (var i = 0; i < caveSize_y; i++){
    				this.map[cavePosition+z+(i*ret)] = 0;
    			}
    		}
 
    	} */
  	},
  	setMap: function(){
    	this.mapData.layers[0].data = this.map;
  	}
};
















