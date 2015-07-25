var Wizard = {
  playerClass: 3,
  moveMode: 0,
  slashTime: 2000,
  classInit: function () {
    this.sprite.loadTexture('wizard', 0);
    this.bullets = this.game.add.group();
    this.game.physics.enable(this.bullets, Phaser.Physics.ARCADE);
  },
  classUpdate: function classUpdate() {
    switch (this.moveMode) {
      case 0:
        if (this.teleport.isDown && !this.teleportcd) {
          this.teleportLR(this.direction);
        }
        //attacking
        if (this.slash.isDown) {
          if (this.sprite.body.blocked.down && this.sprite.body.velocity.x === 0) {
            if (!this.slashed) {
              this.shoot(this);
            }
          }
        }
      break;
      case 10:
        //casting state (stunned)
      break;
      default:
        this.moveMode = 0;
      break;
    }
  },
  shoot:function shoot(Player) {
    this.slashing = true;
    this.slashed = true;
    if (this.Facing === 1 || this.Facing === 2 || this.Facing === 8) {
      var fireballCast = this.sprite.animations.play('wizard_fireball_right');
    } else {
      var fireballCast = this.sprite.animations.play('wizard_fireball_left');
    }
    fireballCast.onComplete.add(function() {
      Player.slashing = false;
      Player.sprite.frame = 0;
      Player.moveMode = 0;
      if (this.Facing === 1 || this.Facing === 2 || this.Facing === 8) {
      Player.bullet = Player.bullets.create(
        Player.sprite.body.x + Player.sprite.body.width / 2 + 20,
        Player.sprite.body.y + Player.sprite.body.height / 2,
        'fireball'
      );
      } else {
      Player.bullet = Player.bullets.create(
        Player.sprite.body.x + Player.sprite.body.width / 2 - 20,
        Player.sprite.body.y + Player.sprite.body.height / 2,
        'fireball'
      );        
      }
      Player.game.physics.enable(Player.bullet, Phaser.Physics.ARCADE);
      Player.bullet.outOfBoundsKill = true;
      Player.bullet.anchor.setTo(0.5, 0.5);
      Player.bullet.body.setSize(4,4,31,31);
      Player.bullet.body.allowGravity = false;
      Player.bullet.body.velocity.y = 0;
      Player.bullet.animations.add('fly_right', [0,1,2,3], 12, true);
      Player.bullet.animations.add('fly_left', [4,5,6,7], 12, true);
      Player.bullet.animations.add('explode', [8,9,10,11,12,13,14,15,16,17,18,19,20], 16, false);
      if (Player.Facing === 1 || Player.Facing === 2 || Player.Facing === 8) {
        Player.bullet.body.velocity.x = 250;
        Player.bullet.animations.play('fly_right');
      } else if (Player.Facing === 4 || Player.Facing === 5 || Player.Facing === 6) {
        Player.bullet.body.velocity.x = -250;
        Player.bullet.animations.play('fly_left');
      }
    });
    this.slashTimer = this.game.time.events.add(this.slashTime,function(){
      this.slashing = false;
      this.slashed = false;
      if (this.bullet !== undefined) {
        this.bullet.kill();
      }
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
