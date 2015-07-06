	(function() {
	'use strict';

	function Preloader() {
		this.ready = false;
	}

	Preloader.prototype = {

		preload: function () {
    	this.game.load.image('tiles-1', 'assets/tiles-1.png');
    	this.game.load.image('item', 'assets/item.png');
    	this.game.load.spritesheet('hitbox', 'assets/slashhitbox.png', 32, 32);
			this.game.load.spritesheet('player', 'assets/player.png', 29, 29);
			this.game.load.spritesheet('enemy', 'assets/enemy.png', 64, 48);
			this.game.load.spritesheet('blackdude', 'assets/blackdude.png', 29, 29);
			this.ready = true;
		},
		update: function () {
			if (!!this.ready) {
				this.game.state.start('game');
			}
		}
	};

	window['phaser'] = window['phaser'] || {};
	window['phaser'].Preloader = Preloader;

}());
