var Knight = {
  playerClass: 8,
  moveMode: 0,
  slashTime: 227,
  specialCd: 2000,
  specialOnCd: false,
  classInit: function () {
    this.sprite.loadTexture('knight', 0);
    this.bullets = this.game.add.group();
    this.game.physics.enable(this.bullets, Phaser.Physics.ARCADE);
  },
  classUpdate: function classUpdate() {
    switch (this.moveMode) {
      case 0:
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
        if (this.letterE.isDown && !this.specialOnCd) {
          this.charge(this);
        }
      break;
      case 3:
      //climbing ladder
      break;
      case 10:
        //casting state (stunned)
      break;
      default:
        this.moveMode = 0;
      break;
    }
  },
  charge: function charge() {
    this.specialOnCd = true;
    this.game.time.events.add(this.specialCd, function(){
      this.specialOnCd = false;
    },this);
    if (this.Facing === 1 || this.Facing === 2 || this.Facing === 3 || this.Facing === 8) {
      this.sprite.animations.play('knight_charge_right');
      this.status = 135;
      this.game.time.events.add(167, function(){
        this.sprite.animations.stop();
        this.sprite.body.velocity = 400;
        this.sprite.animations.play('knight_charging_right');
        this.status = 137;
      },this);
    } else if (this.Facing === 4 || this.Facing === 5 || this.Facing === 6 || this.Facing === 7) {
      this.sprite.animations.play('knight_charge_left');
      this.status = 134;
      this.game.time.events.add(167, function(){
        this.sprite.animations.stop();
        this.sprite.body.velocity = -400;
        this.sprite.animations.play('knight_charging_left');
        this.status = 136;
      },this);
    }
  },
  slashat: function slashat() {
    if (this.Facing === 1 || this.Facing === 2 || this.Facing === 3 || this.Facing === 8) {
      this.sprite.animations.play('knight_block_right');
      this.status = 131;
      this.game.time.events.add(167, function(){this.sprite.animations.stop();this.sprite.frame = 41;},this);
    } else if (this.Facing === 4 || this.Facing === 5 || this.Facing === 6 || this.Facing === 7) {
      this.sprite.animations.play('knight_block_left');
      this.status = 130;
      this.game.time.events.add(167, function(){this.sprite.animations.stop();this.sprite.frame = 51;},this);
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
    this.hitbox2.x = this.sprite.x - 58;
    this.hitbox2.y = this.sprite.y - 58;
    if (this.Facing === 1 || this.Facing === 2 || this.Facing === 3 || this.Facing === 8) {
      //right
      this.hitbox1.x = this.sprite.x;
      this.hitbox1.y = this.sprite.y - 58;
    } else if (this.Facing === 4 || this.Facing === 5 || this.Facing === 6 || this.Facing === 7) {
      //left
      this.hitbox1.x = this.sprite.x - 88;
      this.hitbox1.y = this.sprite.y - 58;
    }
  }
};

module.exports = Knight;
