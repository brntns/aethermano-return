var Monk = {
  playerClass: 1,
  moveMode: 0,
  slashTime: 666,
  classInit: function () {
    this.sprite.loadTexture('monk', 0);
    this.bullets = this.game.add.group();
    this.game.physics.enable(this.bullets, Phaser.Physics.ARCADE);
  },
  classUpdate: function classUpdate() {
	  //Attacking
    //Slash
    this.slashingDirection();
    if (this.letterS.isDown) {
      if (!this.slashed) {
        this.slashat();
        this.slashed = true;
      }
    } else {
      this.slashed = false;
    }
    switch (this.moveMode) {
    case 0:
    //Gliding
      this.glideCond();
      if (this.letterSpace.isDown) {
        this.glidy();
      }
    break;

    case 3:
    break;

    default:
      this.moveMode = 0;
    break;
    }
  },
  glide: function glide(N) {
    switch (N) {
      case 0:
      if (this.gliding) {
        this.sprite.body.acceleration.y = 0;
        this.sprite.body.maxVelocity.y = 500;
        this.sprite.body.allowGravity = true;
        this.gliding = false;
      }
      break;
      case 1: // Gliding
      if (!this.gliding) {
        this.gliding = true;
        this.sprite.body.maxVelocity.y = 80;
        this.sprite.animations.stop();
        if (this.sprite.body.velocity.x > 0) {
          this.sprite.frame = 1;
          this.status = 5;
        } else {
          this.sprite.frame = 11;
          this.status = 4;
        }
      }
      break;
      case 2: // Power Diving
      if (!this.gliding) {
        this.gliding = true;
        this.sprite.body.allowGravity = false;
        this.sprite.body.acceleration.y = -500;
        this.sprite.animations.stop();
        if (this.sprite.body.velocity.x > 0) {
          this.sprite.frame = 5;
          this.status = 69;
        } else {
          this.sprite.frame = 15;
          this.status = 68;
        }
      }
      break;
    }
  },
  glidy: function glidy() {
    if ( !((this.sprite.body.onFloor() && !this.bunnyKiller) || this.jumpWindow)
    && !(this.wallJumpL && this.jumpRelease && this.cursors.right.isDown)
    && !(this.wallJumpR && this.jumpRelease && this.cursors.left.isDown) ) {
      if (this.sprite.body.velocity.y > 0
      && this.sprite.body.velocity.y < 400 && this.jumpRelease) {
        this.glide(1);
      } else if (this.sprite.body.velocity.y > 400 && this.jumpRelease) {
        this.glide(2);
      }
    }
  },
  glideCond: function glideCond() {
    if (this.sprite.body.blocked.up || this.sprite.body.blocked.down || !this.letterSpace.isDown) {
        this.glide(0);
    }
  },
  slashat: function slashat() {
    if (this.Facing === 1) {
      this.sprite.animations.play('monk_slash_right');
      this.status = 60;
    } else if (this.Facing === 2) {
      this.sprite.animations.play('monk_slash_rightup');
      this.status = 61;
    } else if (this.Facing == 3) {
      this.sprite.animations.play('monk_slash_up');
      this.status = 62;
    } else if (this.Facing === 4) {
      this.sprite.animations.play('monk_slash_leftup');
      this.status = 63;
    } else if (this.Facing === 5) {
      this.sprite.animations.play('monk_slash_left');
      this.status = 64;
    } else if (this.Facing === 6) {
      this.sprite.animations.play('monk_slash_leftdown');
      this.status = 65;
    } else if (this.Facing === 7) {
      this.sprite.animations.play('monk_slash_down');
      this.status = 66;
    } else if (this.Facing === 8) {
      this.sprite.animations.play('monk_slash_rightdown');
      this.status = 67;
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
    if (this.Facing === 1 || this.Facing === 5 || this.Facing === 6 || this.Facing === 8) {
      //left, right, downleft and downright
      this.hitbox1.x = this.sprite.x + 14;
      this.hitbox1.y = this.sprite.y - 16 ;
      this.hitbox2.x = this.sprite.x - 44 ;
      this.hitbox2.y = this.sprite.y + 15;
      //up
    } else if (this.Facing == 3) {
      this.hitbox1.x = this.sprite.x - 30;
      this.hitbox1.y = this.sprite.y - 44;
      this.hitbox2.x = this.sprite.x - 44;
      this.hitbox2.y = this.sprite.y - 44;
      //down
    } else if (this.Facing == 7) {
      this.hitbox1.x = this.sprite.x + 14;
      this.hitbox1.y = this.sprite.y - 15;
      this.hitbox2.x = this.sprite.x - 44;
      this.hitbox2.y = this.sprite.y - 15;
      //upright
    } else if (this.Facing === 2) {
      this.hitbox1.x = this.sprite.x + 14;
      this.hitbox1.y = this.sprite.y - 44;
      this.hitbox2.x = this.sprite.x - 44;
      this.hitbox2.y = this.sprite.y - 15;
      //upleft
    } else if (this.Facing === 4) {
      this.hitbox1.x = this.sprite.x + 14;
      this.hitbox1.y = this.sprite.y - 15;
      this.hitbox2.x = this.sprite.x - 44;
      this.hitbox2.y = this.sprite.y - 44;
    } /* else {
      this.hitbox.x = this.sprite.x - 1;
      this.hitbox.y = this.sprite.y - 3;
    } */
  }
};

module.exports = Monk;
