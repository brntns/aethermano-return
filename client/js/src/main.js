var Boot = require('./boot');
var Preloader = require('./preloader');
var Splash = require('./splash');
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

	var gameWidth = 800;
	var gameHeight = 480;
	game = new Phaser.Game(gameWidth, gameHeight, Phaser.AUTO, 'phaser-game',null,false,false);

	
	game.state.add('boot', ns.Boot);
	game.state.add('game', ns.Game);
	game.state.add('preloader'	, ns.Preloader);
	game.state.add('splash', ns.Splash);


	game.state.start('boot');
};
