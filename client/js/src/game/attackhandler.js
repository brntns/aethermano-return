var ahandler = {
  enemySlashingHandler: function enemySlashingHandler(playerHitbox, monster) {
    switch (this.player.playerClass) {
    case 0:
      this.slashMonster(monster, 2, 50, 20)
      //playerHitbox.animations.play('explode');
      //  playerHitbox.kill();
    break;
    case 1: //Monk
      this.slashMonster(monster,10,100,70);
    break;
    case 2:
    break;
    case 3: //Wizard
    break;
    case 4: //Native
    break;
    case 5:
    break;
    case 6:
    break;
    default:
    break;
    }
  },
  enemyBulletHandler: function enemyBulletHandler (playerHitbox, monster) {
    var thisGame = this;
    switch (this.player.playerClass) {
      case 0:
      break;
      case 1:
      break;
      case 2:
      break;
      case 3: //Wizard
        if (!this.fireballTrigger) {
          this.fireballTrigger = true;
          if (!monster.slashed) {
            this.slashMonster(monster, 20, 0, 0);
          }
          playerHitbox.body.velocity.x = 0;
          playerHitbox.body.acceleration.x = 0;
          if (this.player.Facing === 1 || this.player.Facing === 2 || this.player.Facing === 8) {
            playerHitbox.x += 20;
          } else {
            playerHitbox.x -= 20;
          }
          playerHitbox.body.setSize(66,66,0,0);
          this.game.time.events.add(1000, function(){thisGame.fireballTrigger = false;});
          playerHitbox.animations.stop();
          var explosion = playerHitbox.animations.play('explode');
          explosion.onComplete.add(function(){
            if (playerHitbox !== undefined) {
              playerHitbox.kill();
            }
          });
        }
      break;
      case 4: //Native
        this.slashMonster(monster, 4, 0, 0);
        playerHitbox.body.velocity.x = 0;
        var explosion = null;
        if (this.player.Facing === 1 || this.player.Facing === 2 || this.player.Facing === 8) {
          explosion = playerHitbox.animations.play('explode_right');
        } else {
          explosion = playerHitbox.animations.play('explode_left');
        }
        var Player = this.player;
        explosion.onComplete.add(function(){
          if (playerHitbox !== undefined) {
            playerHitbox.kill();
            Player.slashing = false;
          }
        });
      break;
      case 5:
      break;
      case 6:
        if (!monster.slashed) {
          this.slashMonster(monster, 4, 0, 0);
        }
        this.game.time.events.add(50, function(){this.player.slashing = true;},this);
      break;
      case 7: //Witchdoc
        if (!monster.slashed) {
          this.slashMonster(monster, 10, 0, 0);
        }
        if (this.player.Facing === 1 || this.player.Facing === 2 || this.player.Facing === 8) {
          explosion = playerHitbox.animations.play('explode_right');
        } else {
          explosion = playerHitbox.animations.play('explode_left');
        }
        explosion.onComplete.add(function(){
          if (playerHitbox !== undefined) {
            playerHitbox.kill();
          }
        });
      break;
      case 9: //Conjurer
        if (!monster.slashed) {
          this.slashMonster(monster, 8, 0, 0);
        }
        playerHitbox.body.velocity.x = 0;
        playerHitbox.body.velocity.y = 0;
        explosion = playerHitbox.animations.play('explode');
        explosion.onComplete.add(function(){
          if (playerHitbox !== undefined) {
            playerHitbox.kill();
          }
        });
      break;
      default:
      break;
    }
  },
  slashMonster: function slashMonster(monster, damage, knockback, knockup) {
    if (this.player.slashing) {
      if (monster.hitpoints > damage) {
        monster.spawned = false;
        monster.hitpoints -= damage;
        if (this.player.Facing === 1 || this.player.Facing === 2 || this.player.Facing === 8) {
          monster.body.velocity.x += knockback;//Math.random()*1200-600;
        } else if (this.player.Facing === 4 || this.player.Facing === 5 || this.player.Facing === 6) {
          monster.body.velocity.x -= knockback;
        }
        monster.body.velocity.y -= knockup;
        this.client.monsterSlashed(monster);
      /*  monster.runleft.pause();
        this.game.time.events.remove(monster.stunTimer);
        monster.stunTimer = this.game.time.events.add(this.monsterStun,function(){this.monsterReset(monster)},this); */
      } else {
        monster.spawned = false;
        monster.destroy();
        this.client.monsterKilled(monster);
      }
      this.player.slashing = false;
      monster.slashed = true;
      this.game.time.events.add(300,function(){
        monster.slashed = false;
      },this);
    }
  },
  detonateFireball: function detonateFireball(playerHitbox) {
    var thisGame = this;
    this.player.detonate = false;
    this.game.time.events.remove(this.player.slashTimer2);
    if (playerHitbox !== null && playerHitbox !== undefined) {
      if (!this.fireballTrigger) {
        this.fireballTrigger = true;
        playerHitbox.body.velocity.x = 0;
        playerHitbox.body.acceleration.x = 0;
        if (this.player.Facing === 1 || this.player.Facing === 2 || this.player.Facing === 8) {
          playerHitbox.x += 20;
        } else {
          playerHitbox.x -= 20;
        }
        playerHitbox.body.setSize(66,66,0,0);
        this.game.time.events.add(1000, function(){thisGame.fireballTrigger = false;});
        playerHitbox.animations.stop();
        playerHitbox.animations.add('explode', [8,9,10,11,12,13,14,15,16,17,18,19,20], 16, false);
        var explosion = playerHitbox.animations.play('explode');
        explosion.onComplete.add(function(){
          if (playerHitbox !== undefined) {
            playerHitbox.kill();
          }
        });
      }
    }
  },
  wallHit: function wallHit(playerHitbox, monster) {
    if (!this.fireballTrigger && playerHitbox !== undefined) {
      playerHitbox.kill();
    }
    this.player.slashing = false;
  }

};

module.exports = ahandler;
