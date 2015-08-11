var Explorer = require('./classes/explorer');
var Monk = require('./classes/monk');
var TronSoldier = require('./classes/tronSoldier');
var Wizard = require('./classes/wizard');
var Native = require('./classes/native');
var Icemage = require('./classes/icemage');
var Witchdoc = require('./classes/witchdoc');
var Knight = require('./classes/knight');
var Conjurer = require('./classes/conjurer');
var Jester = require('./classes/jester');

var movement = {
  update: function update() {
    this.isActive = true;
    if(this.dieing){
      this.chatting();
    }
    if (!this.dieing) {
      //Switching Class
      //Character Classes: Explorer = 0, Monk = 1, Tron Soldier = 2, Wizard = 3, (Big Brawn = 4, Dark = 5)
      if (this.getNewPlayerClass() !== -1 && this.getNewPlayerClass !== this.playerClass) {
        this.setPlayerClass(this.getNewPlayerClass());
      } else {
        //Basic Movement
        if (this.moveMode === 0) {
          //Running
          this.directions();
          this.basicRunning();
          //Jumping
          this.jumpCond();
          if (this.letterSpace.isDown) {
            this.jumpy();
          }
          if (this.direction === 3 && this.onLadder) {
            this.switchToLadder();
            this.game.time.events.add(150,function(){this.mountingLadder = true;},this);
            if (this.sprite.body.blocked.down) {
              this.sprite.y -= 1;
              this.mountingLadder = false;
            }
          }
        }
        if (this.moveMode === 3) {
          if (this.letterSpace.isDown || !this.onLadder || this.sprite.body.blocked.down) {
            this.switchToNormal();
          }
          this.directions();
          this.climbLadder();
          this.climbLadderAnimation();
        }
        //Class Movement
        this.classUpdate();
      }
    }
  },
  getNewPlayerClass: function getNewPlayerClass() {
    if (this.class0.isDown && this.playerClass !== 0) {
      return 0;
    }
    if (this.class1.isDown && this.playerClass !== 1) {
      return 1;
    }
    if (this.class2.isDown && this.playerClass !== 2) {
      return 2;
    }
    if (this.class3.isDown && this.playerClass !== 3) {
      return 3;
    }
    if (this.class4.isDown && this.playerClass !== 4) {
      return 4;
    }
    if (this.class5.isDown && this.playerClass !== 5) {
      return 5;
    }
    if (this.class6.isDown && this.playerClass !== 6) {
      return 6;
    }
    if (this.class7.isDown && this.playerClass !== 7) {
      return 7;
    }
    if (this.class8.isDown && this.playerClass !== 8) {
      return 8;
    }
    if (this.class9.isDown && this.playerClass !== 9) {
      return 9;
    }
    return -1;
  },
  setPlayerClass: function setPlayerClass (classId) {
    this.sprite.body.setSize(29,29,0,0);
    this.shrunk = false;
    switch (classId) {
      case 0:
        _.extend(this, Explorer);
        this.class = 1000;
        break;
      case 1:
        _.extend(this, Monk);
        this.class = 1001;
        break;
      case 2:
        _.extend(this, TronSoldier);
        this.class = 1002;
        break;
      case 3:
        _.extend(this, Wizard);
        this.class = 1003;
      break;
      case 4:
        _.extend(this, Native);
        this.class = 1004;
      break;
      case 5:
        _.extend(this, Jester);
        this.class = 1005;
      break;
      case 6:
        _.extend(this, Icemage);
        this.class = 1006;
      break;
      case 7:
        _.extend(this, Witchdoc);
        this.class = 1007;
      break;
      case 8:
        _.extend(this, Knight);
        this.class = 1008;
      break;
      case 9:
        _.extend(this, Conjurer);
        this.class = 1009;
      break;
    }
    this.classInit();
  },
  classUpdate: function classUpdate() {
    // placeholder to be overwritten.
  },
  directions: function directions() {
    //Looking UP/RIGHT
    if (this.cursors.right.isDown && this.cursors.up.isDown) {
      this.direction = 2;
    //Looking UP/LEFT
    } else if (this.cursors.left.isDown && this.cursors.up.isDown) {
      this.direction = 4;
    //Looking DOWN/LEFT
    } else if (this.cursors.left.isDown && this.cursors.down.isDown) {
      this.direction = 6;
    //Looking DOWN/RIGHT
    } else if (this.cursors.right.isDown && this.cursors.down.isDown) {
      this.direction = 8;
    //Looking RIGHT
    } else if (this.cursors.right.isDown) {
      this.direction = 1;
    //Looking UP
    } else if (this.cursors.up.isDown) {
      this.direction = 3;
    //Looking LEFT
    } else if (this.cursors.left.isDown) {
      this.direction = 5;
    //Looking DOWN
    } else if (this.cursors.down.isDown) {
      this.direction = 7;
    //Idle
    } else {
      this.direction = 0;
    }
    if (this.direction != 0 && !this.slashing) {
      this.Facing = this.direction;
    }
  },
  basicRunning: function basicRunning() {
    // populate bit Array TEST
    if (this.cursors.left.isDown && this.cursors.right.isDown) {
      this.sprite.body.acceleration.x = 0;
    //Looking UP/RIGHT
    } else if (this.direction === 2) {
      this.moveLR(1, this.sprite);
    //Looking UP/LEFT
    } else if (this.direction === 4) {
      this.moveLR(-1, this.sprite);
    //Looking DOWN/LEFT
    } else if (this.direction === 6) {
      this.moveLR(-1, this.sprite);
    //Looking DOWN/RIGHT
    } else if (this.direction === 8) {
      this.moveLR(1, this.sprite);
    //Looking RIGHT
    } else if (this.direction === 1) {
      this.moveLR(1, this.sprite);
    //Looking UP
    } else if (this.direction === 3) {
      this.decelerate(this.sign(this.sprite.body.velocity.x));
    //Looking LEFT
    } else if (this.direction === 5) {
      this.moveLR(-1, this.sprite);
    //Looking DOWN
    } else if (this.direction === 7) {
      this.decelerate(this.sign(this.sprite.body.velocity.x));
    //Deceleration and Standing Still
    } else {
      this.decelerate(this.sign(this.sprite.body.velocity.x));
    }
  },
  decelerate: function decelerate(sign) {
    var body = this.sprite.body;
    //Sliding Friction
    if(body.onFloor() && (sign*body.velocity.x > this.groundCutoff)) {
       body.acceleration.x = -sign*this.groundFriction;
    }
    //Air Resistance
     else if (!body.onFloor() && sign*body.velocity.x > this.airCutoff) {
      body.acceleration.x = -sign*this.airFriction;
    }
    //Stopping
    else {
      body.velocity.x = 0;
      body.acceleration.x = 0;
    }
    //Animation Standing
    if (body.onFloor && !this.slashAni && !this.gliding && !this.dieing) {
      this.sprite.animations.stop();
      this.sprite.frame = 0;
      this.status = 0;
    }
  },
  jumpCond: function jumpCond() {
    if (this.sprite.body.blocked.up) {
      this.jumpWindow = false;
      this.jumpSpeedBonus = 0;
      this.wallWindow = false;
    }
    if (!this.letterSpace.isDown) {
      this.jumpRelease = true;
      if (this.jumpStop) {
        this.jumpStop = false;
        if (this.sprite.body.velocity.y < 0) {
          this.sprite.body.velocity.y = 0;
        }
      }
      if (this.jumpWindow) {
        this.jumpWindow = false;
        this.jumpSpeedBonus = 0;
      }
      if (this.sprite.body.onFloor()) {
        this.bunnyKiller = false;
      }
    }
    if (this.sprite.body.blocked.left && !this.wallJumpL && !this.letterSpace.isDown) {
      this.wallJumpL = true;
      this.game.time.events.remove(this.wallWindow);
      this.wallWindow = this.game.time.events.add(this.wallJumpTime,function(){this.wallJumpL = false;this.wallJumpR = false;},this);
    } else if (this.sprite.body.blocked.right && !this.wallJumpR && !this.letterSpace.isDown) {
      this.wallJumpR = true;
      this.game.time.events.remove(this.wallWindow);
      this.wallWindow = this.game.time.events.add(this.wallJumpTime,function(){this.wallJumpL = false;this.wallJumpR = false;},this);
    }
  },
  jumpy: function jumpy() {
    if ((this.sprite.body.onFloor() && !this.bunnyKiller) || this.jumpWindow) {
      this.jump();
    } else if (this.wallJumpL && this.jumpRelease && this.cursors.right.isDown) {
      this.jump();
      this.wallJumpL = false;
      this.wallJumpR = false;
      this.sprite.body.velocity.x = this.wallJumpBoost;
    } else if (this.wallJumpR && this.jumpRelease && this.cursors.left.isDown) {
      this.jump();
      this.wallJumpL = false;
      this.wallJumpR = false;
      this.sprite.body.velocity.x = -this.wallJumpBoost;
    }
  },
  jump: function jump() {
    this.bunnyKiller = true;
    this.jumpRelease = false;
    this.jumpStop = true;
    if (this.sprite.body.onFloor()) {
      this.jumpSpeedBonus = (Math.abs(this.sprite.body.velocity.x))/this.jumpSpeedCoeff;
      this.jumpWindow = true;
      this.game.time.events.remove(this.jumpWindowTimer);
      this.jumpWindowTimer = this.game.time.events.add(this.jumpAirtime,function(){this.jumpWindow = false;this.jumpSpeedBonus = 0;},this);
    }
    else if (this.wallJumpL) {
      this.jumpWindow = true;
      this.jumpSpeedBonus = this.wallJumpBonus;
      this.game.time.events.remove(this.jumpWindowTimer);
      this.jumpWindowTimer = this.game.time.events.add(this.jumpAirtime,function(){this.jumpWindow = false;this.jumpSpeedBonus = 0;},this);
    }
    else if (this.wallJumpR) {
      this.jumpWindow = true;
      this.jumpSpeedBonus = this.wallJumpBonus;
      this.game.time.events.remove(this.jumpWindowTimer);
      this.jumpWindowTimer = this.game.time.events.add(this.jumpAirtime,function(){this.jumpWindow = false;this.jumpSpeedBonus = 0;},this);
    }
    this.sprite.body.velocity.y = -this.jumpSpeedBase-this.jumpSpeedBonus;
    //Animation Jumping
    if (!this.slashAni && !this.gliding) {
      this.sprite.animations.stop();
      if ( this.sprite.body.velocity.x < -1) {
        this.sprite.frame = 11;
        this.status = 4;
      } else if ( this.sprite.body.velocity.x > 1) {
        this.sprite.frame = 1;
        this.status = 5;
      } else {
        this.sprite.frame = 0;
        this.status = 0;
      }
    }
  },
  moveLR: function moveLR(sign){
    var body = this.sprite.body;
    //Braking
    if (sign*body.velocity.x < 0) {
      if (body.onFloor()) {
        body.acceleration.x = sign*this.braking;
      } else {
        body.acceleration.x = sign*Math.max(this.airbraking,sign*this.airbrakeHigh*body.velocity.x);
      }
    //Starting
    } else if (body.onFloor && sign*body.velocity.x < this.boostWindow) {
      body.velocity.x = sign*this.boost;
    //Cruising
    } else {
      if (body.onFloor()) {
        body.acceleration.x = sign*this.runnig;
      } else if (sign*body.velocity.x < this.floatWindow) {
        body.acceleration.x = sign*this.floating;
      } else {
        body.acceleration.x = 0;
      }
    }
    //Animation
    if (body.onFloor() && !this.slashAni && !this.gliding && !this.dieing) {
      if (sign === -1) {
        this.sprite.animations.play('left');
        this.status = 2;
      } else {
        this.sprite.animations.play('right');
        this.status = 3;
      }
    } else if (!body.onFloor() && !this.slashAni && !this.gliding && !this.dieing) {
      if (sign === -1) {
        this.sprite.frame = 11;
        this.status = 4;
      } else {
        this.sprite.frame = 1;
        this.status = 5;
      }
    }
  },
  //Simple sign function. "sign" is also the parameter for multiple functions here. do not be confused though.
  sign: function sign(x){
    if(x < 0){
      return -1;
    } else {
      return 1;
    }
  },
  switchToNormal: function switchToNormal() {
    this.moveMode = 0;
    this.sprite.body.maxVelocity.y = 500;
    this.sprite.body.allowGravity = true;
    this.tronWindow = true;
    this.mountingLadder = false;
    this.game.time.events.add(500,function(){this.tronWindow = false;},this);
  },
  switchToLadder: function switchToLadder() {
    this.moveMode = 3;
    this.sprite.body.velocity.x = 0;
    this.sprite.body.velocity.y = 0;
    this.sprite.body.acceleration.x = 0;
    this.sprite.body.acceleration.y = 0;
    this.sprite.body.allowGravity = false;
  },
  climbLadder: function climbLadder() {
    var upspeed = 150;
    var downspeed = 150;
    var sidespeed = 75;
    if (!this.mountingLadder) {
      this.sprite.body.velocity.y = 0;
      if (!this.cursors.up.isDown) {
        this.mountingLadder = true;
      }
    }
    if (this.mountingLadder) {
      if (this.direction === 2 || this.direction === 3 || this.direction === 4 ) {
        // moving up
        this.sprite.body.velocity.y = -upspeed;
      } else if (this.direction === 6 || this.direction === 7 || this.direction === 8 ) {
        // moving down
        this.sprite.body.velocity.y = downspeed;
      } else {
        // resting
        this.sprite.body.velocity.y = 0;
      }
    }
    if (this.mountingLadder) {
      if (this.direction === 8 || this.direction === 1 || this.direction === 2 ) {
        // moving right
        this.sprite.body.velocity.x = sidespeed;
      } else if (this.direction === 4 || this.direction === 5 || this.direction === 6 ) {
        // moving left
        this.sprite.body.velocity.x = -sidespeed;
      } else {
        // resting
        this.sprite.body.velocity.x = 0;
      }
    }
  },
  climbLadderAnimation: function climbLadderAnimation() {
    if (!this.slashAni) {
      if (this.mountingLadder) {
        if (this.direction === 2 || this.direction === 3 || this.direction === 4 ) {
          // moving up
          this.sprite.animations.play('climb_ladder');
          this.status = 9;
        } else if (this.direction === 6 || this.direction === 7 || this.direction === 8 ) {
          // moving down
          this.sprite.animations.play('climb_ladder');
          this.status = 7;
        }
      }
      if (this.mountingLadder) {
        if (this.direction === 8 || this.direction === 1 || this.direction === 2 ) {
          // moving right
          this.sprite.animations.play('climb_ladder');
          this.status = 9;
        } else if (this.direction === 4 || this.direction === 5 || this.direction === 6 ) {
          // moving left
          this.sprite.animations.play('climb_ladder');
          this.status = 9;
        }
      }
      if (this.sprite.body.velocity.x === 0 && this.sprite.body.velocity.y === 0) {
        this.sprite.animations.stop();
        this.sprite.frame = 30;
        this.status = 10;
      }
    }
  }
};

module.exports = movement;
