var Monk = {
  playerClass: 1,
  moveMode: 0,
  slashTime: 500,
  classInit: function () {
    this.sprite.loadTexture('monk', 0);
  },
  classUpdate: function classUpdate() {
	  //Attacking
    //Slash
    this.slashingDirection();
    if (this.slash.isDown) {
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
      if (this.jumpButton.isDown) {
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
      case 1:
      if (!this.gliding) {
        this.gliding = true;
        this.sprite.body.maxVelocity.y = 80;
        this.sprite.animations.stop();
        if (this.sprite.body.velocity.x > 0) {
          this.sprite.frame = 1;
        } else {
          this.sprite.frame = 11;
        }
      }
      break;
      case 2:
      if (!this.gliding) {
        this.gliding = true;
        this.sprite.body.allowGravity = false;
        this.sprite.body.acceleration.y = -500;
        this.sprite.animations.stop();
        if (this.sprite.body.velocity.x > 0) {
          this.sprite.frame = 5;
        } else {
          this.sprite.frame = 15;
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
    if (this.sprite.body.blocked.up || this.sprite.body.blocked.down || !this.jumpButton.isDown) {
        this.glide(0);
    }
  },
  slashat: function slashat() {
    if (this.Facing === 1) {
      this.sprite.animations.play('monk_slash_right');
    } else if (this.Facing === 2) {
      this.sprite.animations.play('monk_slash_rightup');
    } else if (this.Facing == 3) {
      this.sprite.animations.play('monk_slash_up');
    } else if (this.Facing === 4) {
      this.sprite.animations.play('monk_slash_leftup');
    } else if (this.Facing === 5) {
      this.sprite.animations.play('monk_slash_left');
    } else if (this.Facing === 6) {
      this.sprite.animations.play('monk_slash_leftdown');
    } else if (this.Facing === 7) {
      this.sprite.animations.play('monk_down');
    } else if (this.Facing === 8) {
      this.sprite.animations.play('monk_slash_rightdown');
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
    if (this.Facing === 1 || this.Facing === 5) {
      //left and right
      this.hitbox1.x = this.sprite.x + 58;
      this.hitbox1.y = this.sprite.y + 29;
      this.hitbox2.x = this.sprite.x;
      this.hitbox2.y = this.sprite.y + 29;
      //up
    } else if (this.Facing == 3) {
      this.hitbox1.x = this.sprite.x + 14;
      this.hitbox1.y = this.sprite.y;
      this.hitbox2.x = this.sprite.x + 44;
      this.hitbox2.y = this.sprite.y;
      //down
    } else if (this.Facing == 7) {
      this.hitbox1.x = this.sprite.x + 58;
      this.hitbox1.y = this.sprite.y + 29;
      this.hitbox2.x = this.sprite.x;
      this.hitbox2.y = this.sprite.y + 29;
      //upright and downleft
    } else if (this.Facing === 2 || this.Facing === 6) {
      this.hitbox1.x = this.sprite.x + 58;
      this.hitbox1.y = this.sprite.y;
      this.hitbox2.x = this.sprite.x;
      this.hitbox2.y = this.sprite.y + 29;
      //upleft and downright
    } else if (this.Facing === 4 || this.Facing === 8) {
      this.hitbox1.x = this.sprite.x + 58;
      this.hitbox1.y = this.sprite.y + 29;
      this.hitbox2.x = this.sprite.x;
      this.hitbox2.y = this.sprite.y;
    } /* else {
      this.hitbox.x = this.sprite.x - 1;
      this.hitbox.y = this.sprite.y - 3;
    } */
  }
};

module.exports = Monk;
