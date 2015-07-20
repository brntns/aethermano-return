var movement = {
  mouseMov: function mouseMov() {
    // this.game.debug.spriteInfo(this.sprite, 32, 620);
    //Character Classes: Explorer = 0, Monk = 1, Tron Soldier = 2, Wizard = 3
    this.isActive = true;
    if (this.class0.isDown && this.playerClass != 0) {
      this.playerClass = 0;
      this.sprite.loadTexture('explorer', 0);
    } else if (this.class1.isDown && this.playerClass != 1) {
      this.playerClass = 1;
        this.sprite.loadTexture('monk', 0);
    } else if (this.class2.isDown && this.playerClass != 2) {
      this.playerClass = 2;
    } else if (this.class3.isDown && this.playerClass != 3) {
      this.playerClass = 3;
    }
    //Movement
    if (this.moveMode === 0) {
      //Running
      this.directions();
      this.climbingMask();
      this.basicRunning();
      //Jumping
      this.jumpCond();
      if (this.jumpButton.isDown) {
        //console.log(this.climbBoxUR+' '+this.climbBoxUL+' '+this.climbBoxDL+' '+this.climbBoxDR);
        this.jumpy();
      }
      //spawning a ladder
      if (this.ladderButton.isDown) {
        if (!this.ladderOnCD) {
          this.ladderSpawn = true;
          this.ladderOnCD = true;
          this.game.time.events.add(this.ladderCD,function(){this.ladderOnCD = false;},this);
        }
      }
      //Teleporting
      if (this.playerClass === 3) {
        if (this.teleport.isDown && !this.teleportcd) {
          this.teleportLR(this.direction);
        }
      }
      //Switching to Tronmove
      if (this.playerClass === 2) {
        if (this.tron.isDown) {
          if (!this.tronWindow && this.tronCool) {
            this.switchToTron();
          }
        }
      }
      //Attacking
      //Slash
      this.slashingDirection();
      if (this.slash.isDown) {
        if (!this.slashed) {
          this.slashat();
          this.slashed = true;
        }
        //Switching to Climb
        if (this.playerClass === 0) {
          if (this.climbBoxUR || this.climbBoxUL) {
            this.switchToClimb();
          }
        }
      } else {
        this.slashed = false;
      }
    //Tronmove
    } else if (this.moveMode === 1) {
      //Reverting to Normal Movement
      if (this.tron.isDown  || this.sprite.body.blocked.up
                            || this.sprite.body.blocked.down
                            || this.sprite.body.blocked.left
                            || this.sprite.body.blocked.right) {
        if (!this.tronWindow) {
          this.switchToNormal();
        }
      }
      //Tronmoving
      this.tronMove();
    //Climbing
    } else if (this.moveMode === 2) {
      this.climbingMask();
      //Reverting to Normal Movement
      if (!this.slash.isDown || (!this.climbBoxUR && !this.climbBoxUL && !this.climbBoxDL && !this.climbBoxDR)) {
        this.switchToNormal();
      }
      this.directions();
      this.climb();
    }
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
    if (this.direction != 0) {
      this.Facing = this.direction;
    }
  },
  basicRunning: function basicRunning() {
    // populate bit Array TEST
    if (this.cursors.left.isDown && this.cursors.right.isDown) {
      this.sprite.body.acceleration.x = 0;
    //Looking UP/RIGHT
    } else if (this.direction === 2) {
      this.status = 'right';
      this.moveLR(1, this.sprite);
    //Looking UP/LEFT
    } else if (this.direction === 4) {
      this.status = 'left';
      this.moveLR(-1, this.sprite);
    //Looking DOWN/LEFT
    } else if (this.direction === 6) {
      this.status = 'left';
      this.moveLR(-1, this.sprite);
    //Looking DOWN/RIGHT
    } else if (this.direction === 8) {
      this.status = 'right';
      this.moveLR(1, this.sprite);
    //Looking RIGHT
    } else if (this.direction === 1) {
      this.status = 'right';
      this.moveLR(1, this.sprite);
    //Looking UP
    } else if (this.direction === 3) {
      this.decelerate(this.sign(this.sprite.body.velocity.x));
    //Looking LEFT
    } else if (this.direction === 5) {
      this.status = 'left';
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
    if (body.onFloor) {
      this.sprite.animations.stop();
      this.sprite.frame = 0;
    }
  },
  jumpCond: function jumpCond() {
    if (this.sprite.body.blocked.up) {
      if (this.playerClass === 1) {
        this.glide(0);
      }
      this.jumpWindow = false;
      this.jumpSpeedBonus = 0;
      this.wallWindow = false;
    } else if (this.playerClass === 1) {
      if (this.sprite.body.blocked.down) {
      this.glide(0);
    }
    }
    if (!this.jumpButton.isDown) {
      if (this.playerClass === 1) {
        this.glide(0);
      }
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
    } else if (this.playerClass === 1) {
       if (this.sprite.body.velocity.y > 0 && this.sprite.body.velocity.y < 400 && this.jumpRelease) {
        this.glide(1);
      } else if (this.sprite.body.velocity.y > 400 && this.jumpRelease) {
        this.glide(2);
      }
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
    this.sprite.animations.stop();
    if ( this.sprite.body.velocity.x < -20) {
      this.sprite.frame = 14;
    } else if ( this.sprite.body.velocity.x > 20) {
      this.sprite.frame = 7;
    } else {
      this.sprite.frame = 1;
    }
  },
  glide: function glide(N) {
    if (N === 0) {
      if (this.gliding) {
        this.sprite.body.acceleration.y = 0;
        this.sprite.body.maxVelocity.y = 500;
        this.sprite.body.allowGravity = true;
        this.gliding = false;
        console.log('gliding stopped');
      }
    } else if (N === 1) {
      if (!this.gliding) {
        this.gliding = true;
        this.sprite.body.maxVelocity.y = 80;
        console.log('gliding');
      }
    } else if (N === 2) {
      if (!this.gliding) {
        this.gliding = true;
        this.sprite.body.allowGravity = false;
        this.sprite.body.acceleration.y = -500;
        console.log('soaring');
      }
    }
  },
  teleportLR: function teleportLR(z) {
    if (z === 1) {
      this.sprite.x = this.sprite.x + this.teleportRangeX;
    } else if (z === 2){
      this.sprite.y = this.sprite.y - Math.floor(this.teleportRangeY/1.5);
      this.sprite.x = this.sprite.x + Math.floor(this.teleportRangeX/1.5);
    } else if (z === 3){
      this.sprite.y = this.sprite.y - Math.floor(this.teleportRangeY);
    } else if (z === 4){
      this.sprite.y = this.sprite.y - Math.floor(this.teleportRangeY/1.5);
      this.sprite.x = this.sprite.x - Math.floor(this.teleportRangeX/1.5);
    } else if (z === 5){
      this.sprite.x = this.sprite.x - Math.floor(this.teleportRangeX);
    } else if (z === 6){
      this.sprite.y = this.sprite.y + Math.floor(this.teleportRangeY/1.5);
      this.sprite.x = this.sprite.x - Math.floor(this.teleportRangeX/1.5);
    } else if (z === 7){
      this.sprite.y = this.sprite.y + Math.floor(this.teleportRangeY);
    } else {
      this.sprite.y = this.sprite.y + Math.floor(this.teleportRangeY/1.5);
      this.sprite.x = this.sprite.x + Math.floor(this.teleportRangeX/1.5);
    }
    this.teleportcd = true;
    this.game.time.events.add(this.teleportCd,function(){this.teleportcd = false;},this);
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
    if (body.onFloor()) {
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
  },
  slashat: function slashat() {
    this.hitbox.visible = true;
    this.slashing = true;
    this.game.time.events.remove(this.slashTimer);
    this.slashTimer = this.game.time.events.add(this.slashTime,function(){this.hitbox.visible = false;this.slashing = false;},this);
  },
  slashingDirection: function slashingDirection() {
    if (this.Facing === 1) {
      this.hitbox.x = this.sprite.x + 27;
      this.hitbox.y = this.sprite.y - 3;
    } else if (this.Facing === 2) {
      this.hitbox.x = this.sprite.x + 27;
      this.hitbox.y = this.sprite.y - 30;
    } else if (this.Facing == 3) {
      this.hitbox.x = this.sprite.x - 1;
      this.hitbox.y = this.sprite.y - 30;
    } else if (this.Facing === 4) {
      this.hitbox.x = this.sprite.x - 30;
      this.hitbox.y = this.sprite.y - 30;
    } else if (this.Facing === 5) {
      this.hitbox.x = this.sprite.x - 30;
      this.hitbox.y = this.sprite.y - 3;
    } else if (this.Facing === 6) {
      this.hitbox.x = this.sprite.x - 30;
      this.hitbox.y = this.sprite.y + 30;
    } else if (this.Facing === 7) {
      this.hitbox.x = this.sprite.x - 1;
      this.hitbox.y = this.sprite.y + 31;
    } else if (this.Facing === 8) {
      this.hitbox.x = this.sprite.x + 27;
      this.hitbox.y = this.sprite.y + 31;

    } /* else {
      this.hitbox.x = this.sprite.x - 1;
      this.hitbox.y = this.sprite.y - 3;
    } */
  },
  climbingMask: function climbingMask() {
    this.climbboxUR.x = this.sprite.x+15;
    this.climbboxUR.y = this.sprite.y-4;
    this.climbboxUL.x = this.sprite.x-4;
    this.climbboxUL.y = this.sprite.y-4;
    this.climbboxDL.x = this.sprite.x-4;
    this.climbboxDL.y = this.sprite.y+15;
    this.climbboxDR.x = this.sprite.x+15;
    this.climbboxDR.y = this.sprite.y+15;
  },
  switchToNormal: function switchToNormal() {
    console.log('Switched to Normal');
    this.moveMode = 0;
    this.sprite.body.maxVelocity.y = 500;
    this.sprite.body.allowGravity = true;
    this.tronWindow = true;
    this.game.time.events.add(500,function(){this.tronWindow = false;},this);
  },
  switchToClimb: function switchToClimb() {
    console.log('Switched to Climb');
    this.moveMode = 2;
    this.sprite.body.velocity.x = 0;
    this.sprite.body.velocity.y = 0;
    this.sprite.body.acceleration.x = 0;
    this.sprite.body.acceleration.y = 0;
    this.sprite.body.allowGravity = false;
  },
  climb: function climb() {
    var climbspeed = 125;
    var overhangspeed = 85;
    var shimmyspeed = 175;
    var shaftspeed = 275;
    //Shaft
    if (this.climbBoxUR && this.climbBoxUL && this.climbBoxDL && this.climbBoxDR) {
      this.climbing(shaftspeed, shaftspeed, shaftspeed);
      this.climbingAnimation(0, this.H, this.V);
    } else {
    //Corner Right
      if (this.climbBoxUR && this.climbBoxUL && this.climbBoxDR) {
        this.climbing(overhangspeed, climbspeed, shimmyspeed);
        this.climbingAnimation(1, this.H, this.V);
    //Corner Left
      } else if (this.climbBoxUR && this.climbBoxUL && this.climbBoxDL) {
        this.climbing(overhangspeed, climbspeed, shimmyspeed);
        this.climbingAnimation(1, this.H, this.V);
    //Overhang
      } else if (this.climbBoxUR && this.climbBoxUL) {
        this.climbing(overhangspeed, climbspeed, shimmyspeed);
        this.climbingAnimation(1, this.H, this.V);
    //Wall to the Right
      } else if (this.climbBoxUR && this.climbBoxDR) {
        this.climbing(overhangspeed, climbspeed, shimmyspeed);
        this.climbingAnimation(2, this.H, this.V);
    //Wall to the Left
      } else if (this.climbBoxUL && this.climbBoxDL) {
        this.climbing(overhangspeed, climbspeed, shimmyspeed);
        this.climbingAnimation(3, this.H, this.V);
    //Overhang End Right
      } else if (this.climbBoxUL) {
        this.climbing(overhangspeed, climbspeed, overhangspeed);
        this.climbingAnimation(4, this.H, this.V);
    //Overhang End Left
      } else if (this.climbBoxUR) {
        this.climbing(overhangspeed, climbspeed, overhangspeed);
        this.climbingAnimation(5, this.H, this.V);
    //Wall Top Right
      } else if (this.climbBoxDR) {
        this.climbing(overhangspeed, climbspeed, overhangspeed);
        this.climbingAnimation(2, this.H, this.V);
    //Wall Top Left
      } else if (this.climbBoxDL) {
        this.climbing(overhangspeed, climbspeed, overhangspeed);
        this.climbingAnimation(3, this.H, this.V);
      }
    }
  },
  climbing: function climbing(sidespeed, upspeed, downspeed) {
    if (this.direction === 8 || this.direction === 1 || this.direction === 2 ) {
      // moving right
      this.sprite.body.velocity.x = sidespeed;
      this.H = 1;
    } else if (this.direction === 4 || this.direction === 5 || this.direction === 6 ) {
      // moving left
      this.sprite.body.velocity.x = -sidespeed;
      this.H = -1;
    } else {
      // resting
      this.sprite.body.velocity.x = 0;
      this.H = 0;
    }
    if (this.direction === 2 || this.direction === 3 || this.direction === 4 ) {
      // moving up
      this.sprite.body.velocity.y = -upspeed;
      this.V = -1;
    } else if (this.direction === 6 || this.direction === 7 || this.direction === 8 ) {
      // moving down
      this.sprite.body.velocity.y = downspeed;
      this.V = 1;
    } else {
      // resting
      this.sprite.body.velocity.y = 0;
      this.V = 0;
    }
  },
  climbingAnimation: function climbingAnimation(N, H, V) {
    //Animation Shaft
    if (N === 0) {
      //Climb Down
      if (V === 1) {
        this.sprite.frame = 20;
      //Climb Up
      } else if (V === -1) {
        this.sprite.frame = 12;
      //Climb to the Right
      } else if (H === 1) {
        this.sprite.frame = 20;
      //Climb to the Left
      } else if (H === -1) {
        this.sprite.frame = 12;
      //Hang
      } else {
        this.sprite.frame = 20;
      }
    //Animation Overhang
    } else if (N === 1) {
      //Climb to the Right
      if (H === 1) {
        this.sprite.frame = 12;
      //Climb to the Left
      } else if (H === -1) {
        this.sprite.frame = 20;
      //Hang
      } else {
        this.sprite.frame = 20;
      }
    //Animation Wall Right
    } else if (N === 2) {
      //Climb Down
      if (V === 1) {
        this.sprite.frame = 13;
      //Climb Up
      } else if (V === -1) {
        this.sprite.frame = 13;
      //Hang
      } else {
        this.sprite.frame = 13;
      }
    //Animation Wall Left
    } else if (N === 3) {
      //Climb to the Right
      if (V === 1) {
        this.sprite.frame = 21;
      //Climb to the Left
      } else if (V === -1) {
        this.sprite.frame = 21;
      //Hang
      } else {
        this.sprite.frame = 21;
      }
    //Animation Overhang End Right
    } else if (N === 4) {
      this.sprite.frame = 21;
    //Animation Overhang End Left
    } else {
      this.sprite.frame = 13;
    }
  },
  switchToTron: function switchToTron() {
    this.sprite.y = this.sprite.y - 16;
    this.moveMode = 1;
    this.sprite.body.velocity.x = 0;
    this.sprite.body.velocity.y = 0;
    this.sprite.body.acceleration.x = 0;
    this.sprite.body.acceleration.y = 0;
    this.sprite.body.allowGravity = false;
    this.sprite.body.maxVelocity.y = this.tronspeed;
    this.tronWindow = true;
    this.tronCool = false;
    this.game.time.events.add(500,function(){this.tronWindow = false;},this);
    this.game.time.events.add(this.tronCd,function(){this.tronCool = true;},this);
    this.tronleft = false;
    this.tronright = false;
    this.tronup = false;
    this.trondown = false;
  },
  tronMove: function tronMove() {
    //LEFT
    if (this.cursors.left.isDown && !this.tronleft) {
      if (!this.cursors.up.isDown && !this.cursors.down.isDown) {
        this.tronMoveL();
      }
    }
    //RIGHT
    else if (this.cursors.right.isDown && !this.tronright) {
      if (!this.cursors.up.isDown && !this.cursors.down.isDown) {
        this.tronMoveR();
      }
    }
    //UP
    else if (this.cursors.up.isDown && !this.tronup) {
      if (!this.cursors.left.isDown && !this.cursors.right.isDown) {
        this.tronMoveU();
      }
    }
    //DOWN
    else if (this.cursors.down.isDown && !this.trondown) {
      if (!this.cursors.left.isDown && !this.cursors.right.isDown) {
        this.tronMoveD();
      }
    }
  },
  tronMoveL: function tronMoveL() {
    this.sprite.frame = 6;
    this.sprite.body.velocity.x = -this.tronspeed;
    this.sprite.body.velocity.y = 0;
    this.sprite.body.acceleration.x = 0;
    this.sprite.body.acceleration.y = 0;
    this.tronleft = true;
    this.tronright = false;
    this.tronup = false;
    this.trondown = false;
  },
  tronMoveR: function tronMoveR() {
    this.sprite.frame = 5;
    this.sprite.body.velocity.x = this.tronspeed;
    this.sprite.body.velocity.y = 0;
    this.sprite.body.acceleration.x = 0;
    this.sprite.body.acceleration.y = 0;
    this.tronleft = false;
    this.tronright = true;
    this.tronup = false;
    this.trondown = false;
  },
  tronMoveU: function tronMoveU() {
    this.sprite.frame = 3;
    this.sprite.body.velocity.y = -this.tronspeed;
    this.sprite.body.velocity.x = 0;
    this.sprite.body.acceleration.x = 0;
    this.sprite.body.acceleration.y = 0;
    this.tronleft = false;
    this.tronright = false;
    this.tronup = true;
    this.trondown = false;
  },
  tronMoveD: function tronMoveD() {
    this.sprite.frame = 4;
    this.sprite.body.velocity.y = this.tronspeed;
    this.sprite.body.velocity.x = 0;
    this.sprite.body.acceleration.x = 0;
    this.sprite.body.acceleration.y = 0;
    this.tronleft = false;
    this.tronright = false;
    this.tronup = false;
    this.trondown = true;
  }
};
module.exports = movement;
