var Demon = {
  playerClass: 5,
  moveMode: 0,
  slashTime: 312,
  classInit: function () {
    this.sprite.loadTexture('demon', 0);
    this.bullets = this.game.add.group();
    this.game.physics.enable(this.bullets, Phaser.Physics.ARCADE);
  },
  classUpdate: function classUpdate() {
    switch (this.moveMode) {
      case 0:
        //add some attacks for demon!
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
      break;
      default:
        this.moveMode = 0;
      break;
    }
  },
  slashat: function slashat() {
    if (this.Facing === 1 || this.Facing === 2 || this.Facing === 3 || this.Facing === 8) {
      this.sprite.animations.play('demon_slash_right');
    } else if (this.Facing === 4 || this.Facing === 5 || this.Facing === 6 || this.Facing === 7) {
      this.sprite.animations.play('demon_slash_left');
    }
    this.hitbox1.visible = true;
    this.hitbox2.visible = true;
    this.slashing = true;
    this.game.time.events.remove(this.slashTimer);
    this.slashTimer = this.game.time.events.add(this.slashTime,function(){this.hitbox1.visible = false;this.hitbox2.visible = false;this.slashing = false;},this);
  },
  slashingDirection: function slashingDirection() {
    this.hitbox2.x = this.sprite.x + 29;
    this.hitbox2.y = this.sprite.y + 29;
    if (this.Facing === 1 || this.Facing === 2 || this.Facing === 3 || this.Facing === 8) {
      //right
      this.hitbox1.x = this.sprite.x + 58;
      this.hitbox1.y = this.sprite.y + 29;
    } else if (this.Facing === 4 || this.Facing === 5 || this.Facing === 6 || this.Facing === 7) {
      //left
      this.hitbox1.x = this.sprite.x;
      this.hitbox1.y = this.sprite.y + 29;
    }
  }
};

module.exports = Demon;
