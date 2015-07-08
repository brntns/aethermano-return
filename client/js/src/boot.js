'use strict';

function Boot() {};

Boot.prototype = {

	preload: function () {

	},

	create: function () {
		this.game.state.start('preloader');
	}
};

module.exports = Boot;
