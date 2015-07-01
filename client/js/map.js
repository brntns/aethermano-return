'use strict';

function Map(game, player, myGame) {
	this.myGame = myGame;
	this.player = player;
	this.game = game;
	this.bg = null;
  this.maps = null;
  this.tilemap = null;
  this.currentMap = null;
	this.tileset = null;
	this.collisionLayer = null;
  this.portal = {};
  this.portal.x = null;
  this.portal.y = null;
  this.client = null;

}

var mapBase = {

	create: function (data) {
		// Log Map infos
	//	console.log(data + this.player.level);

    this.maps = data;
    this.setCurrentLevel(this.maps[0],'level1')

		this.game.stage.backgroundColor = '#440e62';
		//load map

		// add player Group
		this.myGame.survivorGroup = this.game.add.group();
		this.myGame.survivorGroup.createMultiple(100,'dude');
		//add tilemap


	},

	update: function(data) {
    this.maps = data;
    var ll = this.player.level;
    //console.log(ll);
   // this.setCurrentLevel(this.maps[ll],'level'+ll);
	},
  setCurrentLevel:function(level,name){
    console.log(name);
     this.currentMap = this.maps[0];
     console.log(this.tileset);

     if(this.tileset !== null){
      this.tileset.destroy();
      console.log('destroyed');
     }

      this.game.load.tilemap('level1', null, this.currentMap, Phaser.Tilemap.TILED_JSON );
      this.tileset = this.game.add.tilemap('level1');

    this.tileset.setCollisionByExclusion([ 13, 14, 15, 16, 46, 47, 48, 49, 50, 51 ]);
     this.tileset.addTilesetImage('tiles-1');
   //  this.tileset.resizeWorld();
    //Set collisionLayer
    this.collisionLayer = this.tileset.createLayer('Tile Layer 1');
    this.collisionLayer.resizeWorld();
    this.portal.x = this.currentMap.portalPosx * 16;
    this.portal.y = this.currentMap.portalPosy * 16;


    console.log('//// PORTAL SPAWNED AT');
    console.log('//// x:' +(this.currentMap.portalPosx * 16) + 'y:'+ (this.currentMap.portalPosy * 16));
    console.log('starting game');


  }
}

var map = {};
_.extend(map, mapBase);

Map.prototype = map;
