var Items = require('./items');
var Player = require('./player/player');
var Map = require('./map');
var Client = require('./client');

function Game() {
	this.client = null;
	this.player = null;
	this.map = null;
  this.win = false;
  this.items = null;
	this.survivors = [];
	this.survivorGroup = null;
}

Game.prototype = {
	create: function () {

    this.game.time.advancedTiming = true;
   // console.log(this.game.time);
    this.game.time.desiredFps = 60;

		this.game.physics.startSystem(Phaser.Physics.ARCADE);

    this.items = new Items(this.game, this.map, this);
		this.player = new Player(this.game, this.map);
    this.map = new Map(this.game,this.player, this);
		this.client = new Client(this);
		this.client.create();

	},

	update: function () {
    //console.log(this.map.portal.x);
    //  console.log(this.player.sprite.x  +' '+ this.map.portal.x  +' '+this.player.sprite.y +' '+ this.map.portal.y )
    //  this.game.time.fps= 27;
    this.game.debug.text(this.player.level || '--', 2, 14, "#00ff00");
    if(this.player.sprite.x > this.map.portal.x && this.player.sprite.x < this.map.portal.x +300 && this.player.sprite.y > this.map.portal.y && this.player.sprite.y < this.map.portal.y + 300 && !this.win){
      console.log('CELEBRATE');
      this.win = true;
      this.client.loadnewMap();

    }
    // if player exists
		if(this.player !== null){
      // make player collide
			this.game.physics.arcade.collide(this.player.sprite,this.map.collisionLayer);
      // bring player sprite to top
      this.player.sprite.bringToTop();
      // Update the player
			this.player.update();
		}
    // if not
    if(this.client !== null)
      this.client.update();
	},
	render: function () {
	}
};

module.exports = Game;
