(function() {
	'use strict';

	function Preloader() {
		this.asset = null;
		this.ready = false;
	}

	Preloader.prototype = {

		preload: function () {
			this.asset = this.add.sprite(320, 240, 'preloader');
			this.asset.anchor.setTo(0.5, 0.5);

			this.load.onLoadComplete.addOnce(this.onLoadComplete, this);
			this.load.setPreloadSprite(this.asset);
			this.game.load.spritesheet('dude', 'assets/dude.png', 32, 48);

		},

		create: function () {
			this.asset.cropEnabled = false;
		},

		update: function () {
			if (!!this.ready) {
				//this.game.state.start('menu');
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
