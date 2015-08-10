var Jester = {
  playerClass: 5,
  moveMode: 0,
  slashTime: 5000,
  specialCd: 1000,
  specialOnCd: false,
  classInit: function () {
    this.sprite.loadTexture('jester', 0);
    this.bullets = this.game.add.group();
    this.game.physics.enable(this.bullets, Phaser.Physics.ARCADE);
  },
  classUpdate: function classUpdate() {
    switch (this.moveMode) {
      case 0:
        if (this.letterE.isDown && !this.specialOnCd) {
          this.fart(this);
        }
        //attacking
        if (this.letterS.isDown) {
          if (!this.slashed) {
            this.shoot(this);
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
  fart: function fart(Player) {
    Player.slashAni = true;
    Player.game.time.events.add(417,function(){
      Player.slashAni = false;
    },this);
    Player.sprite.animations.stop();
    if (Player.Facing === 1 || Player.Facing === 2 || Player.Facing === 8) {
      Player.sprite.animations.play('jester_fart_right');
      Player.status = 103;
    } else {
      Player.sprite.animations.play('jester_fart_left');
      Player.status = 102;
    }
    Player.specialOnCd = true;
    this.game.time.events.add(Player.specialCd, function() {
      Player.specialOnCd = false;
    }, this);
  },
  shoot:function shoot(Player) {
    //var fireballCast = null;
    Player.slashing = true;
    Player.slashAni = true;
    Player.slashed = true;
    Player.sprite.animations.stop();
    if (Player.Facing === 1 || Player.Facing === 2 || Player.Facing === 8) {
      Player.sprite.animations.play('jester_throw_right');
      Player.status = 100;
    } else {
      Player.sprite.animations.play('jester_throw_left');
      Player.status = 101;
    }
    Player.game.time.events.add(167, function(){
      Player.slashAni = false;
      if (Player.Facing === 1 || Player.Facing === 2 || Player.Facing === 8) {
      Player.bullet = Player.bullets.create(
        Player.sprite.x,
        Player.sprite.y - 29,
        'rotten'
      );
      } else {
      Player.bullet = Player.bullets.create(
        Player.sprite.x - 32,
        Player.sprite.y - 29,
        'rotten'
      );
      }
      Player.game.physics.enable(Player.bullet, Phaser.Physics.ARCADE);
      Player.bullet.outOfBoundsKill = true;
      Player.bullet.body.setSize(4,4,13,13);
      Player.bullet.body.allowGravity = true;
      Player.bullet.body.velocity.y = -200;
      Player.bullet.animations.add('fly_right', [0,1,2,3], 12, true);
      Player.bullet.animations.add('fly_left', [4,5,6,7], 12, true);
      if (Player.Facing === 1 || Player.Facing === 2 || Player.Facing === 8) {
        Player.bullet.body.velocity.x = 400;
        Player.bullet.animations.play('fly_right');
      } else if (Player.Facing === 4 || Player.Facing === 5 || Player.Facing === 6) {
        Player.bullet.body.velocity.x = -400;
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
  }
};

module.exports = Jester;
