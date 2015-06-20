	(function() {
	'use strict';

	function Preloader() {
		this.asset = null;
		this.ready = false;
	}

	Preloader.prototype = {

		preload: function () {

    	this.game.load.bitmapFont('carrier_command', 'assets/carrier_command.png', 'assets/carrier_command.xml');
    	this.game.load.image('tiles-1', 'assets/tiles-1.png');
			this.ready = true;
			this.game.load.spritesheet('dude', 'assets/dude.png', 32, 40);
			this.game.load.spritesheet('blackdude', 'assets/blackdude.png', 32, 40);

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
