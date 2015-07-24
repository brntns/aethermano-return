'use strict';

function Survivor(id, game) {
	this.id = id;
	this.game = game;
	this.sprite = null;
	this.lastStatus = 0;
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
		switch (this.sprite.status) {
		case 0: //Idle
  		if(this.lastStatus !== 0){
  			//this.sprite.animations.stop();
  			this.sprite.frame = 4;
  			this.lastStatus = 0;
  		}
		break;
    case 1: //Waving
      if(this.lastStatus !== 1){
        //this.sprite.animations.stop();
        this.sprite.frame = 10;
        this.lastStatus = 1;
      }
    break;
    case 2:
      if(this.lastStatus !== 2){
        //this.sprite.animations.stop();
        this.sprite.animations.play('left');
        this.lastStatus = 2;
      }
    break;
    case 3:
      if(this.lastStatus !== 3){
        //this.sprite.animations.stop();
        this.sprite.animations.play('right');
        this.lastStatus = 3;
      }
    break;
    case 4:
      if(this.lastStatus !== 4){
        //this.sprite.animations.stop();
        this.lastStatus = 4;
      }
    break;
    case 5:
      if(this.lastStatus !== 5){
        //this.sprite.animations.stop();
        this.lastStatus = 5;
      }
    break;
    case 6:
      if(this.lastStatus !== 6){
        //this.sprite.animations.stop();
        this.sprite.animations.play('death');
        this.lastStatus = 6;
      }
    break;
    case 100:
      if (this.lastStatus !== 100) {
        this.sprite.loadTexture('explorer', 0);
      }
    break;
    case 101:
      if (this.lastStatus !== 101) {
        this.sprite.loadTexture('monk', 0);
      }
    break;
    case 102:
      if (this.lastStatus !== 102) {
        this.sprite.loadTexture('tron', 0);
      }
    break;
    case 103:
      if (this.lastStatus !== 103) {
        this.sprite.loadTexture('wizard', 0);
      }
    break;
    case 104:
      if (this.lastStatus !== 104) {
        this.sprite.loadTexture('native', 0);
      }
    break;
    case 105:
      if (this.lastStatus !== 105) {
        this.sprite.loadTexture('demon', 0);
      }
    break;
	  }
  }
};

module.exports = Survivor;
