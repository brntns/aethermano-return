var Boot = require('./states/boot');
var Preloader = require('./states/preloader');
var Splash = require('./states/splash');
var Game = require('./game');

window.onload = function () {
	'use strict';

  window['phaser'] = {};
  window['phaser'].Boot = Boot;
	window['phaser'].Preloader = Preloader;
	window['phaser'].Splash = Splash;
  window['phaser'].Game = Game;


	var game;
	var ns = window['phaser'];

	var gameWidth = 600;
	var gameHeight = 340;
	game = new Phaser.Game(gameWidth, gameHeight, Phaser.AUTO, 'phaser-game',null,false,false);

	game.state.add('boot', ns.Boot);
	game.state.add('game', ns.Game);
	game.state.add('preloader'	, ns.Preloader);
	game.state.add('splash', ns.Splash);


	game.state.start('boot');
};
