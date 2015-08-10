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
        if (this.letterE.isDown && !this.teleportcd) {
          this.teleportLR(this.Facing,this);
        }
        //attacking
        if (this.letterS.isDown) {
          if (!this.slashed) {
            this.detonate = false;
            this.shoot(this);
          }
          if (this.slashed) {
            this.detonate = true;
          }
        }
      break;
      case 3:
       //Climbing Ladder
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
    Player.slashAni = true;
    Player.slashed = true;
    Player.switchToCasting();
    Player.sprite.animations.stop();
    if (Player.Facing === 1 || Player.Facing === 2 || Player.Facing === 8) {
      Player.sprite.animations.play('wizard_fireball_right');
      Player.status = 80;
    } else {
      Player.sprite.animations.play('wizard_fireball_left');
      Player.status = 81;
    }
    Player.game.time.events.add(416, function(){
      Player.switchToNormal();
      Player.slashAni = false;
      Player.sprite.frame = 0;
      if (Player.Facing === 1 || Player.Facing === 2 || Player.Facing === 8) {
      Player.bullet = Player.bullets.create(
        Player.sprite.x  - 10,
        Player.sprite.y - 29,
        'fireball'
      );
      //console.log('Created Fireball');
      } else {
      Player.bullet = Player.bullets.create(
        Player.sprite.x - 63,
        Player.sprite.y - 29,
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
  switchToCasting: function switchToCasting() {
    this.moveMode = 10;
    this.sprite.body.allowGravity = false;
    this.sprite.body.velocity.x = 0;
    this.sprite.body.velocity.y = 0;
    this.sprite.body.acceleration.x = 0;
    this.sprite.body.acceleration.y = 0;
  },
  teleportLR: function teleportLR(z, Player) {
    console.log('Attempting to Teleport');
    this.switchToCasting();
    this.sprite.animations.stop();
    var TeleportCast = this.sprite.animations.play('teleport_depart');
    Player.status = 82;
    TeleportCast.onComplete.add(function(){Player.teleporting = z;});
    this.teleportcd = true;
    //this.sprite.animations.play('teleport');
    this.game.time.events.add(this.teleportCd,function(){this.teleportcd = false;},this);
  }
};

module.exports = Wizard;
