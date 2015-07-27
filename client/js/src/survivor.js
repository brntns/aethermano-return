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
    //Basic Movement
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
        this.sprite.animations.stop();
        this.sprite.frame = 11;
        this.lastStatus = 4;
      }
    break;
    case 5: // Jump Right
      if(this.lastStatus !== 5){
        this.sprite.animations.stop();
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
    case 7: // Vulnerable
      if(this.lastStatus !== 7){
        this.sprite.tint = 0xFAA1A1;
        this.lastStatus = 7;
      }
    break;
    case 8: // Invulnerable
      if(this.lastStatus !== 8){
        this.sprite.tint = 0xffffff;
        this.player.sprite.alpha = 0.5;
        this.lastStatus = 8;
      }
    break;
    case 9: // Climb Ladder
      if(this.lastStatus !== 9){
        this.sprite.animations.play('climb_ladder');
        this.lastStatus = 9;
      }
    break;
    case 10: // Idle Ladder
      if(this.lastStatus !== 10){
        this.sprite.animations.stop();
        this.sprite.frame = 30;
        this.lastStatus = 10;
      }
    break;
    case 11: // Vulnerable End
      if(this.lastStatus !== 11){
        this.player.sprite.tint = 0xffffff;
        this.lastStatus = 11;
      }
    break;
    case 12: // Invulnerable End
      if(this.lastStatus !== 12){
        this.sprite.tint = 0xFAA1A1;
        this.player.sprite.alpha = 1;
        this.lastStatus = 12;
      }
    break;
    //Climbing
    case 20: // Climb Wall Left
      if(this.lastStatus !== 20){
        this.sprite.animations.play('climb_left_wall');
        this.lastStatus = 20;
      }
    break;
    case 21: // Climb Wall Right
      if(this.lastStatus !== 21){
        this.sprite.animations.play('climb_right_wall');
        this.lastStatus = 21;
      }
    break;
    case 22: // Climb Left Wall Idle
      if(this.lastStatus !== 22){
        this.sprite.animations.stop();
        this.sprite.frame = 24;
        this.lastStatus = 22;
      }
    break;
    case 23: // Climb Right Wall Idle
      if(this.lastStatus !== 23){
        this.sprite.animations.stop();
        this.sprite.frame = 25;
        this.lastStatus = 23;
      }
    break;
    case 24: // Hang Left
      if(this.lastStatus !== 24){
        this.sprite.animations.play('climb_left_overhang');
        this.lastStatus = 24;
      }
    break;
    case 25: // Hang Right
      if(this.lastStatus !== 25){
        this.sprite.animations.play('climb_right_overhang');
        this.lastStatus = 25;
      }
    break;
    case 26: // Hang Left Idle
      if(this.lastStatus !== 26){
        this.sprite.animations.stop();
        this.sprite.frame = 64;
        this.lastStatus = 26;
      }
    break;
    case 27: // Hang Right Idle
      if(this.lastStatus !== 27){
        this.sprite.animations.stop();
        this.sprite.frame = 74;
        this.lastStatus = 27;
      }
    break;
    case 28: // Hang Idle
      if(this.lastStatus !== 28){
        this.sprite.animations.stop();
        this.sprite.frame = 66;
        this.lastStatus = 28;
      }
    break;




    //Class Change
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
