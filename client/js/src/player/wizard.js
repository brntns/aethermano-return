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
              this.detonate = false;
              this.shoot(this);
            }
          }
          if (this.slashed) {
            this.detonate = true;
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
    //var fireballCast = null;
    Player.slashing = true;
    Player.slashed = true;
    Player.moveMode = 10;
    Player.sprite.animations.stop();
    if (Player.Facing === 1 || Player.Facing === 2 || Player.Facing === 8) {
      Player.sprite.animations.play('wizard_fireball_right');
    } else {
      Player.sprite.animations.play('wizard_fireball_left');
    }
    Player.game.time.events.add(416, function(){
      Player.moveMode = 0;
      Player.sprite.frame = 0;
      if (Player.Facing === 1 || Player.Facing === 2 || Player.Facing === 8) {
      Player.bullet = Player.bullets.create(
        Player.sprite.x + 34,
        Player.sprite.y + 15,
        'fireball'
      );
      //console.log('Created Fireball');
      } else {
      Player.bullet = Player.bullets.create(
        Player.sprite.x - 19,
        Player.sprite.y + 15,
        'fireball'
      );        
      //console.log('Created Fireball');
      }
      Player.game.physics.enable(Player.bullet, Phaser.Physics.ARCADE);
      Player.bullet.outOfBoundsKill = true;
      //Player.bullet.anchor.setTo(0.2, 0.2);
      Player.bullet.body.setSize(4,4,32,32);
      Player.bullet.body.allowGravity = false;
      Player.bullet.body.velocity.y = 0;
      Player.bullet.animations.add('fly_right', [0,1,2,3], 12, true);
      Player.bullet.animations.add('fly_left', [4,5,6,7], 12, true);
      Player.bullet.animations.add('explode', [8,9,10,11,12,13,14,15,16,17,18,19,20], 16, false);
      if (Player.Facing === 1 || Player.Facing === 2 || Player.Facing === 8) {
        Player.bullet.body.velocity.x = 72;
        Player.bullet.body.acceleration.x = 600;
        Player.bullet.animations.play('fly_right');
      } else if (Player.Facing === 4 || Player.Facing === 5 || Player.Facing === 6) {
        Player.bullet.body.velocity.x = -72;
        Player.bullet.body.acceleration.x = -600;
        Player.bullet.animations.play('fly_left');
      }
    });
    Player.slashTimer = Player.game.time.events.add(Player.slashTime,function(){
      Player.slashing = false;
      Player.slashed = false;
      },Player);
    Player.slashTimer2 = Player.game.time.events.add(Player.slashTime,function(){
      if (Player.bullet !== undefined) {
        Player.bullet.kill();
      }
    },Player);
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
    //this.sprite.animations.play('teleport');
    this.game.time.events.add(this.teleportCd,function(){this.teleportcd = false;},this);
  }
};

module.exports = Wizard;
