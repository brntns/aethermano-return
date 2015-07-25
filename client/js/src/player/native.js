var Native = {
  playerClass: 4,
  moveMode: 4,
  classInit: function () {
    this.sprite.loadTexture('native', 0);
    this.bullets = this.game.add.group();
    this.game.physics.enable(this.bullets, Phaser.Physics.ARCADE);
  },
  classUpdate: function classUpdate() {
    switch (this.moveMode) {
      case 0:
        this.climbingMask();
        if (this.slash.isDown) {
          if (this.climbBoxUR || this.climbBoxUL) {
            this.switchToClimb();
          }
        }

        if (this.slash.isDown) {
          if (this.sprite.body.blocked.down) {
            if (!this.slashed) {
              this.shoot();
              this.slashed = true;
            }
          }
        } else {
          this.slashed = false;
        }
        if (this.specialButton.isDown) {
          if (!this.ladderOnCD) {
            this.spawningLadder = true;
            this.ladderOnCD = true;
            this.game.time.events.add(this.ladderCD,function(){this.ladderOnCD = false;},this);
          }
        }
      break;
      case 2:
        this.climbingMask();
        //Reverting to Normal Movement
        if (!this.slash.isDown || (!this.climbBoxUR && !this.climbBoxUL && !this.climbBoxDL && !this.climbBoxDR)) {
          this.switchToNormal();
        }
        this.directions();
        this.climb();
        //spawning a ladder
        if (this.ladderButton.isDown) {
          if (!this.ladderOnCD) {
            this.ladderSpawn = true;
            this.ladderOnCD = true;
            this.game.time.events.add(this.ladderCD,function(){this.ladderOnCD = false;},this);
          }
        }
      break;
      case 3:
      break;
      default:
        this.moveMode = 0;
      break;
    }
  },
  shoot:function shoot(){

    this.game.time.events.remove(this.slashTimer);
    this.slashTimer = this.game.time.events.add(this.slashTime,function(){this.slashing = false;},this);
    if (!this.slashing) {
      this.slashing = true;
      this.bullet = this.bullets.create(this.sprite.body.x + this.sprite.body.width / 2 + 20, this.sprite.body.y + this.sprite.body.height / 2 - 4, 'arrow');
      this.game.physics.enable(this.bullet, Phaser.Physics.ARCADE);
      this.bullet.outOfBoundsKill = true;
      this.bullet.anchor.setTo(0.5, 0.5);
      this.bullet.body.allowGravity = false;
      this.bullet.body.velocity.y = 0;
      this.bullet.body.velocity.x = 400;
      this.bullet.animations.add('explode', [1,2,3,4,5], 10, false);
    }
  },
  climbingMask: function climbingMask() {
    this.climbboxUR.x = this.sprite.x+44;
    this.climbboxUR.y = this.sprite.y+25;
    this.climbboxUL.x = this.sprite.x+25;
    this.climbboxUL.y = this.sprite.y+25;
    this.climbboxDL.x = this.sprite.x+25;
    this.climbboxDL.y = this.sprite.y+44;
    this.climbboxDR.x = this.sprite.x+44;
    this.climbboxDR.y = this.sprite.y+44;
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
        this.sprite.animations.play('climb_ladder');
        this.status = 9;
      //Climb Up
      } else if (V === -1) {
        this.sprite.animations.play('climb_ladder');
        this.status = 9;
      //Climb to the Right
      } else if (H === 1) {
        this.sprite.animations.play('climb_ladder');
        this.status = 9;
      //Climb to the Left
      } else if (H === -1) {
        this.sprite.animations.play('climb_ladder');
        this.status = 9;
      //Hang
      } else {
        this.sprite.frame = 30;
        this.status = 10;
      }
    //Animation Overhang
    } else if (N === 1) {
      //Climb to the Right
      if (H === 1) {
        this.sprite.animations.play('climb_right_overhang');
        this.status = 25;
      //Climb to the Left
      } else if (H === -1) {
        this.sprite.animations.play('climb_left_overhang');
        this.status = 24;
      //Hang
      } else {
        this.sprite.frame = 66;
        this.status = 28;
      }
    //Animation Wall Right
    } else if (N === 2) {
      //Climb Down
      if (V === 1) {
        this.sprite.animations.play('climb_right_wall');
        this.status = 21;
      //Climb Up
      } else if (V === -1) {
        this.sprite.animations.play('climb_right_wall');
        this.status = 21;
      //Hang
      } else {
        this.sprite.frame = 61;
        this.status = 25;
      }
    //Animation Wall Left
    } else if (N === 3) {
      //Climb Down
      if (V === 1) {
        this.sprite.animations.play('climb_left_wall');
        this.status = 20;
      //Climb Up
      } else if (V === -1) {
        this.sprite.animations.play('climb_left_wall');
        this.status = 20;
      //Hang
      } else {
        this.sprite.animations.stop();
        this.sprite.frame = 71;
        this.status = 24;
      }
    //Animation Overhang End Right
    } else if (N === 4) {
      //Climb Down
      if (V === 1) {
        this.sprite.animations.play('climb_left_wall');
        this.status = 20;
      //Climb Up
      } else if (V === -1) {
        this.sprite.animations.play('climb_left_wall');
        this.status = 20;
      //Hang
      } else {
        this.sprite.animations.stop();
        this.sprite.frame = 74;
        this.status = 26;
      }
    //Animation Overhang End Left
    } else {
      //Climb Down
      if (V === 1) {
        this.sprite.animations.play('climb_right_wall');
        this.status = 21;
      //Climb Up
      } else if (V === -1) {
        this.sprite.animations.play('climb_right_wall');
        this.status = 21;
      //Hang
      } else {
        this.sprite.animations.stop();
        this.sprite.frame = 64;
        this.status = 27;
      }
    }
  }
};

module.exports = Native;
