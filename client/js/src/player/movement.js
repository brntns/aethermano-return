var movement = {
  playerMov: function playerMov(data , sprite) {
    // this.game.debug.spriteInfo(this.sprite, 32, 620);
    // get movement
    //  console.log(sprite);
    if(data){

      var output = [],
      sNumber = data.toString();

      for (var i = 0, len = sNumber.length; i < len; i += 1) {
          output.push(+sNumber.charAt(i));
      }
    this.mouseMov(output, sprite);
  }else{
    //this.mouseMov();
  }

  },
  mouseMov: function mouseMov(movBits , sprite) {
  //  console.log(movBits);
    //  console.log(sprite);
    // this.game.debug.spriteInfo(this.sprite, 32, 620);
    this.isActive = true;
    //Movement
    if (this.moveMode === 0) {

      this.basicRunning(movBits,  sprite);
      this.jumpCond(movBits[5],  sprite);
      if (movBits[5] === 1) {
        this.jumpy(movBits,sprite);
        console.log('jumping');
      }
      //Teleporting
      if (movBits[14] === 1 && !this.teleportcd) {
        this.teleportLR(this.direction, sprite);
      }
      //Switching to Tronmove
      if (movBits[14] === 1) {
        if (!this.tronWindow && this.tronCool) {
          this.switchToTron(sprite);
        }
      }
      //Attacking
      //Slash
      this.slashingDirection(sprite);
      if (movBits[6] === 1) {
        if (!this.slashed) {
          this.slashat(sprite);
          this.slashed = true;
        }
      } else {
        this.slashed = false;
      }
    //Tronmove
    } else if (this.moveMode = 1) {
      this.tronMove(sprite);
      //Reverting to Normal Movement
      if (movBits[14] === 1  ||  sprite.body.blocked.up
                            ||  sprite.body.blocked.down
                            || sprite.body.blocked.left
                            || sprite.body.blocked.right) {
        if (!this.tronWindow) {
          this.switchToNormal(sprite);
        }
      }
    }
  },
  basicRunning: function basicRunning(status,  sprite) {
    //Normal Running, Jumping and Air Control
    //Skating
    //  console.log(sprite);
    if (status[1] === 1 && status[2] === 1) {
    sprite.body.acceleration.x = 0;
    //Looking UP/RIGHT
  } else if (status[2] === 1 && status[3] === 1) {
      this.status = 'right';
      this.moveLR(-1, sprite);
      this.direction = 2;
    //Looking UP/LEFT
  } else if (status[1] === 1 && status[3] === 1) {
      this.status = 'left';
      this.moveLR(1, sprite);
      this.direction = 4;
    //Looking DOWN/LEFT
  } else if (status[1] === 1 && status[4]=== 1) {
      this.status = 'left';
      this.moveLR(-1, sprite);
      this.direction = 6;
    //Looking DOWN/RIGHT
  } else if (status[2] === 1 && status[4] === 1) {
      this.status = 'right';
      this.moveLR(1, sprite);
      this.direction = 8;
    //Looking RIGHT
  } else if (status[2] === 1) {
      this.status = 'right';
      this.moveLR(1, sprite);
      this.direction = 1;
    //Looking UP
  } else if (status[3] === 1) {
      this.direction = 3;
      this.decelerate(this.sign(sprite.body.velocity.x),this.sprite);
    //Looking LEFT
    } else if (status[1] === 1) {
      this.status = 'left';
      this.moveLR(-1, sprite);
      this.direction = 5;
    //Looking DOWN
  } else if (status[4] === 1) {
      this.direction = 7;
      this.decelerate(this.sign(sprite.body.velocity.x),this.sprite);
    //Deceleration and Standing Still
    } else {
      this.decelerate(this.sign(sprite.body.velocity.x),sprite);
    }
  },
  decelerate: function decelerate(sign , sprite) {
    //console.log(sprite);
    var body = sprite.body;
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
      sprite.animations.stop();
      sprite.frame = 0;
    }
  },
  jumpCond: function jumpCond(status ,  sprite) {
    if (sprite.body.blocked.up) {
      this.jumpWindow = false;
      this.jumpSpeedBonus = 0;
      this.wallWindow = false;
    }
    if (status !== 1) {
      this.jumpRelease = true;
      if (this.jumpStop) {
        this.jumpStop = false;
        if (sprite.body.velocity.y < 0) {
          sprite.body.velocity.y = 0;
        }
      }
      if (this.jumpWindow) {
        this.jumpWindow = false;
        this.jumpSpeedBonus = 0;
      }
      if (sprite.body.onFloor()) {
        this.bunnyKiller = false;
      }
    }
    if (sprite.body.blocked.left && !this.wallJumpL && status !== 1) {
      this.wallJumpL = true;
      this.game.time.events.remove(this.wallWindow);
      this.wallWindow = this.game.time.events.add(this.wallJumpTime,function(){this.wallJumpL = false;this.wallJumpR = false;},this);
    } else if (sprite.body.blocked.right && !this.wallJumpR && status !== 1) {
      this.wallJumpR = true;
      this.game.time.events.remove(this.wallWindow);
      this.wallWindow = this.game.time.events.add(this.wallJumpTime,function(){this.wallJumpL = false;this.wallJumpR = false;},this);
    }
  },
  jumpy: function jumpy(direction, sprite) {
    if ((sprite.body.onFloor() && !this.bunnyKiller) || this.jumpWindow) {
       this.jump( sprite);
    } else if (this.wallJumpL && this.jumpRelease && direction[2] === 1) {
      this.jump( sprite);
      this.wallJumpL = false;
      this.wallJumpR = false;
      sprite.body.velocity.x = this.wallJumpBoost;
    } else if (this.wallJumpR && this.jumpRelease && direction[1] === 1) {
      this.jump( sprite);
      this.wallJumpL = false;
      this.wallJumpR = false;
      sprite.body.velocity.x = -this.wallJumpBoost;
    }
  },
  jump: function jump( sprite) {
    this.bunnyKiller = true;
    this.jumpRelease = false;
    this.jumpStop = true;
    sprite.body.velocity.y = -this.jumpSpeedBase-this.jumpSpeedBonus;
    if (sprite.body.onFloor()) {
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
    //Animation Jumping
  sprite.animations.stop();
    if ( sprite.body.velocity.x < -20) {
       sprite.frame = 13;
    } else if ( this.sprite.body.velocity.x > 20) {
       sprite.frame = 7;
    } else {
       sprite.frame = 2;
    }
  },
  teleportLR: function teleportLR(z,  sprite) {
    //console.log(sprite);
    if (z === 1) {
      sprite.x = sprite.x + this.teleportRangeX;
    } else if (z === 2){
      sprite.y = sprite.y - Math.floor(this.teleportRangeY/1.5);
    sprite.x = sprite.x + Math.floor(this.teleportRangeX/1.5);
    } else if (z === 3){
    sprite.y = sprite.y - Math.floor(this.teleportRangeY);
    } else if (z === 4){
      sprite.y = sprite.y - Math.floor(this.teleportRangeY/1.5);
    sprite.x = sprite.x - Math.floor(this.teleportRangeX/1.5);
    } else if (z === 5){
    sprite.x = sprite.x - Math.floor(this.teleportRangeX);
    } else if (z === 6){
      sprite.y = sprite.y + Math.floor(this.teleportRangeY/1.5);
      sprite.x = sprite.x - Math.floor(this.teleportRangeX/1.5);
    } else if (z === 7){
      sprite.y = sprite.y + Math.floor(this.teleportRangeY);
    } else {
      sprite.y = sprite.y + Math.floor(this.teleportRangeY/1.5);
      sprite.x = sprite.x + Math.floor(this.teleportRangeX/1.5);
    }
    this.teleportcd = true;
    this.game.time.events.add(this.teleportCd,function(){this.teleportcd = false;},this);
  },
  moveLR: function moveLR(sign,  sprite){
    var body = sprite.body;
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
        sprite.animations.play('left');
      } else {
        sprite.animations.play('right');
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
  slashingDirection: function slashingDirection(sprite) {
  //  console.log(sprite);
    if (this.direction == 1) {
      this.hitbox.x = sprite.x + 27;
      this.hitbox.y = sprite.y - 3;
    } else if (this.direction == 2) {
      this.hitbox.x = sprite.x + 27;
      this.hitbox.y = sprite.y - 30;
    } else if (this.direction == 3) {
      this.hitbox.x = sprite.x - 1;
      this.hitbox.y = sprite.y - 30;
    } else if (this.direction == 4) {
      this.hitbox.x = sprite.x - 30;
      this.hitbox.y = sprite.y - 30;
    } else if (this.direction == 5) {
      this.hitbox.x = sprite.x - 30;
      this.hitbox.y = sprite.y - 3;
    } else if (this.direction == 6) {
      this.hitbox.x = sprite.x - 30;
      this.hitbox.y = sprite.y + 30;
    } else if (this.direction == 7) {
      this.hitbox.x = sprite.x - 1;
      this.hitbox.y = this.sprite.y + 31;
    } else {
      this.hitbox.x = sprite.x + 27;
      this.hitbox.y = sprite.y + 31;
    }
  },
  switchToNormal: function switchToNormal(sprite) {
    this.moveMode = 0;
    sprite.body.maxVelocity.y = 500;
    sprite.body.velocity.x = 0;
    sprite.body.velocity.y = 0;
    sprite.body.allowGravity = true;
    this.tronWindow = true;
    this.game.time.events.add(500,function(){this.tronWindow = false;},this);
  },
  switchToTron: function switchToTron(sprite) {
    sprite.y = sprite.y - 16;
    this.moveMode = 1;
    sprite.body.velocity.x = 0;
    sprite.body.velocity.y = 0;
    sprite.body.acceleration.x = 0;
    sprite.body.acceleration.y = 0;
    sprite.body.allowGravity = false;
    sprite.body.maxVelocity.y = this.tronspeed;
    this.tronWindow = true;
    this.tronCool = false;
    this.game.time.events.add(500,function(){this.tronWindow = false;},this);
    this.game.time.events.add(this.tronCd,function(){this.tronCool = true;},this);
    this.tronleft = false;
    this.tronright = false;
    this.tronup = false;
    this.trondown = false;
  },
  tronMove: function tronMove(sprite) {
    //LEFT
    if (this.bitArray[1] === 1 && !this.tronleft) {
      if (this.bitArray[3] === 0  && this.bitArray[4] === 0) {
        this.tronMoveL(sprite);
      }
    }
    //RIGHT
    else if (this.bitArray[2] === 1 && !this.tronright) {
      if (this.bitArray[3] === 0 && this.bitArray[4] === 0) {
        this.tronMoveR(sprite);
      }
    }
    //UP
    else if (this.bitArray[3] === 1 && !this.tronup) {
      if (this.bitArray[1] === 0 && this.bitArray[2] === 0) {
        this.tronMoveU(sprite);
      }
    }
    //DOWN
    else if (this.bitArray[4] === 1 && !this.trondown) {
      if (this.bitArray[1] === 0 && this.bitArray[2] === 0) {
        this.tronMoveD(sprite);
      }
    }
  },
  tronMoveL: function tronMoveL(sprite) {
    sprite.frame = 6;
    sprite.body.velocity.x = -this.tronspeed;
    sprite.body.velocity.y = 0;
    sprite.body.acceleration.x = 0;
    sprite.body.acceleration.y = 0;
    this.tronleft = true;
    this.tronright = false;
    this.tronup = false;
    this.trondown = false;
  },
  tronMoveR: function tronMoveR(sprite) {
    sprite.frame = 5;
    sprite.body.velocity.x = this.tronspeed;
    sprite.body.velocity.y = 0;
    sprite.body.acceleration.x = 0;
    sprite.body.acceleration.y = 0;
    this.tronleft = false;
    this.tronright = true;
    this.tronup = false;
    this.trondown = false;
  },
  tronMoveU: function tronMoveU(sprite) {
    sprite.frame = 3;
    sprite.body.velocity.y = -this.tronspeed;
    sprite.body.velocity.x = 0;
    sprite.body.acceleration.x = 0;
    sprite.body.acceleration.y = 0;
    this.tronleft = false;
    this.tronright = false;
    this.tronup = true;
    this.trondown = false;
  },
  tronMoveD: function tronMoveD(sprite) {
    sprite.frame = 4;
    sprite.body.velocity.y = this.tronspeed;
    sprite.body.velocity.x = 0;
    sprite.body.acceleration.x = 0;
    sprite.body.acceleration.y = 0;
    this.tronleft = false;
    this.tronright = false;
    this.tronup = false;
    this.trondown = true;
  }
};

module.exports = movement;
