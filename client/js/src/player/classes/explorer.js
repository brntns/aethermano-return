var Explorer = {
  playerClass: 0,
  moveMode: 0,
  slashTime: 500,
  classInit: function () {
    this.sprite.loadTexture('explorer', 0);
    this.bullets = this.game.add.group();
    this.game.physics.enable(this.bullets, Phaser.Physics.ARCADE);
  },
  classUpdate: function classUpdate() {
    switch (this.moveMode) {
      case 0:
        this.climbingMask();
        if (this.letterS.isDown) {
          if (this.climbBoxUR || this.climbBoxUL) {
            this.switchToClimb();
          }
        }
        this.slashingDirection();
        if (this.letterS.isDown) {
          if (!this.slashed) {
            this.slashat();
            this.slashed = true;
          }
        } else {
          this.slashed = false;
        }
      break;
      case 2:
        this.climbingMask();
        //Reverting to Normal Movement
        if (!this.letterS.isDown || (!this.climbBoxUR && !this.climbBoxUL && !this.climbBoxDL && !this.climbBoxDR)) {
          this.switchToNormal();
        }
        this.directions();
        this.climb();
        //spawning a ladder
        if (this.letterE.isDown) {
          if (!this.ladderOnCD) {
            this.spawningLadder = true;
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
  slashat: function slashat() {
    if (this.Facing === 1 || this.Facing === 2 || this.Facing === 3 || this.Facing === 8) {
      this.sprite.animations.play('explorer_slash_right');
      this.status = 50;
    } else if (this.Facing === 4 || this.Facing === 5 || this.Facing === 6 || this.Facing === 7) {
      this.sprite.animations.play('explorer_slash_left');
      this.status = 51;
    }
    this.hitbox1.visible = true;
    this.hitbox2.visible = true;
    this.slashing = true;
    this.slashAni = true;
    this.game.time.events.remove(this.slashTimer);
    this.slashTimer = this.game.time.events.add(this.slashTime,function(){
      this.hitbox1.visible = false;
      this.hitbox2.visible = false;
      this.slashing = false;
      this.slashAni = false;
    },this);
  },
  slashingDirection: function slashingDirection() {
    this.hitbox2.x = this.sprite.x - 15;
    this.hitbox2.y = this.sprite.y - 15;
    if (this.Facing === 1 || this.Facing === 2 || this.Facing === 3 || this.Facing === 8) {
      //right
      this.hitbox1.x = this.sprite.x + 5;
      this.hitbox1.y = this.sprite.y - 15;
    } else if (this.Facing === 4 || this.Facing === 5 || this.Facing === 6 || this.Facing === 7) {
      //left
      this.hitbox1.x = this.sprite.x - 35;
      this.hitbox1.y = this.sprite.y - 15;
    }
  },
  climbingMask: function climbingMask() {
    this.climbboxUR.x = this.sprite.x;
    this.climbboxUR.y = this.sprite.y - 19;
    this.climbboxUL.x = this.sprite.x - 19;
    this.climbboxUL.y = this.sprite.y - 19;
    this.climbboxDL.x = this.sprite.x- 19;
    this.climbboxDL.y = this.sprite.y;
    this.climbboxDR.x = this.sprite.x;
    this.climbboxDR.y = this.sprite.y;
  },
  switchToClimb: function switchToClimb() {
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
      this.ladderDirection = 1;
    } else {
    //Corner Right
      if (this.climbBoxUR && this.climbBoxUL && this.climbBoxDR) {
        this.climbing(overhangspeed, climbspeed, shimmyspeed);
        this.climbingAnimation(1, this.H, this.V);
        this.ladderDirection = 2;
    //Corner Left
      } else if (this.climbBoxUR && this.climbBoxUL && this.climbBoxDL) {
        this.climbing(overhangspeed, climbspeed, shimmyspeed);
        this.climbingAnimation(1, this.H, this.V);
        this.ladderDirection = 0;
    //Overhang
      } else if (this.climbBoxUR && this.climbBoxUL) {
        this.climbing(overhangspeed, climbspeed, shimmyspeed);
        this.climbingAnimation(1, this.H, this.V);
        this.ladderDirection = 1;
    //Wall to the Right
      } else if (this.climbBoxUR && this.climbBoxDR) {
        this.climbing(overhangspeed, climbspeed, shimmyspeed);
        this.climbingAnimation(2, this.H, this.V);
        this.ladderDirection = 2;
    //Wall to the Left
      } else if (this.climbBoxUL && this.climbBoxDL) {
        this.climbing(overhangspeed, climbspeed, shimmyspeed);
        this.climbingAnimation(3, this.H, this.V);
        this.ladderDirection = 0;
    //Overhang End Right
      } else if (this.climbBoxUL) {
        this.climbing(overhangspeed, climbspeed, overhangspeed);
        this.climbingAnimation(4, this.H, this.V);
        this.ladderDirection = 3;
    //Overhang End Left
      } else if (this.climbBoxUR) {
        this.climbing(overhangspeed, climbspeed, overhangspeed);
        this.climbingAnimation(5, this.H, this.V);
        this.ladderDirection = 3;
    //Wall Top Right
      } else if (this.climbBoxDR) {
        this.climbing(overhangspeed, climbspeed, overhangspeed);
        this.climbingAnimation(2, this.H, this.V);
        this.ladderDirection = 2;
    //Wall Top Left
      } else if (this.climbBoxDL) {
        this.climbing(overhangspeed, climbspeed, overhangspeed);
        this.climbingAnimation(3, this.H, this.V);
        this.ladderDirection = 0;
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

module.exports = Explorer;
