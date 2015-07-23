var Explorer = require('./explorer');
var Monk = require('./monk');
var TronSoldier = require('./tronSoldier');
var Wizard = require('./wizard');

var movement = {
  update: function update() {
    // this.game.debug.spriteInfo(this.sprite, 32, 620);
    this.isActive = true;
    if (!this.dieing) {
      //Switching Class
      //Character Classes: Explorer = 0, Monk = 1, Tron Soldier = 2, Wizard = 3, (Big Brawn = 4, Dark = 5)
      if (this.getNewPlayerClass() !== -1 && this.getNewPlayerClass !== this.playerClass) {
        this.setPlayerClass(this.getNewPlayerClass());
      }
      //Basic Movement
      if (this.moveMode === 0) {
        //Running
        this.directions();
        this.climbingMask();
        this.basicRunning();
        //Jumping
        this.jumpCond();
        if (this.jumpButton.isDown) {
          this.jumpy();
        }
      }
      //Class Movement
      this.classUpdate();
    }
  },
  getNewPlayerClass: function getNewPlayerClass() {
    if (this.class0.isDown) {
      return 0;
    }
    if (this.class1.isDown) {
      return 1;
    }
    if (this.class2.isDown) {
      return 2;
    }
    if (this.class3.isDown) {
      return 3;
    }
    if (this.class4.isDown) {
      return 4;
    }
    if (this.class5.isDown) {
      return 5;
    }
    return -1;
  },
  setPlayerClass: function setPlayerClass (classId) {
    switch (classId) {
      case 0:
        _.extend(this, Explorer);
        break;
      case 1:
        _.extend(this, Monk);
        break;
      case 2:
        _.extend(this, TronSoldier);
        break;
      case 3:
        _.extend(this, Wizard);
      break;
      case 4:
      break;
      case 5:
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
      //this.status = 'right';
      this.moveLR(1, this.sprite);
    //Looking UP/LEFT
    } else if (this.direction === 4) {
      //this.status = 'left';
      this.moveLR(-1, this.sprite);
    //Looking DOWN/LEFT
    } else if (this.direction === 6) {
    //  this.status = 'left';
      this.moveLR(-1, this.sprite);
    //Looking DOWN/RIGHT
    } else if (this.direction === 8) {
    //  this.status = 'right';
      this.moveLR(1, this.sprite);
    //Looking RIGHT
    } else if (this.direction === 1) {
    //  this.status = 'right';
      this.moveLR(1, this.sprite);
    //Looking UP
    } else if (this.direction === 3) {
      this.decelerate(this.sign(this.sprite.body.velocity.x));
    //Looking LEFT
    } else if (this.direction === 5) {
    //  this.status = 'left';
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
    if (body.onFloor && !this.slashing && !this.gliding && !this.dieing) {
      this.sprite.animations.stop();
      this.sprite.frame = 0;
    }
  },
  jumpCond: function jumpCond() {
    if (this.sprite.body.blocked.up) {
      this.jumpWindow = false;
      this.jumpSpeedBonus = 0;
      this.wallWindow = false;
    }
    if (!this.jumpButton.isDown) {
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
    if (this.sprite.body.blocked.left && !this.wallJumpL && !this.jumpButton.isDown) {
      this.wallJumpL = true;
      this.game.time.events.remove(this.wallWindow);
      this.wallWindow = this.game.time.events.add(this.wallJumpTime,function(){this.wallJumpL = false;this.wallJumpR = false;},this);
    } else if (this.sprite.body.blocked.right && !this.wallJumpR && !this.jumpButton.isDown) {
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
    if (!this.slashing && !this.gliding) {
      this.sprite.animations.stop();
      if ( this.sprite.body.velocity.x < -1) {
        this.sprite.frame = 11;
      } else if ( this.sprite.body.velocity.x > 1) {
        this.sprite.frame = 1;
      } else {
        this.sprite.frame = 0;
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
    if (body.onFloor() && !this.slashing && !this.gliding && !this.dieing) {
      if (sign === -1) {
        this.sprite.animations.play('left');
      } else {
        this.sprite.animations.play('right');
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
  }
};
module.exports = movement;
