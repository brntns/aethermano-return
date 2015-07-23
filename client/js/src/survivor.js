'use strict';

function Survivor(id, game) {
	this.id = id;
	this.game = game;
	this.sprite = null;
};

Survivor.prototype = {

	create: function (x, y) {
		this.sprite = this.game.survivorGroup.getFirstDead();
		this.sprite = this.game.add.sprite(32, this.game.world.height - 150, 'explorer');
    // adding animations
    this.sprite.animations.add('right', [2,3,4], 10, true);
    this.sprite.animations.add('left', [12,13,14], 10, true);
		this.sprite.animations.add('death', [20,21,22,23,24,25,26,27], 10, false);
		this.sprite.animations.add('monk_slash_rightup', [36,35,37,38,39,36,41,40], 16, true);
		this.sprite.animations.add('monk_slash_leftup', [46,45,47,48,49,46,31,30], 16, true);
		this.sprite.animations.add('monk_slash_leftdown', [40,41,40,34,33,32,30,31], 16, true);
		this.sprite.animations.add('monk_slash_rightdown', [30,31,40,41,30,31,40,41], 16, true);

		this.sprite.animations.add('monk_slash_right', [30,31,40,41,30,31,40,41], 16, true);
		this.sprite.animations.add('monk_slash_up', [34,35,34,33,43,44,43,42], 16, true);
		this.sprite.animations.add('monk_slash_left', [40,41,40,34,33,32,30,31], 16, true);
		this.sprite.animations.add('monk_slash_down', [50,41,60,51,50,41,50,51], 16, true);

		this.sprite.animations.add('climb_right_wall', [30,31,32,33], 12, true);
		this.sprite.animations.add('climb_left_wall', [40,41,42,43], 12, true);

		this.sprite.animations.add('climb_right_overhang', [34,35,36], 12, true);
		this.sprite.animations.add('climb_left_overhang', [44,45,46], 12, true);
		this.sprite.reset(x, y);
		this.game.survivors.push(this);
	},
	update: function() {
		//console.log(this.sprite.status);
		if(this.sprite.status === 0){
			this.sprite.animations.stop();
			this.sprite.frame = 4;
		}
		else if(this.sprite.status === 1){

		}
		else if(this.sprite.status === 2){
				this.sprite.animations.play('left');
		}
		else if(this.sprite.status === 3){
			this.sprite.animations.play('right');
		}
		else if(this.sprite.status === 4){
		}
		else if(this.sprite.status === 5){

		}
		else if(this.sprite.status === 6){
			this.sprite.animations.play('death');
		}
		else if(this.sprite.status === 100){
		this.sprite.loadTexture('explorer', 0);
		}
		else if(this.sprite.status === 101){
		this.sprite.loadTexture('monk', 0);
		}
		else if(this.sprite.status === 102){
			this.sprite.loadTexture('tron', 0);
		}
		else if(this.sprite.status === 103){
			this.sprite.loadTexture('wizard', 0);
		}


	}
};

module.exports = Survivor;
