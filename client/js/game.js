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

			this.game.physics.arcade.gravity.y = 250;
			this.game.physics.startSystem(Phaser.Physics.ARCADE);
	    this.map = new Map(this.game,this.player, this);
			this.player = new Player(this.game, this.map);
			this.client = new Client(this);
			this.client.create();

		},

		update: function () {

			if(this.player !== null){
				this.game.physics.arcade.collide(this.player.sprite,this.map.collisionLayer);
        this.player.sprite.bringToTop();
				this.player.update();
			}

			if(this.client !== null)
				this.client.update();

		},
		render: function () {
		}
	};

	window['phaser'] = window['phaser'] || {};
	window['phaser'].Game = Game;

}());
