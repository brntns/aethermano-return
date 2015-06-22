(function() {
	'use strict';

	function Game() {
		this.client = null;
		this.player = null;
		this.map = null;
		this.survivors = [];
		this.survivorGroup = null;
	}

	Game.prototype = {

		create: function () {
       this.game.time.advancedTiming = true;
        this.game.time.desiredFps = 27;
        this.game.time.fps = 30;

            console.log(this.game.time);
			this.game.physics.startSystem(Phaser.Physics.ARCADE);
	    this.map = new Map(this.game,this.player, this);
			this.player = new Player(this.game, this.map);
			this.client = new Client(this);
			this.client.create();
		},

		update: function () {
         this.game.time.fps= 27;
        this.game.debug.text(this.game.time.fps || '--', 2, 14, "#00ff00");

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

	window['phaser'] = window['phaser'] || {};
	window['phaser'].Game = Game;

}());
