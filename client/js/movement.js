var movement = {
  mouseMov: function mouseMov(){
    // this.game.debug.spriteInfo(this.sprite, 32, 620);
      this.isActive = true;
    //Movement
    if (this.moveMode === 0) {
    //Running and Air Control
    //Skating
    if (this.cursors.left.isDown && this.cursors.right.isDown) {
      this.sprite.body.acceleration.x = 0;
    }
    //Moving LEFT
    else if (this.cursors.left.isDown) {
      this.status = 'right';
      this.moveLR(-1, this.sprite);
      this.teleportd = -1;
    }
    // Moving RIGHT
    else if (this.cursors.right.isDown) {
      this.status = 'right';
      this.moveLR(1, this.sprite);
      this.teleportd = 1;
    }
    else if (this.cursors.up.isDown) {
      this.teleportd = -2;
      this.decelerate(this.sign(this.sprite.body.velocity.x),this.sprite);
    }
    else if (this.cursors.down.isDown) {
      this.teleportd = 2;
      this.decelerate(this.sign(this.sprite.body.velocity.x),this.sprite);
    }
    //Deceleration and Standing Still
    else {
      this.decelerate(this.sign(this.sprite.body.velocity.x),this.sprite);
    }
    //Jumping
    //Jumping Conditional Switches
    if (this.sprite.body.blocked.up) {
      this.jumpReset();
      this.wallJumpReset();
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
        this.jumpReset();
      }
      if (this.sprite.body.onFloor()) {
        this.bunnyKiller = false;
      }
    }
    if (this.sprite.body.blocked.left && !this.wallJumpL && !this.jumpButton.isDown) {
      this.wallJumpL = true;
      this.game.time.events.remove(this.wallWindow);
      this.wallWindow = this.game.time.events.add(this.wallJumpTime,this.wallReset,this);
    } else if (this.sprite.body.blocked.right && !this.wallJumpR && !this.jumpButton.isDown) {
      this.wallJumpR = true;
      this.game.time.events.remove(this.wallWindow);
      this.wallWindow = this.game.time.events.add(this.wallJumpTime,this.wallReset,this);
    }
    //Jumping Action
    if (this.jumpButton.isDown) {
      if ((this.sprite.body.onFloor() && !this.bunnyKiller) || this.jumpWindow) {
         this.jump();
      } else if (this.wallJumpL && this.jumpRelease && this.cursors.right.isDown) {
        this.jump();
        this.wallReset();
        this.sprite.body.velocity.x = this.wallJumpBoost;
      } else if (this.wallJumpR && this.jumpRelease && this.cursors.left.isDown) {
        this.jump();
        this.wallReset();
        this.sprite.body.velocity.x = -this.wallJumpBoost;
      }
    }
    //Teleporting
    if (this.teleport.isDown && !this.teleportcd) {
      this.teleportLR(this.teleportd);
    }
    if (this.tron.isDown) {
      if (!this.tronWindow) {
        this.moveMode = 1;
        this.sprite.body.velocity.x = 0;
        this.sprite.body.velocity.y = 0;
        this.game.physics.arcade.gravity.y = 0;
        this.tronWindow = true;
        this.game.time.events.add(500,this.tronReset,this);
      }
    }
  //Tronmove
  } else if (this.moveMode = 1) {
    //LEFT
    if (this.cursors.left.isDown && !this.tronleft) {
      this.sprite.body.velocity.x = -this.tronspeed;
      this.sprite.body.velocity.y = 0;
      this.tronleft = true;
      this.tronright = false;
      this.tronup = false;
      this.trondown = false;
    }
    // Moving RIGHT
    else if (this.cursors.right.isDown && !this.tronright) {
      this.sprite.body.velocity.x = this.tronspeed;
      this.sprite.body.velocity.y = 0;
      this.tronleft = false;
      this.tronright = true;
      this.tronup = false;
      this.trondown = false;
    }
    else if (this.cursors.up.isDown && !this.tronup) {
      this.sprite.body.velocity.y = -this.tronspeed;
      this.sprite.body.velocity.x = 0;
      this.tronleft = false;
      this.tronright = false;
      this.tronup = true;
      this.trondown = false;
    }
    else if (this.cursors.down.isDown && !this.trondown) {
      this.sprite.body.velocity.y = this.tronspeed;
      this.sprite.body.velocity.x = 0;
      this.tronleft = false;
      this.tronright = false;
      this.tronup = false;
      this.trondown = true;
    }
    if (this.tron.isDown) {
      if (!this.tronWindow) {
        this.moveMode = 0;
        this.sprite.body.velocity.x = 0;
        this.sprite.body.velocity.y = 0;
        this.game.physics.arcade.gravity.y = 750;
        this.tronWindow = true;
        this.game.time.events.add(500,this.tronReset,this);
      }
    }
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
      this.sprite.frame = 4;
    }
  },
  jump: function jump() {
    this.bunnyKiller = true;
    this.jumpRelease = false;
    this.jumpStop = true;
    this.sprite.body.velocity.y = -this.jumpSpeedBase-this.jumpSpeedBonus;
    if (this.sprite.body.onFloor()) {
      this.jumpSpeedBonus = (Math.abs(this.sprite.body.velocity.x))/this.jumpSpeedCoeff;
      this.jumpWindow = true;
      this.game.time.events.remove(this.jumpWindowTimer);
      this.jumpWindowTimer = this.game.time.events.add(this.jumpAirtime,this.jumpReset,this);
    }
    else if (this.wallJumpL) {
      this.jumpWindow = true;
      this.jumpSpeedBonus = this.wallJumpBonus;
      this.game.time.events.remove(this.jumpWindowTimer);
      this.jumpWindowTimer = this.game.time.events.add(this.jumpAirtime,this.jumpReset,this);
    }
    else if (this.wallJumpR) {
      this.jumpWindow = true;
      this.jumpSpeedBonus = this.wallJumpBonus;
      this.game.time.events.remove(this.jumpWindowTimer);
      this.jumpWindowTimer = this.game.time.events.add(this.jumpAirtime,this.jumpReset,this);
    }
    //Animation Jumping
    this.sprite.animations.stop();
    if ( this.sprite.body.velocity.x < -20) {
       this.sprite.frame = 3;
    } else if ( this.sprite.body.velocity.x > 20) {
       this.sprite.frame = 1;
    } else {
       this.sprite.frame = 4;
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
  //Resets for various conditions, awkward but required
  dodgeReset: function dodgeReset() {
    this.dodgeWindow = false;
  },
  tronReset: function dodgeReset() {
    this.tronWindow = false;
  },
  jumpReset: function jumpReset() {
    this.jumpWindow = false;
    this.jumpSpeedBonus = 0;
  },
  wallJumpReset: function wallJumpReset() {
    this.wallWindow = false;
  },
  wallReset: function wallReset() {
    this.wallJumpL = false;
    this.wallJumpR = false;
  },
  teleportReset: function teleportReset() {
    this.teleportcd = false;
  },
  teleportLR: function teleporting(sign) {
    if (Math.abs(sign) === 1) {
      this.sprite.x = this.sprite.x + sign*this.teleportRangeX;
    }
    else {
      this.sprite.y = this.sprite.y + 0.5*sign*this.teleportRangeY;
    }
          console.log(this.teleportRangeX);
    this.teleportcd = true;
    this.game.time.events.add(this.teleportCd,this.teleportReset,this);
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
  }
}
