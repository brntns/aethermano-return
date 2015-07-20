var Explorer = {
  playerClass: 0,
  classInit: function () {
    this.sprite.loadTexture('explorer', 0);
  },
  classUpdate: function classUpdate() {
    switch (this.moveMode) {
      case 0:
        if (this.slash.isDown) {
          if (this.climbBoxUR || this.climbBoxUL) {
            this.switchToClimb();
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

      default:
        this.moveMode = 0;
      break;
    }
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
        this.sprite.frame = 1;
      //Climb Up
      } else if (V === -1) {
        this.sprite.frame = 1;
      //Climb to the Right
      } else if (H === 1) {
        this.sprite.frame = 1;
      //Climb to the Left
      } else if (H === -1) {
        this.sprite.frame = 1;
      //Hang
      } else {
        this.sprite.frame = 1;
      }
    //Animation Overhang
    } else if (N === 1) {
      //Climb to the Right
      if (H === 1) {
        this.sprite.frame = 12;
      //Climb to the Left
      } else if (H === -1) {
        this.sprite.frame = 13;
      //Hang
      } else {
        this.sprite.frame = 12;
      }
    //Animation Wall Right
    } else if (N === 2) {
      //Climb Down
      if (V === 1) {
        this.sprite.frame = 14;
      //Climb Up
      } else if (V === -1) {
        this.sprite.frame = 14;
      //Hang
      } else {
        this.sprite.frame = 14;
      }
    //Animation Wall Left
    } else if (N === 3) {
      //Climb to the Right
      if (V === 1) {
        this.sprite.frame = 15;
      //Climb to the Left
      } else if (V === -1) {
        this.sprite.frame = 15;
      //Hang
      } else {
        this.sprite.frame = 15;
      }
    //Animation Overhang End Right
    } else if (N === 4) {
      this.sprite.frame = 13;
    //Animation Overhang End Left
    } else {
      this.sprite.frame = 12;
    }
  }
};

module.exports = Explorer;
