var Icemage = {
  playerClass: 6,
  moveMode: 0,
  slashTime: 1500,
  classInit: function () {
    this.sprite.loadTexture('icemage', 0);
    this.bullets = this.game.add.group();
    this.game.physics.enable(this.bullets, Phaser.Physics.ARCADE);
  },
  classUpdate: function classUpdate() {
    switch (this.moveMode) {
      case 0:
        if (this.letterE.isDown && !this.flycd) {
          this.fly();
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
      case 9: //Flying
        this.directions();
        this.flying();
        this.flyingSlow();
        if (!this.letterE.isDown) {
          this.switchToNormal();
          this.game.time.events.add(this.flyCd,function(){this.flycd = false;},this);
          this.game.time.events.remove(this.flyTimer);
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
    Player.slashAni = true;
    Player.slashed = true;
    Player.switchToCasting();
    Player.sprite.animations.stop();
    if (Player.Facing === 1 || Player.Facing === 2 || Player.Facing === 8) {
      Player.sprite.animations.play('icemage_cast_right');
      Player.status = 110;
    } else {
      Player.sprite.animations.play('icemage_cast_left');
      Player.status = 111;
    }
    Player.game.time.events.add(500, function(){
      Player.switchToNormal();
      Player.slashAni = false;
      Player.sprite.frame = 0;
      if (Player.Facing === 1 || Player.Facing === 2 || Player.Facing === 8) {
      Player.bullet = Player.bullets.create(
        Player.sprite.x,
        Player.sprite.y - 28,
        'icelance'
      );
      } else {
      Player.bullet = Player.bullets.create(
        Player.sprite.x - 63,
        Player.sprite.y - 28,
        'icelance'
      );
      }
      Player.game.physics.enable(Player.bullet, Phaser.Physics.ARCADE);
      Player.bullet.outOfBoundsKill = true;
      Player.bullet.body.setSize(24,6,19,28);
      Player.bullet.body.allowGravity = false;
      Player.bullet.body.velocity.y = 0;
      Player.bullet.animations.add('fly_right', [0,1,2,3,4,5], 12, true);
      Player.bullet.animations.add('fly_left', [6,7,8,9,10,11], 12, true);
      if (Player.Facing === 1 || Player.Facing === 2 || Player.Facing === 8) {
        Player.bullet.body.velocity.x = 600;
        Player.bullet.animations.play('fly_right');
      } else if (Player.Facing === 4 || Player.Facing === 5 || Player.Facing === 6) {
        Player.bullet.body.velocity.x = -600;
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
  switchToFlying: function switchToFlying() {
    this.moveMode = 9;
    this.sprite.body.allowGravity = false;
    this.sprite.body.acceleration.x = 0;
    this.sprite.body.acceleration.y = 0;
  },
  flyCooldown: function flyCooldown() {
    this.game.time.events.add(this.flyCd,function(){this.flycd = false;},this);
  },
  fly: function fly() {
    this.switchToFlying();
    this.flycd = true;
    this.flyTimer = this.game.time.events.add(this.flyingDuration,function(){this.switchToNormal();this.flyCooldown();},this);
  },
  flying: function flying() {
    var flyacc = 500;
    var velX = this.sprite.body.velocity.x;
    var velY = this.sprite.body.velocity.y;
    //Flying UP/RIGHT
    if (this.direction === 2) {
      this.sprite.body.acceleration.x = Math.max(0.8*(flyacc-velX),0);
      this.sprite.body.acceleration.y = Math.min(-0.8*(flyacc+velY),0);
      this.flyingAnimation(1);
    //Flying UP/LEFT
    } else if (this.direction === 4) {
      this.sprite.body.acceleration.x = Math.min(-0.8*(flyacc+velX),0);
      this.sprite.body.acceleration.y = Math.min(-0.8*(flyacc+velY),0)
      this.flyingAnimation(0);
    //Flying DOWN/LEFT
    } else if (this.direction === 6) {
      this.sprite.body.acceleration.x = Math.min(-0.8*(flyacc+velX),0);
      this.sprite.body.acceleration.y = Math.max(0.8*(flyacc-velY),0);
      this.flyingAnimation(0);
    //Flying DOWN/RIGHT
    } else if (this.direction === 8) {
      this.sprite.body.acceleration.x = Math.max(0.8*(flyacc-velX),0);
      this.sprite.body.acceleration.y = Math.max(0.8*(flyacc-velY),0);
      this.flyingAnimation(1);
    //Flying RIGHT
    } else if (this.direction === 1) {
      this.sprite.body.acceleration.x = Math.max(flyacc-velX,0);
      this.sprite.body.acceleration.y = 0;
      this.flyingAnimation(1);
    //Flying UP
    } else if (this.direction === 3) {
      this.sprite.body.acceleration.x = 0;
      this.sprite.body.acceleration.y = Math.min(-(flyacc+velY),0);
    //Flying LEFT
    } else if (this.direction === 5) {
      this.sprite.body.acceleration.x = Math.max(-(flyacc+velX),0);
      this.sprite.body.acceleration.y = 0;
      this.flyingAnimation(0);
    //Flying DOWN
    } else if (this.direction === 7) {
      this.sprite.body.acceleration.x = 0;
      this.sprite.body.acceleration.y = Math.max(flyacc-velY,0);
    }
  },
  flyingSlow: function flyingSlow() {
    if (this.direction === 0) {
      if (this.sprite.body.velocity.x > 0) {
        this.sprite.body.acceleration.x = -2*this.sprite.body.velocity.x;
      } else if (this.sprite.body.velocity.x < 0) {
        this.sprite.body.acceleration.x = -2*this.sprite.body.velocity.x;
      } else {
        this.sprite.body.acceleration.x = 0;
      }
      if (this.sprite.body.velocity.y > 0) {
        this.sprite.body.acceleration.y = -2*this.sprite.body.velocity.y;
      } else if (this.sprite.body.velocity.y < 0) {
        this.sprite.body.acceleration.y = -2*this.sprite.body.velocity.y;
      } else {
        this.sprite.body.acceleration.y = 0;
      }
    }
  },
  flyingAnimation: function flyingAnimation(N) {
    if (!this.slashAni) {
      if (N === 0) { //Fly Left
        this.sprite.animations.play('icemage_fly_left');
        this.status = 112;
      }
      if (N === 1) { //Fly Right
        this.sprite.animations.play('icemage_fly_right');
        this.status = 113;
      }
    }
  }
};

module.exports = Icemage;
