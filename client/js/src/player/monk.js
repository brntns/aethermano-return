var Monk = {
  playerClass: 1,
  moveMode: 0,
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
      this.glideCond();
      if (this.jumpButton.isDown) {
        this.glidy();
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
      }
      break;
      case 2:
      if (!this.gliding) {
        this.gliding = true;
        this.sprite.body.allowGravity = false;
        this.sprite.body.acceleration.y = -500;
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
      this.hitbox.loadTexture('monk_slash_right', 0);
      this.hitbox.animations.play('monk_slash_right');
    } else if (this.Facing === 2) {
      this.hitbox.loadTexture('monk_slash_rightup', 0);
      this.hitbox.animations.play('monk_slash_rightup');
    } else if (this.Facing == 3) {
      this.hitbox.loadTexture('monk_slash_up', 0);
      this.hitbox.animations.play('monk_slash_up');
    } else if (this.Facing === 4) {
      this.hitbox.loadTexture('monk_slash_leftup', 0);
      this.hitbox.animations.play('monk_slash_leftup');
    } else if (this.Facing === 5) {
      this.hitbox.loadTexture('monk_slash_left', 0);
      this.hitbox.animations.play('monk_slash_left');
    } else if (this.Facing === 6) {
      this.hitbox.loadTexture('monk_slash_leftdown', 0);
      this.hitbox.animations.play('monk_slash_leftdown');
    } else if (this.Facing === 7) {
      this.hitbox.loadTexture('monk_slash_down', 0);
      this.hitbox.animations.play('monk_slash_down');
    } else if (this.Facing === 8) {
      this.hitbox.loadTexture('monk_slash_rightdown', 0);
      this.hitbox.animations.play('monk_slash_rightdown');
    }
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
  }
};

module.exports = Monk;
