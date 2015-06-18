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
		

			this.game.physics.startSystem(Phaser.Physics.ARCADE);
	
			this.player = new Player(this.game, this.map);
			this.map = new Map(this.game,this.player, this);

			this.client = new Client(this);
			this.client.create();

		},

		update: function () {
			if(this.player !== null){
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
