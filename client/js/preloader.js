	(function() {
	'use strict';

	function Preloader() {
		this.asset = null;
		this.ready = false;
	}

	Preloader.prototype = {

		preload: function () {

    	this.game.load.image('tiles-1', 'assets/tiles-1.png');
    	this.game.load.image('item', 'assets/item.png');
			this.ready = true;
			this.game.load.spritesheet('player', 'assets/player.png', 29, 29);
			this.game.load.spritesheet('enemy', 'assets/enemy.png', 64, 48);
			this.game.load.spritesheet('blackdude', 'assets/blackdude.png', 29, 29);

		},

		create: function () {
		//	this.asset.cropEnabled = false;

		},

		update: function () {
			if (!!this.ready) {
				this.game.state.start('game');
			}
		},

		onLoadComplete: function () {
			this.ready = true;
		}
	};

	window['phaser'] = window['phaser'] || {};
	window['phaser'].Preloader = Preloader;

}());
