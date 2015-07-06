window.onload = function () {
	'use strict';

	var game;
	var ns = window['phaser'];
	game = new Phaser.Game(1024,640, Phaser.AUTO, 'phaser-game');
	game.state.add('boot', ns.Boot);
	game.state.add('preloader', ns.Preloader);
	game.state.add('game', ns.Game);

	game.state.start('boot');
};
