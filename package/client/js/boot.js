(function () {
	'use strict';

	function Boot() {}

	Boot.prototype = {
		
		preload: function () {
	
		},

		create: function () {

			this.game.state.start('preloader');
		}
	};

	window['phaser'] = window['phaser'] || {};
	window['phaser'].Boot = Boot;

}());

