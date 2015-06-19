(function() {
	'use strict';

	function Menu() {
		this.titleTxt = null;
		this.startTxt = null;
	}

	Menu.prototype = {

		create: function () {
			var x = this.game.width / 2
				, y = this.game.height / 2;


			this.titleTxt = this.add.bitmapText(x, y,  'carrier_command','press space to jump !',18);
		
			y = y + this.titleTxt.height + 5;
			this.startTxt = this.add.bitmapText(x, y, 'carrier_command','start',18);
			

			this.input.onDown.add(this.onDown, this);
		},

		update: function () {

		},

		onDown: function () {
			this.game.state.start('boot');
		}
	};

	window['phaser'] = window['phaser'] || {};
	window['phaser'].Menu = Menu;

}());