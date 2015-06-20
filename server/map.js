'use strict';
var noise = require('./js/noise.js');
//var fs = require('fs');
var _ = require('lodash');

var debug = true;
var start = process.hrtime();

exports.Map = function(){
	this.mapData = { 
    "height":16,
    "layers":[{
       "data":[],
        "height":32,
        "name":"Tile Layer 1",
        "opacity":1,
        "type":"tilelayer",
        "visible":true,
        "width":32,
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
    this.generate(32);

    console.log(this.map + '!');
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
    console.log(this.mapSize);
 
    for (var y = 0; y < this.mapSize; y++) {
      this.map[y] = 0;
    }

  },
  setMap: function(){
      this.mapData.layers[0].data = this.map;
  }
    
};