var Wizard = {
  playerClass: 3,
  moveMode: 0,
  slashTime: 2000,
  classInit: function () {
    this.sprite.loadTexture('wizard', 0);
  },
  classUpdate: function classUpdate() {
    switch (this.moveMode) {
      case 0:
        if (this.teleport.isDown && !this.teleportcd) {
          this.teleportLR(this.direction);
        }
        //attacking
        if (this.slash.isDown) {
          if (this.sprite.body.blocked.down) {
            if (!this.slashed) {
              this.shoot();
              this.slashed = true;
            }
          }
        }
      break;
      default:
        this.moveMode = 0;
      break;
    }
  },
  shoot:function shoot() {
    this.slashing = true;
    this.slashed = true;
    var fireballCast = this.sprite.animations.play('wizard_fireball');
    fireballCast.onComplete(function(){
      this.bullet = this.bullets.create(
        this.sprite.body.x + this.sprite.body.width / 2 + 20,
        this.sprite.body.y + this.sprite.body.height / 2 - 4,
        'fireball'
      );
      this.game.physics.enable(this.bullet, Phaser.Physics.ARCADE);
      this.bullet.outOfBoundsKill = true;
      this.bullet.anchor.setTo(0.5, 0.5);
      this.bullet.body.setSize(31,31,4,4);
      this.bullet.body.allowGravity = false;
      this.bullet.body.velocity.y = 0;
      this.bullet.animations.add('fly_right', [0,1,2,3], 12, true);
      this.bullet.animations.add('fly_left', [4,5,6,7], 12, true);
      this.bullet.animations.add('explode', [8,9,10,11,12,13,14,15,16,17,18,19,20], 12, false);
      if (this.Facing === 1 || this.Facing === 2 || this.Facing === 8) {
        this.bullet.body.velocity.x = 250;
        this.bullet.animations.play('fly_right');
      } else if (this.Facing === 4 || this.Facing === 5 || this.Facing === 6) {
        this.bullet.body.velocity.x = -250;
        this.bullet.animations.play('fly_left');
      }
    });
    this.slashTimer = this.game.time.events.add(this.slashTime,function(){
      this.slashing = false;
      this.slashed = false;
    },this);
  },
  teleportLR: function teleportLR(z) {
    if (z === 1) {
      this.sprite.x = this.sprite.x + this.teleportRangeX;
    } else if (z === 2){
      this.sprite.y = this.sprite.y - Math.floor(this.teleportRangeY/1.5);
      this.sprite.x = this.sprite.x + Math.floor(this.teleportRangeX/1.5);
    } else if (z === 3){
      this.sprite.y = this.sprite.y - Math.floor(this.teleportRangeY);
    } else if (z === 4){
      this.sprite.y = this.sprite.y - Math.floor(this.teleportRangeY/1.5);
      this.sprite.x = this.sprite.x - Math.floor(this.teleportRangeX/1.5);
    } else if (z === 5){
      this.sprite.x = this.sprite.x - Math.floor(this.teleportRangeX);
    } else if (z === 6){
      this.sprite.y = this.sprite.y + Math.floor(this.teleportRangeY/1.5);
      this.sprite.x = this.sprite.x - Math.floor(this.teleportRangeX/1.5);
    } else if (z === 7){
      this.sprite.y = this.sprite.y + Math.floor(this.teleportRangeY);
    } else {
      this.sprite.y = this.sprite.y + Math.floor(this.teleportRangeY/1.5);
      this.sprite.x = this.sprite.x + Math.floor(this.teleportRangeX/1.5);
    }
    this.teleportcd = true;
    this.game.time.events.add(this.teleportCd,function(){this.teleportcd = false;},this);
  }
};

module.exports = Wizard;
