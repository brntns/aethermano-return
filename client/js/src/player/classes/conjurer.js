var Conjurer = {
  playerClass: 9,
  moveMode: 0,
  slashTime: 1500,
  specialCd: 5000,
  specialOnCd: false,
  classInit: function () {
    this.sprite.loadTexture('conjurer', 0);
    this.bullets = this.game.add.group();
    this.game.physics.enable(this.bullets, Phaser.Physics.ARCADE);
  },
  classUpdate: function classUpdate() {
    switch (this.moveMode) {
      case 0:
        if (this.letterE.isDown && !this.specialOnCd) {
          this.jumpSpell(this);
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
  jumpSpell: function jumpSpell (Player) {
    Player.switchToCasting();
    Player.sprite.animations.stop();
    if (Player.Facing === 1 || Player.Facing === 2 || Player.Facing === 8) {
      Player.sprite.animations.play('conjurer_jumpCast_right');
      Player.status = 142;
    } else {
      Player.sprite.animations.play('conjurer_jumpCast_left');
      Player.status = 143;
    }
    Player.game.time.events.add(250, function(){
      Player.switchToNormal();
      Player.slashAni = true;
      Player.sprite.animations.stop();
      Player.sprite.body.maxVelocity.y = 1000;
      if (Player.Facing === 3 || Player.Facing === 7 ) {
        Player.sprite.animations.play('conjurer_jump_right');
        Player.status = 144;
        Player.sprite.body.velocity.y = -900;
      } else if (Player.Facing === 1 || Player.Facing === 2 || Player.Facing === 8) {
        Player.sprite.animations.play('conjurer_jump_right');
        Player.status = 145;
        Player.sprite.body.velocity.y = -400;
        Player.sprite.body.velocity.x = 800;
      } else {
        Player.sprite.animations.play('conjurer_jump_left');
        Player.status = 144;
        Player.sprite.body.velocity.y = -400;
        Player.sprite.body.velocity.x = -800;
      }
    }, this);
    Player.specialOnCd = true;
    Player.game.time.events.add(Player.specialCd, function() {
      Player.specialOnCd = false;
    }, this);
    Player.game.time.events.add(1000, function() {
      Player.slashAni = false;
      Player.sprite.body.maxVelocity.y = 500;
    }, this);
  },
  shoot:function shoot(Player) {
    //var fireballCast = null;
    Player.slashing = true;
    Player.slashAni = true;
    Player.slashed = true;
    Player.switchToCasting();
    Player.sprite.animations.stop();
    if (Player.Facing === 1 || Player.Facing === 2 || Player.Facing === 8) {
      Player.sprite.animations.play('conjurer_cast_right');
      Player.status = 140;
    } else {
      Player.sprite.animations.play('conjurer_cast_left');
      Player.status = 141;
    }
    Player.game.time.events.add(333, function(){
      Player.switchToNormal();
      Player.slashAni = false;
      Player.sprite.frame = 0;
      if (Player.Facing === 1 || Player.Facing === 2 || Player.Facing === 8) {
      Player.bullet = Player.bullets.create(
        Player.sprite.x,
        Player.sprite.y - 11,
        'magic_missile'
      );
      } else {
      Player.bullet = Player.bullets.create(
        Player.sprite.x - 32,
        Player.sprite.y - 11,
        'magic_missile'
      );
      }
      Player.game.physics.enable(Player.bullet, Phaser.Physics.ARCADE);
      Player.bullet.outOfBoundsKill = true;
      Player.bullet.body.setSize(15,6,8,12);
      Player.bullet.body.allowGravity = false;
      Player.bullet.body.velocity.y = 0;
      Player.bullet.animations.add('fly_left', [0,1,2,3], 12, true);
      Player.bullet.animations.add('fly_right', [4,5,6,7], 12, true);      
      Player.bullet.animations.add('explode', [8,9,10,11,12], 12, true);      
      if (Player.Facing === 1 || Player.Facing === 2 || Player.Facing === 8) {
        Player.bullet.body.velocity.x = 400;
        Player.bullet.animations.play('fly_right');
      } else if (Player.Facing === 4 || Player.Facing === 5 || Player.Facing === 6) {
        Player.bullet.body.velocity.x = -400;
        Player.bullet.animations.play('fly_left');
      }
    }, this);
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
  }
};

module.exports = Conjurer;