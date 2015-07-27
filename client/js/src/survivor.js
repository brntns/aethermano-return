'use strict';

function Survivor(id, game) {
	this.id = id;
	this.game = game;
	this.sprite = null;
	this.lastStatus = 0;
};

Survivor.prototype = {

	create: function (data) {
		this.sprite = this.game.survivorGroup.getFirstDead();
		this.sprite = this.game.add.sprite(32, this.game.world.height - 150, 'explorer');
    // adding animations
    this.sprite.animations.add('right', [2,3,4], 10, true);
    this.sprite.animations.add('left', [12,13,14], 10, true);
    this.sprite.animations.add('death', [20,21,22,23,24,25,26,27], 10, false);
    this.sprite.animations.add('climb_ladder', [30,31,32,30,33,34], 10, true);

    this.sprite.animations.add('monk_slash_rightup', [46,45,47,48,49,46,51,50], 12, true);
    this.sprite.animations.add('monk_slash_leftup', [56,55,57,58,59,56,41,40], 12, true);
    this.sprite.animations.add('monk_slash_leftdown', [50,51,50,44,43,42,40,41], 12, true);
    this.sprite.animations.add('monk_slash_rightdown', [40,41,50,51,40,41,50,51], 12, true);

    this.sprite.animations.add('monk_slash_right', [40,41,50,51,40,41,50,51], 12, true);
    this.sprite.animations.add('monk_slash_up', [44,45,44,43,53,54,53,52], 12, true);
    this.sprite.animations.add('monk_slash_left', [50,51,50,44,43,42,40,41], 12, true);
    this.sprite.animations.add('monk_slash_down', [50,41,60,51,50,41,50,51], 12, true);

    this.sprite.animations.add('explorer_slash_right', [40,41,42,43,44,45,46,47], 12, true);
    this.sprite.animations.add('explorer_slash_left', [50,51,52,53,54,55,56,57], 12, true);

    this.sprite.animations.add('demon_slash_right', [40,41,42,43,44], 12, true);
    this.sprite.animations.add('demon_slash_left', [50,51,52,53,54], 12, true);

    this.sprite.animations.add('wizard_fireball_right', [40,41,42,43,44], 12, false);
    this.sprite.animations.add('wizard_fireball_left', [50,51,52,53,54], 12, false);

    this.sprite.animations.add('teleport_arrival', [65,64,63,62,66,67], 12, false);
    this.sprite.animations.add('teleport_depart', [60,61,62,63,64,65], 12, false);

    this.sprite.animations.add('climb_right_wall', [60,61,62,63], 12, true);
    this.sprite.animations.add('climb_left_wall', [70,71,72,73], 12, true);

    this.sprite.animations.add('climb_right_overhang', [64,65,66], 12, true);
    this.sprite.animations.add('climb_left_overhang', [74,75,76], 12, true);

    this.sprite.animations.add('native_shoot_left', [40,41,40], 12, false);
    this.sprite.animations.add('native_shoot_right', [50,51,50], 12, false);    
		this.sprite.reset(data.x, data.y);
		this.game.survivors.push(this);
	},
	update: function() {
		switch (this.sprite.status) {
		case 0: //Idle
  		if(this.lastStatus !== 0){
  			this.sprite.animations.stop();
  			this.sprite.frame = 4;
  			this.lastStatus = 0;
  		}
		break;
    case 1: //Waving
      if(this.lastStatus !== 1){
        this.sprite.animations.stop();
        this.sprite.frame = 10;
        this.lastStatus = 1;
      }
    break;
    case 2: //Walk Left
      if(this.lastStatus !== 2){
        //this.sprite.animations.stop();
        this.sprite.animations.play('left');
        this.lastStatus = 2;
      }
    break;
    case 3: //Walk Right
      if(this.lastStatus !== 3){
        //this.sprite.animations.stop();
        this.sprite.animations.play('right');
        this.lastStatus = 3;
      }
    break;
    case 4:// Jump Left
      if(this.lastStatus !== 4){
        //this.sprite.animations.stop();
        this.sprite.frame = 11;
        this.lastStatus = 4;
      }
    break;
    case 5: // Jump Right
      if(this.lastStatus !== 5){
        //this.sprite.animations.stop();
        this.sprite.frame = 1;
        this.lastStatus = 5;
      }
    break;
    case 6: // die
      if(this.lastStatus !== 6){
        //this.sprite.animations.stop();
        this.sprite.animations.play('death');
        this.lastStatus = 6;
      }
    break;
    case 100: //Classchange to Explorer
      if (this.lastStatus !== 100) {
        this.sprite.loadTexture('explorer', 0);
      }
    break;
    case 101: //Classchange to Monk
      if (this.lastStatus !== 101) {
        this.sprite.loadTexture('monk', 0);
      }
    break;
    case 102: //Classchange to Tron
      if (this.lastStatus !== 102) {
        this.sprite.loadTexture('tron', 0);
      }
    break;
    case 103: //Classchange to Wizard
      if (this.lastStatus !== 103) {
        this.sprite.loadTexture('wizard', 0);
      }
    break;
    case 104: //Classchange to Native
      if (this.lastStatus !== 104) {
        this.sprite.loadTexture('native', 0);
      }
    break;
    case 105: //Classchange to Demon
      if (this.lastStatus !== 105) {
        this.sprite.loadTexture('demon', 0);
      }
    break;
	  }
  }
};

module.exports = Survivor;
