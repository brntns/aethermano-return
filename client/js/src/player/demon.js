var Demon = {
  playerClass: 5,
  moveMode: 0,
  classInit: function () {
    this.sprite.loadTexture('demon', 0);
    this.slashTime = 312;
  },
  classUpdate: function classUpdate() {
    //add some attacks for demon!
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
  },
  slashat: function slashat() {
    if (this.Facing === 1 || this.Facing === 2 || this.Facing === 3 || this.Facing === 8) {
      this.sprite.animations.play('demon_slash_right');
    } else if (this.Facing === 4 || this.Facing === 5 || this.Facing === 6 || this.Facing === 7) {
      this.sprite.animations.play('demon_slash_left');
    }
    this.hitbox1.visible = true;
    this.slashing = true;
    this.game.time.events.remove(this.slashTimer);
    this.slashTimer = this.game.time.events.add(this.slashTime,function(){this.hitbox1.visible = false;this.hitbox2.visible = false;this.slashing = false;},this);
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

module.exports = Demon;