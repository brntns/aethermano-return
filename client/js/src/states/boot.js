'use strict';

function Boot(Game) {};

Boot.prototype = {

	preload: function () {

	},

	create: function () {
		this.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
		this.scale.pageAlignHorizontally = true;
		this.scale.pageAlignVertically = true;
		this.scale.setScreenSize(true);
		this.game.state.start('preloader');
	}
};

module.exports = Boot;
