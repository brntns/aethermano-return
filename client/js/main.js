window.onload = function () {
	'use strict';

	var game;
	var ns = window['phaser'];

	game = new Phaser.Game(600, 400, Phaser.AUTO, 'phaser-game');
	game.state.add('boot', ns.Boot);
	game.state.add('preloader', ns.Preloader);
	//game.state.add('menu', ns.Menu);
	game.state.add('game', ns.Game);

	game.state.start('boot');
};