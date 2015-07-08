var Boot = require('./boot');
var Game = require('./game');
var Preloader = require('./preloader');

window.onload = function () {
	'use strict';

  window['phaser'] = {};
  window['phaser'].Boot = Boot;
  window['phaser'].Game = Game;
  window['phaser'].Preloader = Preloader;

	var game;
	var ns = window['phaser'];
	game = new Phaser.Game(1024,640, Phaser.AUTO, 'phaser-game');
	game.state.add('boot', ns.Boot);
	game.state.add('preloader', ns.Preloader);
	game.state.add('game', ns.Game);

	game.state.start('boot');
};
