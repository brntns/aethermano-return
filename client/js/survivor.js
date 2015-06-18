'use strict';

function Survivor(id, game) {
	this.id = id;
	this.game = game;
	this.sprite = null;
};

Survivor.prototype = {

	create: function (x, y) {
		this.sprite = this.game.survivorGroup.getFirstDead();
	  this.sprite.animations.add('left', [0, 1, 2, 3], 10, true);
    this.sprite.animations.add('right', [5, 6, 7, 8], 10, true);
		this.sprite.reset(x, y);
		this.game.survivors.push(this);
			console.log(this.cursor);
	},

	update: function() {
	
		if(this.speed > 0){
			this.sprite.animations.play('walk');
		}else{
			this.sprite.animations.play('stand');
		}
	}

};