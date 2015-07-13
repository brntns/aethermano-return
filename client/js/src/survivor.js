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
	//	console.log(this.sprite.status);
		if(this.sprite.status === 'left'){
			this.sprite.animations.play('left');
		}
		else if(this.sprite.status === 'right'){
			this.sprite.animations.play('right');
		}
		else if(this.sprite.status === null){
		  this.sprite.animations.stop();
      this.sprite.frame = 4;
		}

	}
};

module.exports = Survivor;
