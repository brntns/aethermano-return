var Witchdoc = {
  playerClass: 7,
  moveMode: 0,
  slashTime: 2500,
  classInit: function () {
    this.sprite.loadTexture('witchdoc', 0);
    this.bullets = this.game.add.group();
    this.game.physics.enable(this.bullets, Phaser.Physics.ARCADE);
    this.shrunk = false;
  },
  classUpdate: function classUpdate() {
    switch (this.moveMode) {
      case 0:
        if (this.letterE.isDown && !this.shrinkCd) {
          if (!this.shrunk) {
            this.shrink(this);
          } else {
            this.unshrink(this);
          }
        }
        //attacking
        if (this.letterS.isDown && !this.shrunk) {
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
  shoot:function shoot(Player) {
    //var fireballCast = null;
    Player.slashing = true;
    Player.slashAni = true;
    Player.slashed = true;
    Player.switchToCasting();
    Player.sprite.animations.stop();
    if (Player.Facing === 1 || Player.Facing === 2 || Player.Facing === 8) {
      Player.sprite.animations.play('witchdoc_cast_right');
      Player.status = 120;
    } else {
      Player.sprite.animations.play('witchdoc_cast_left');
      Player.status = 121;
    }
    Player.game.time.events.add(584, function(){
      Player.switchToNormal();
      Player.slashAni = false;
      Player.sprite.frame = 0;
      if (Player.Facing === 1 || Player.Facing === 2 || Player.Facing === 8) {
      Player.bullet = Player.bullets.create(
        Player.sprite.x + 2,
        Player.sprite.y - 21,
        'voodoo_skull'
      );
      //console.log('Created Fireball');
      } else {
      Player.bullet = Player.bullets.create(
        Player.sprite.x - 35,
        Player.sprite.y - 21,
        'voodoo_skull'
      );
      //console.log('Created Fireball');
      }
      Player.game.physics.enable(Player.bullet, Phaser.Physics.ARCADE);
      Player.bullet.outOfBoundsKill = true;
      //Player.bullet.anchor.setTo(0.2, 0.2);
      Player.bullet.aggro = false;
      Player.bullet.body.setSize(4,4,32,32);
      Player.bullet.body.allowGravity = false;
      Player.bullet.body.velocity.y = 0;
      Player.bullet.animations.add('fly_right', [0,1,2,3], 12, true);
      Player.bullet.animations.add('fly_left', [4,5,6,7], 12, true);
      Player.bullet.animations.add('explode_right', [9,10,11,12,13,14,15,16,17,18], 12, false);
      Player.bullet.animations.add('explode_left', [19,20,21,22,23,24,25,26,27,28], 12, false);
      if (Player.Facing === 1 || Player.Facing === 2 || Player.Facing === 8) {
        Player.bullet.body.velocity.x = 132;
        Player.bullet.body.velocity.y = -27;
        Player.bullet.animations.play('fly_right');
      } else if (Player.Facing === 4 || Player.Facing === 5 || Player.Facing === 6) {
        Player.bullet.body.velocity.x = -132;
        Player.bullet.body.velocity.y = -27;
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
  shrink: function shrink(Player) {
    console.log('Shrinking');
    Player.sprite.body.setSize(13, 15, 0, 6);
    Player.sprite.loadTexture('witchdoc_shrunk', 0);
    Player.status = 122;
    Player.shrinkCd = true;
    Player.shrunk = true;
    Player.game.time.events.add(500,function(){Player.shrinkCd = false;},Player);
  },
  unshrink: function unshrink(Player) {
    console.log('Unshrinking');
    Player.sprite.body.setSize(29, 29, 0, 0);
    Player.sprite.loadTexture('witchdoc', 0);
    Player.status = 123;
    Player.shrinkCd = true;
    Player.shrunk = false;
    Player.game.time.events.add(500,function(){Player.shrinkCd = false;},Player);
  }
};

module.exports = Witchdoc;