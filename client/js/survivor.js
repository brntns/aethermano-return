'use strict';

function Survivor(id, game) {
	this.id = id;
	this.game = game;
	this.sprite = null;
};

Survivor.prototype = {

	create: function (x, y) {

		this.sprite = this.game.survivorGroup.getFirstDead();
		this.sprite = this.game.add.sprite(32, this.game.world.height - 150, 'blackdude');
	  this.sprite.animations.add('left', [0, 1, 2, 3], 10, true);
    this.sprite.animations.add('right', [5, 6, 7, 8], 10, true);
		this.sprite.reset(x, y);
		this.game.survivors.push(this);
	},
	update: function() {
		
		if(this.status > 'waving'){
			this.sprite.animations.play('left');
		}
		else{
			//this.sprite.animations.play('right');
		}
	}

};