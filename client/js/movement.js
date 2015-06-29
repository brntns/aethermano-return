var movement = {
  mouseMov: function mouseMov(){
     this.game.debug.spriteInfo(this.sprite, 32, 620);
      this.isActive = true;
    //Movement
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
        if (this.sprite.body.velocity.y<0) {
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
      this.wallWindow = this.game.time.events.add(150,this.wallReset,this);
    } else if (this.sprite.body.blocked.right && !this.wallJumpR && !this.jumpButton.isDown) {
      this.wallJumpR = true;
      this.game.time.events.remove(this.wallWindow);
      this.wallWindow = this.game.time.events.add(150,this.wallReset,this);
    }
    //Jumping Action
    if (this.jumpButton.isDown) {
      if ((this.sprite.body.onFloor() && !this.bunnyKiller) || this.jumpWindow) {
         this.jump();
      } else if (this.wallJumpL && this.jumpRelease && this.cursors.right.isDown) {
        this.jump();
        this.wallReset();
        this.sprite.body.velocity.x = 350;
      } else if (this.wallJumpR && this.jumpRelease && this.cursors.left.isDown) {
        this.jump();
        this.wallReset();
        this.sprite.body.velocity.x = -350;
      }
    }
    //Teleporting
    if (this.teleport.isDown && !this.teleportcd) {
      this.teleportLR(this.teleportd);
      this.phasebooties.kill();
    }
  },
  decelerate: function decelerate(sign) {
    var body = this.sprite.body;
    //Sliding Friction
    if(body.onFloor() && (sign*body.velocity.x > 20)) {
      body.acceleration.x = -sign*950;
    }
    //Air Resistance
    else if (!body.onFloor() && sign*body.velocity.x > 5) {
      body.acceleration.x = -sign*0;
    }
    //Stopping
    else if (body.velocity.x != 0) {
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
    this.sprite.body.velocity.y = -250-(Math.abs( this.sprite.body.velocity.x))/7;
    if ( this.sprite.body.onFloor() || this.wallJumpL || this.wallJumpR) {
      this.jumpWindow = true;
      this.game.time.events.remove(this.jumpWindowTimer);
      this.jumpWindowTimer = this.game.time.events.add(500,this.jumpReset,this);
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
  sign: function sign(x){
    if(x < 0){
      return -1;
    } else {
      return 1;
    }
  },
  dodgeReset: function dodgeReset() {
    this.dodgeWindow = false;
  },
  jumpReset: function jumpReset() {
    this.jumpWindow = false;
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
    var playerPosition = this.sprite.x/16+this.sprite.y/16*640;
    this.sprite.x = this.sprite.x + sign*320;
    this.teleportcd = true;
    this.game.time.events.add(500,this.teleportReset,this);
  },
  moveLR: function moveLR(sign){
    var body = this.sprite.body;
    //Braking
    if (sign*body.velocity.x < 0) {
      if (body.onFloor()) {
        body.acceleration.x = sign*1950;
      } else {
        body.acceleration.x = sign*Math.max(950,sign*2*body.velocity.x);
      }
    //Starting
    } else if (body.onFloor && sign*body.velocity.x < 100) {
      body.velocity.x = sign*150;
    //Cruising
    } else {
      if (body.onFloor()) {
        body.acceleration.x = sign*250;
      } else if (sign*body.velocity.x < 250) {
        body.acceleration.x = sign*500;
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
