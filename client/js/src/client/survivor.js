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

    this.sprite.animations.add('wizard_teleport', [60,61,62,63,64,65,65,64,63,62,66,67], 12, false);

    this.sprite.animations.add('climb_right_wall', [60,61,62,63], 12, true);
    this.sprite.animations.add('climb_left_wall', [70,71,72,73], 12, true);

    this.sprite.animations.add('climb_right_overhang', [64,65,66], 12, true);
    this.sprite.animations.add('climb_left_overhang', [74,75,76], 12, true);

    this.sprite.animations.add('native_shoot_left', [40,41,40], 12, false);
    this.sprite.animations.add('native_shoot_right', [50,51,50], 12, false);

    this.sprite.animations.add('icemage_fly_left', [16,17,18,19], 12, true);
    this.sprite.animations.add('icemage_fly_right', [6,7,8,9], 12, true);
    this.sprite.animations.add('icemage_cast_right', [40,41,42,43,44,45], 12, false);
    this.sprite.animations.add('icemage_cast_left', [50,51,52,53,54,55], 12, false);

    this.sprite.animations.add('witchdoc_cast_right', [40,41,42,43,44,45,46], 12, false);
    this.sprite.animations.add('witchdoc_cast_left', [50,51,52,53,54,55,56], 12, false);

    this.sprite.animations.add('knight_block_right', [40,41], 12, true);
    this.sprite.animations.add('knight_block_left', [50,51], 12, true);
    this.sprite.animations.add('knight_blocked_right', [40,41], 12, true);
    this.sprite.animations.add('knight_blocked_left', [50,51], 12, true);
    this.sprite.animations.add('knight_charge_right', [40,41], 12, true);
    this.sprite.animations.add('knight_charge_left', [50,51], 12, true);
    this.sprite.animations.add('knight_charging_right', [40,41], 12, true);
    this.sprite.animations.add('knight_charging_left', [50,51], 12, true);

    this.sprite.animations.add('conjurer_cast_right', [40,41,42,43], 12, false);
    this.sprite.animations.add('conjurer_cast_left', [50,51,52,53], 12, false);
    this.sprite.animations.add('conjurer_jumpCast_right', [60,61,62], 12, false);
    this.sprite.animations.add('conjurer_jumpCast_left', [70,71,72], 12, false);
    this.sprite.animations.add('conjurer_jump_right', [63,64,65,66], 12, true);
    this.sprite.animations.add('conjurer_jump_left', [73,74,75,76], 12, true);

    this.sprite.animations.add('jester_throw_right', [40,41,42,43,44], 12, false);
    this.sprite.animations.add('jester_throw_left', [50,51,52,53,54], 12, false);
    this.sprite.animations.add('jester_fart_right', [40,41,42,43,44], 12, false);
    this.sprite.animations.add('jester_fart_left', [50,51,52,53,54], 12, false);

		this.sprite.anchor.x = 0.5;
			this.sprite.anchor.y = 0.5;
		this.sprite.reset(data.x, data.y);
		this.sprite.class = data.class;
		this.game.survivors.push(this);
		this.game.lights.add(this.sprite);
	},
	update: function() {

		switch (this.sprite.class) {
		//Basic Movement
		//Class Change
		case 1000: //Classchange to Explorer
			if (this.lastStatus !== 1000) {
				this.sprite.loadTexture('explorer', 0);
				this.lastStatus = 1000;
			}
		break;
		case 1001: //Classchange to Monk
			if (this.lastStatus !== 1001) {
				this.sprite.loadTexture('monk', 0);
				this.lastStatus = 1001;
			}
		break;
		case 1002: //Classchange to Tron
			if (this.lastStatus !== 1002) {
				this.sprite.loadTexture('tron', 0);
				this.lastStatus = 1002;
			}
		break;
		case 1003: //Classchange to Wizard
			if (this.lastStatus !== 1003) {
				this.sprite.loadTexture('wizard', 0);
				this.lastStatus = 1003;
			}
		break;
		case 1004: //Classchange to Native
			if (this.lastStatus !== 1004) {
				this.sprite.loadTexture('native', 0);
				this.lastStatus = 1004;
			}
		break;
		case 1005: //Classchange to Jester
			if (this.lastStatus !== 1005) {
				this.sprite.loadTexture('jester', 0);
				this.lastStatus = 1005;
			}
		break;
		case 1006: //Classchange to Icemage
			if (this.lastStatus !== 1006) {
				this.sprite.loadTexture('icemage', 0);
				this.lastStatus = 1006;
			}
		break;
		case 1007: //Classchange to Witchdoc
			if (this.lastStatus !== 1007) {
				this.sprite.loadTexture('witchdoc', 0);
				this.lastStatus = 1007;
			}
		break;
		case 1008: //Classchange to Knight
			if (this.lastStatus !== 1008) {
				this.sprite.loadTexture('knight', 0);
				this.lastStatus = 1008;
			}
		break;
		case 1009: //Classchange to Conjurer
			if (this.lastStatus !== 1009) {
				this.sprite.loadTexture('conjurer', 0);
				this.lastStatus = 1009;
			}
		break;
	}
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
    // case 7: // Vulnerable
    //   if(this.lastStatus !== 7){
    //     this.sprite.tint = 0xFAA1A1;
    //     this.lastStatus = 7;
    //   }
    // break;
    // case 8: // Invulnerable
    //   if(this.lastStatus !== 8){
    //     this.sprite.tint = 0xffffff;
    //     this.player.sprite.alpha = 0.5;
    //     this.lastStatus = 8;
    //   }
    // break;
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
        this.sprite.tint = 0xffffff;
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
        this.sprite.frame = 71;
        this.lastStatus = 22;
      }
    break;
    case 23: // Climb Right Wall Idle
      if(this.lastStatus !== 23){
        this.sprite.animations.stop();
        this.sprite.frame = 61;
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
    //Class Animations
    //Explorer
    case 50: //Slash Left
      if(this.lastStatus !== 50){
        this.sprite.animations.play('explorer_slash_left');
        this.lastStatus = 50;
      }
    break;
    case 51: //Slash Right
      if(this.lastStatus !== 51){
        this.sprite.animations.play('explorer_slash_right');
        this.lastStatus = 51;
      }
    break;

    //Monk
    case 60: //Slash Right
      if(this.lastStatus !== 60){
        this.sprite.animations.play('monk_slash_right');
        this.lastStatus = 60;
      }
    break;
    case 61: //Slash Right Up
      if(this.lastStatus !== 61){
        this.sprite.animations.play('monk_slash_rightup');
        this.lastStatus = 61;
      }
    break;
    case 62: //Slash Up
      if(this.lastStatus !== 62){
        this.sprite.animations.play('monk_slash_up');
        this.lastStatus = 62;
      }
    break;
    case 63: //Slash Left Up
      if(this.lastStatus !== 63){
        this.sprite.animations.play('monk_slash_leftup');
        this.lastStatus = 63;
      }
    break;
    case 64: //Slash Left
      if(this.lastStatus !== 64){
        this.sprite.animations.play('monk_slash_left');
        this.lastStatus = 64;
      }
    break;
    case 65: //Slash Left Down
      if(this.lastStatus !== 65){
        this.sprite.animations.play('monk_slash_leftdown');
        this.lastStatus = 65;
      }
    break;
    case 66: //Slash Down
      if(this.lastStatus !== 66){
        this.sprite.animations.play('monk_slash_down');
        this.lastStatus = 66;
      }
    break;
    case 67: //Slash Right Down
      if(this.lastStatus !== 67){
        this.sprite.animations.play('monk_slash_rightdown');
        this.lastStatus = 67;
      }
    break;
    case 68: // Power Dive Left
      if(this.lastStatus !== 68){
        this.sprite.animations.stop();
        this.sprite.frame = 15;
        this.lastStatus = 68;
      }
    break;
    case 69: // Power Dive Right
      if(this.lastStatus !== 69){
        this.sprite.animations.stop();
        this.sprite.frame = 5;
        this.lastStatus = 69;
      }
    break;

    // Tron
    case 70: //Attack
      if(this.lastStatus !== 70){
        //this.sprite.animations.play('tron_attack');
        this.lastStatus = 70;
      }
    break;
    case 71: //Tronmove Left
      if(this.lastStatus !== 71){
        //this.sprite.animations.play('tron_attack');
        this.sprite.frame = 43;
        this.lastStatus = 71;
      }
    break;
    case 72: //Tronmove Right
      if(this.lastStatus !== 72){
        //this.sprite.animations.play('tron_attack');
        this.sprite.frame = 41;
        this.lastStatus = 72;
      }
    break;
    case 73: //Tronmove Up
      if(this.lastStatus !== 73){
        //this.sprite.animations.play('tron_attack');
        this.sprite.frame = 42;
        this.lastStatus = 73;
      }
    break;
    case 74: //Tronmove Down
      if(this.lastStatus !== 74){
        //this.sprite.animations.play('tron_attack');
        this.sprite.frame = 40;
        this.lastStatus = 74;
      }
    break;

    //Wizard
    case 80: //Fireball Left
      if(this.lastStatus !== 80){
        this.sprite.animations.play('wizard_fireball_left');
        this.lastStatus = 80;
      }
    break;
    case 81: //Fireball Right
      if(this.lastStatus !== 81){
        this.sprite.animations.play('wizard_fireball_right');
        this.lastStatus = 81;
      }
    break;
    case 82: //Teleport
      if(this.lastStatus !== 82){
        this.sprite.animations.play('wizard_teleport');
        this.lastStatus = 82;
      }
    break;

    //Native
    case 90: //Shoot Left
      if(this.lastStatus !== 90){
        this.sprite.animations.play('native_shoot_left');
        this.lastStatus = 90;
      }
    break;
    case 91: //Shoot Right
      if(this.lastStatus !== 91){
        this.sprite.animations.play('native_shoot_right');
        this.lastStatus = 91;
      }
    break;

    //Jester
    case 100: //Shoot Left
      if(this.lastStatus !== 100){
        this.sprite.animations.play('jester_throw_left');
        this.lastStatus = 100;
      }
    break;
    case 101: //Shoot Right
      if(this.lastStatus !== 101){
        this.sprite.animations.play('jester_throw_right');
        this.lastStatus = 101;
      }
    break;
    case 102: //Fart Left
      if(this.lastStatus !== 102){
        this.sprite.animations.play('jester_fart_left');
        this.lastStatus = 102;
      }
    break;
    case 103: //Fart Right
      if(this.lastStatus !== 103){
        this.sprite.animations.play('jester_fart_right');
        this.lastStatus = 103;
      }
    break;

    //Icemage
    case 110: //Icelance Left
      if(this.lastStatus !== 110){
        this.sprite.animations.play('icemage_cast_left');
        this.lastStatus = 110;
      }
    break;
    case 111: //Icelance Right
      if(this.lastStatus !== 111){
        this.sprite.animations.play('icemage_cast_right');
        this.lastStatus = 111;
      }
    break;
    case 112: //Fly Left
      if(this.lastStatus !== 112){
        this.sprite.animations.play('icemage_fly_left');
        this.lastStatus = 112;
      }
    break;
    case 113: //Fly Right
      if(this.lastStatus !== 113){
        this.sprite.animations.play('icemage_fly_right');
        this.lastStatus = 113;
      }
    break;

    //Witchdoc
    case 120: //Voodoo Skull Left
      if(this.lastStatus !== 120){
        this.sprite.animations.play('witchdoc_cast_left');
        this.lastStatus = 120;
      }
    break;
    case 121: //Voodoo Skull Right
      if(this.lastStatus !== 121){
        this.sprite.animations.play('witchdoc_cast_right');
        this.lastStatus = 121;
      }
    break;
    case 122: //Shrink
      if(this.lastStatus !== 122){
        this.sprite.loadTexture('witchdoc_shrunk', 0);
        this.lastStatus = 122;
      }
    break;
    case 123: //Unshrink
      if(this.lastStatus !== 123){
        this.sprite.loadTexture('witchdoc', 0);
        this.lastStatus = 123;
      }
    break;

    //Knight
    case 130: //Block Left
      if(this.lastStatus !== 130){
        this.sprite.animations.play('knight_block_left');
        this.lastStatus = 130;
      }
    break;
    case 131: //Block Right
      if(this.lastStatus !== 131){
        this.sprite.animations.play('knight_block_right');
        this.lastStatus = 131;
      }
    break;
    case 132: //Blocked Left
      if(this.lastStatus !== 132){
        this.sprite.animations.play('knight_blocked_left');
        this.lastStatus = 132;
      }
    break;
    case 133: //Blocked Right
      if(this.lastStatus !== 133){
        this.sprite.animations.play('knight_blocked_right');
        this.lastStatus = 133;
      }
    break;
  	    case 134: //Charge Left
      if(this.lastStatus !== 134){
        this.sprite.animations.play('knight_charge_left');
        this.lastStatus = 134;
      }
    break;
    case 135: //Charge Right
      if(this.lastStatus !== 135){
        this.sprite.animations.play('knight_charge_right');
        this.lastStatus = 135;
      }
    break;
    case 136: //Charging Left
      if(this.lastStatus !== 136){
        this.sprite.animations.play('knight_charging_left');
        this.lastStatus = 136;
      }
    break;
    case 137: //Charging Right
      if(this.lastStatus !== 137){
        this.sprite.animations.play('knight_charging_right');
        this.lastStatus = 137;
      }
    break;

    //Conjurer
    case 140: //Cast Left
      if(this.lastStatus !== 140){
        this.sprite.animations.play('conjurer_cast_left');
        this.lastStatus = 140;
      }
    break;
    case 141: //Block Right
      if(this.lastStatus !== 141){
        this.sprite.animations.play('conjurer_cast_right');
        this.lastStatus = 141;
      }
    break;
    case 142: //Cast Jump Left
      if(this.lastStatus !== 142){
        this.sprite.animations.play('conjurer_jumpCast_left');
        this.lastStatus = 142;
      }
    break;
    case 143: //Cast Jump Right
      if(this.lastStatus !== 143){
        this.sprite.animations.play('conjurer_jumpCast_right');
        this.lastStatus = 143;
      }
    break;
        case 144: //Jump Left
      if(this.lastStatus !== 144){
        this.sprite.animations.play('conjurer_jump_left');
        this.lastStatus = 144;
      }
    break;
    case 145: //Jump Right
      if(this.lastStatus !== 145){
        this.sprite.animations.play('conjurer_jump_right');
        this.lastStatus = 145;
      }
    break;
    }
  }
};

module.exports = Survivor;
