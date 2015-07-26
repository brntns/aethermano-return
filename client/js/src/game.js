var Items = require('./items');
var Player = require('./player/player');
var Map = require('./map');
var Client = require('./client');

function Game() {
  this.client = null;
  this.player = null;
  this.map = null;
  this.enemy = null;
  this.client = null;
  this.win = false;
  this.items = null;
  this.monsterGroup = null;
  this.monsters = [];
  this.talkGroup = null;
  this.talks = [];
  this.survivorGroup = null;
  this.survivors = [];
  this.monsterStun = 1000;
  this.playerStun = 200;
  this.invulTime = 750;
  this.vulnTime = 1850;
  this.monsterTimer = true;
  this.ladders = null;
}

Game.prototype = {
  create: function create() {
    // enable frames manipulation & tracking
    this.game.time.advancedTiming = true;

    // enable physics
    this.game.physics.startSystem(Phaser.Physics.ARCADE);
    this.game.physics.arcade.OVERLAP_BIAS = 1;
    // creating game components
    this.player = new Player(this.game, this.map);
    this.map = new Map(this.game,this.player, this);
    this.items = new Items(this.game,this.map,this);
    this.client = new Client(this);
    this.client.create();
  },
  update: function update() {
    // Request Monster Spawn
    this.talks.angle += 1;
    if(this.player.vuln){
      this.player.sprite.tint = 0xFAA1A1;
    }else{
      this.player.sprite.tint = 0xffffff;
    }
    if(this.player.invul){
      this.player.sprite.alpha = 0.5;
      this.player.sprite.tint = 0xffffff;
    }else{
      this.player.sprite.alpha = 1;
    }
    if(this.player.monsterButton.isDown && this.monsterTimer){
      this.monsterTimer = false;
      this.game.time.events.add(1000, function(){ this.monsterTimer = true;},this);
      console.log('requested Monster');
      this.client.monsterRequested(this.player.sprite.x,this.player.sprite.y);
    }
    // show Level
    this.game.debug.text(this.player.level || '', 2, 14, "#ffffff", { font: "30px "} );
    // if player exists
    // if(this.monsterGroup !== null){
    //   console.log(this.monsters);
    // }

    if(this.player !== null && this.map.collisionLayer !== null){
      // this.map.bg.tilePosition.y += 1;
      // console.log(this.monsterGroup);
      // make player collide
      this.game.physics.arcade.collide(this.player.sprite,this.map.collisionLayer);
      this.game.physics.arcade.collide(this.player.sprite,this.items.item, this.itemCollisionHandler, null, this);
      this.game.physics.arcade.collide(this.monsterGroup,this.map.collisionLayer, this.enemyHandler,null,this);
      this.game.physics.arcade.overlap(this.player.sprite,this.monsterGroup, this.enemyCollisionHandler, null, this);
      this.game.physics.arcade.overlap(this.player.hitbox1,this.monsterGroup, this.enemySlashingHandler, null, this);
      this.game.physics.arcade.overlap(this.player.hitbox2,this.monsterGroup, this.enemySlashingHandler, null, this);
      this.game.physics.arcade.overlap(this.player.bullets,this.monsterGroup, this.enemySlashingHandler, null, this);
      if (this.game.physics.arcade.overlap(this.player.sprite,this.ladders)) {
        this.player.onLadder = true;
      } else {
        this.player.onLadder = false;
      }
      this.climbCheck();
      if(this.talks.length > 0){
        for (var i = 0; i < this.talks.length; i++) {
          this.talks[i].sprite.bringToTop();
        }
      }
      this.player.sprite.bringToTop();
      this.player.hitbox1.bringToTop();
      this.player.hitbox2.bringToTop();
      // Update the player
      this.player.update();
      //update nearby Monsters
      if (this.player.spawningLadder) {
        this.player.spawningLadder = false;
        if (this.player.playerClass === 0) {
          this.ladderSpawn();
        }
        if (this.player.playerClass === 4) {
          this.vineSpawn();
        }
      }
    }
    //check for windcondition
    if (this.player.sprite.x > this.map.portal.x
    && this.player.sprite.x < this.map.portal.x + 300
    && this.player.sprite.y > this.map.portal.y
    && this.player.sprite.y < this.map.portal.y + 300
    && !this.win) {
      //console.log('CELEBRATE');
      this.win = true;
      this.client.loadnewMap();
    }
    // if client exist
    if(this.client !== null && this.player !== null) {
      var bits = {
				x: this.player.sprite.x,
				y: this.player.sprite.y,
        status: this.player.status,
        level: this.player.level
			};
      this.client.update(bits);
    }
  },
  vineSpawn: function vineSpawn() {
    var X = Math.floor((this.player.sprite.x+29)/16);
    var Y = Math.floor((this.player.sprite.y+29)/16);
    var maxX = this.map.maps[0].layers[0].height*16;
    var maxY = this.map.maps[0].layers[0].width*16;
    var alternate = 0;
    loop:
    for (var i = 0; i < 20; i++) {
      if (Y-2*i-2 > 0 && X+1 < maxX
      && this.map.collisionLayer.layer.data[Y-2*i+1][X].index === -1
      && this.map.collisionLayer.layer.data[Y-2*i][X].index === -1
      && this.map.collisionLayer.layer.data[Y-2*i-1][X].index === -1
      && this.map.collisionLayer.layer.data[Y-2*i-2][X].index === -1
      && this.map.collisionLayer.layer.data[Y-2*i+1][X+1].index === -1
      && this.map.collisionLayer.layer.data[Y-2*i][X+1].index === -1
      && this.map.collisionLayer.layer.data[Y-2*i-1][X+1].index === -1
      && this.map.collisionLayer.layer.data[Y-2*i-2][X+1].index === -1) {
        if (i === 0) {
          if (this.map.collisionLayer.layer.data[Y-2*i+2][X].index !== -1
          && this.map.collisionLayer.layer.data[Y-2*i+2][X+1].index !== -1) {
            var randy = Math.random();
            if (randy > 0.5) {
              var ladder = this.add.sprite(32,32, 'vine_bottom_left');
              this.addLadderPart(ladder, X, Y, -i);
              alternate = 0;
            } else {
              var ladder = this.add.sprite(32,32, 'vine_bottom_right');
              this.addLadderPart(ladder, X, Y, -i);
              alternate = 1;
            }
          } else {
            break loop;
          }
        } else if (alternate === 0) {
          var ladder = this.add.sprite(32,32, 'vine_middle_right');
          this.addLadderPart(ladder, X, Y, -i);
          alternate = 1;
        } else if (alternate === 1) {
          var ladder = this.add.sprite(32,32, 'vine_middle_left');
          this.addLadderPart(ladder, X, Y, -i);
          alternate = 0;
        }
      } else if (Y-2*i > 0 && X+1 < maxX
        && this.map.collisionLayer.layer.data[Y-2*i+1][X].index === -1
        && this.map.collisionLayer.layer.data[Y-2*i][X].index === -1
        && this.map.collisionLayer.layer.data[Y-2*i+1][X+1].index === -1
        && this.map.collisionLayer.layer.data[Y-2*i][X+1].index === -1) {
          if (i > 0) {
            if (alternate === 0) {
              var ladder = this.add.sprite(32,32, 'vine_top_right');
              this.addLadderPart(ladder, X, Y, -i);
            } else {
              var ladder = this.add.sprite(32,32, 'vine_top_left');
              this.addLadderPart(ladder, X, Y, -i);
            }
          }
          break loop;
      } else {
        break loop;
      }
    }
  },
  ladderSpawn: function ladderSpawn() {
    var X = Math.floor((this.player.sprite.x+29)/16);
    var Y = Math.floor((this.player.sprite.y+29)/16);
    var maxX = this.map.maps[0].layers[0].height*16;
    var maxY = this.map.maps[0].layers[0].width*16;
    loop:
    for (var i = 0; i < 20; i++) {
      if (Y+2*i+3 < maxY && X+1 < maxX
      && this.map.collisionLayer.layer.data[Y+2*i][X].index === -1
      && this.map.collisionLayer.layer.data[Y+2*i+1][X].index === -1
      && this.map.collisionLayer.layer.data[Y+2*i+2][X].index === -1
      && this.map.collisionLayer.layer.data[Y+2*i+3][X].index === -1
      && this.map.collisionLayer.layer.data[Y+2*i][X+1].index === -1
      && this.map.collisionLayer.layer.data[Y+2*i+1][X+1].index === -1
      && this.map.collisionLayer.layer.data[Y+2*i+2][X+1].index === -1
      && this.map.collisionLayer.layer.data[Y+2*i+3][X+1].index === -1) {
        if (i === 0) {
          if (this.player.ladderDirection === 0) {
            var ladder = this.add.sprite(32,32, 'rope_ladder_top_left');
            this.addLadderPart(ladder, X, Y, i);
          } else if (this.player.ladderDirection === 2) {
            var ladder = this.add.sprite(32,32, 'rope_ladder_top_right');
            this.addLadderPart(ladder, X, Y, i);
          } else if (this.player.ladderDirection === 1) {
            var ladder = this.add.sprite(32,32, 'rope_ladder_top');
            this.addLadderPart(ladder, X, Y, i);
          } else {
            break loop;
          }
        } else {
          var ladder = this.add.sprite(32,32, 'rope_ladder_middle');
          this.addLadderPart(ladder, X, Y, i);
        }
      } else if (Y+2*i+1 < maxY && X+1 < maxX
      && this.map.collisionLayer.layer.data[Y+2*i][X].index === -1
      && this.map.collisionLayer.layer.data[Y+2*i+1][X].index === -1
      && this.map.collisionLayer.layer.data[Y+2*i][X+1].index === -1
      && this.map.collisionLayer.layer.data[Y+2*i+1][X+1].index === -1) {
        if (i > 0) {
          var ladder = this.add.sprite(32,32, 'rope_ladder_bottom');
          this.addLadderPart(ladder, X, Y, i);
        }
        break loop;
      } else {
        break loop;
      }
    }
  },
  addLadderPart: function addLadderPart(ladder, X, Y, i) {
    ladder.physicsType = Phaser.SPRITE;
    this.game.physics.arcade.enable(ladder);
    ladder.visible = true;
    ladder.body.allowGravity = false;
    ladder.body.immovable = true;
    //this.body.setSize();
    ladder.x = X*16;
    ladder.y = (Y+2*i)*16;
    this.ladders.add(ladder);
  },
  climbCheck: function climbCheck() {
    var coordsX = Math.floor((this.player.sprite.x+29)/16);
    var coordsY = Math.floor((this.player.sprite.y+29)/16);
    var limitX = this.map.maps[0].layers[0].height-3;
    var limitY = this.map.maps[0].layers[0].width-3;
    //console.log(this.map.collisionLayer.layer.data[0]);
    //console.log('x: '+coordsX+'  y: '+coordsY+'  limitX: '+limitX+'  limitY: '+limitY);
    if (coordsX < limitX && coordsY > 3) {
      this.climbCheckUR(this.map.collisionLayer, coordsX, coordsY);
    }
    if (coordsX > 3 && coordsY > 3) {
      this.climbCheckUL(this.map.collisionLayer, coordsX, coordsY);
    }
    if (coordsX > 3 && coordsY < limitY) {
      this.climbCheckDL(this.map.collisionLayer, coordsX, coordsY);
    }
    if (coordsX < limitX && coordsY < limitY) {
      this.climbCheckDR(this.map.collisionLayer, coordsX, coordsY);
    }
  },
  climbCheckUR: function climbCheckUR(layer, coordsX, coordsY) {
    this.player.climbBoxUR = false;
    loop:
    for (var i = 0; i < 3; i++) {
      for (var j = 0; j < 3; j++) {
        if (layer.layer.data[coordsY+j-2][coordsX+i+1].index !== -1) {
          if (this.checkOverlap(this.player.climbboxUR, layer.layer.data[coordsY+j-2][coordsX+i+1])) {
            this.player.climbBoxUR = true;
            break loop;
          }
        }
      }
    }
    return this.player.climbBoxUR;
  },
  climbCheckUL: function climbCheckUL(layer, coordsX, coordsY) {
    this.player.climbBoxUL = false;
    loop:
    for (var i = 0; i < 3; i++) {
      for (var j = 0; j < 3; j++) {
        if (layer.layer.data[coordsY+j-2][coordsX+i-2].index !== -1) {
          if (this.checkOverlap(this.player.climbboxUL, layer.layer.data[coordsY+j-2][coordsX+i-2])) {
            this.player.climbBoxUL = true;
            break loop;
          }
        }
      }
    }
    return this.player.climbBoxUL;
  },
  climbCheckDL: function climbCheckDL(layer, coordsX, coordsY) {
    this.player.climbBoxDL = false;
    loop:
    for (var i = 0; i < 3; i++) {
      for (var j = 0; j < 3; j++) {
        if (layer.layer.data[coordsY+j+1][coordsX+i-2].index !== -1) {
          if (this.checkOverlap(this.player.climbboxDL, layer.layer.data[coordsY+j+1][coordsX+i-2])) {
            this.player.climbBoxDL = true;
            break loop;
          }
        }
      }
    }
    return this.player.climbBoxDL;
  },
  climbCheckDR: function climbCheckDR(layer, coordsX, coordsY) {
    this.player.climbBoxDR = false;
    loop:
    for (var i = 0; i < 3; i++) {
      for (var j = 0; j < 3; j++) {
        if (layer.layer.data[coordsY+j+1][coordsX+i+1].index !== -1) {
          if (this.checkOverlap(this.player.climbboxDR, layer.layer.data[coordsY+j+1][coordsX+i+1])) {
            this.player.climbBoxDR = true;
            break loop;
          }
        }
      }
    }
    return this.player.climbBoxDR;
  },
  checkOverlap: function checkOverlap(sprite, tile) {
    var boundsA = new Phaser.Rectangle(sprite.x, sprite.y, sprite.width, sprite.height);
    var boundsB = new Phaser.Rectangle(tile.x*16, tile.y*16, tile.width, tile.height);
    //console.log('boundsA:'+boundsA+'  boundsB:'+boundsB);
    return Phaser.Rectangle.intersects(boundsA, boundsB);
  },
  enemyCollisionHandler: function enemyCollisionHandler(playerSprite, monster) {
    if (this.player.moveMode > 0) {
      this.player.switchToNormal();
    } else if (!this.player.invul && !this.player.dieing) {
      if (!this.player.vuln) {
        this.player.vuln = true;
        this.player.invul = true;
        console.log('OUCH!');
        //console.log(this.time.events);
        this.player.invulTimer = this.game.time.events.add(this.invulTime, function(){this.player.invul = false;}, this);
        this.player.vulnTimer = this.game.time.events.add(this.vulnTime, function(){this.player.vuln = false;}, this);
        //console.log(this.time.events);
        this.player.sprite.body.velocity.x = Math.random()*1200-600;
        this.player.sprite.body.velocity.y = -Math.random()*600;
      } else {
        this.player.dieing = true;
        this.player.sprite.body.velocity.x = 0;
        this.player.sprite.body.velocity.y = 0;
        this.game.time.events.add(3000, this.respawnPlayer, this);
        var death = this.player.sprite.animations.play('death');
        this.player.status = 6;
        death.onComplete.add(function(){
          console.log('Respawned');
          playerSprite.animations.frame = 26;
        });
        //console.log('Respawned');
      }
    }
  },
  respawnPlayer: function respawnPlayer() {
        var X = this.map.maps[0].layers[0].height*16;
        var Y = this.map.maps[0].layers[0].width*16;
        var PosX = Math.floor(Math.random()*(X-32));
        var PosY = Math.floor(Math.random()*(Y-32));
        //console.log('Respawn '+PosX+' '+PosY);
        this.player.sprite.x = PosX;
        this.player.sprite.x = PosX;
        this.player.dieing = false;
        this.player.sprite.animations.stop();
        this.player.sprite.animations.frame = 0;
  },
  enemySlashingHandler: function enemySlashingHandler(playerHitbox, monster) {
    playerHitbox.animations.play('explode');
    //  playerHitbox.kill();
    if (this.player.slashing) {
      if (monster.hitpoints > 7) {
        monster.spawned = false;
        console.log(monster);
        monster.hitpoints = monster.hitpoints - 7;
        if (this.player.Facing === 1 || this.player.Facing === 2 || this.player.Facing === 8) {
          monster.body.velocity.x = 200;//Math.random()*1200-600;
        } else if (this.player.Facing === 4 || this.player.Facing === 5 || this.player.Facing === 6) {
          monster.body.velocity.x = -200;
        }
        monster.body.velocity.y = -200;//-Math.random()*600;
        this.client.monsterSlashed(monster);
      /*  monster.runleft.pause();
        this.game.time.events.remove(monster.stunTimer);
        monster.stunTimer = this.game.time.events.add(this.monsterStun,function(){this.monsterReset(monster)},this); */
      } else {
        monster.destroy();
        this.client.monsterKilled(monster);
      }
      this.player.slashing = false;
    }
  },
  itemCollisionHandler: function itemCollisionHandler(playerSprite, item) {
    item.destroy();
    this.player.sprite.y = this.player.sprite.y - 20;
    this.player.switchToTron();
  },
  enemyHandler: function enemyHandler(monster,map) {
    //      console.log('updating position');
    if(!monster.spawned){
      //console.log(monster);
      monster.spawned = true;
      this.client.updateMonsters(monster);
    }
  },
  graceReset: function graceReset() {
    this.player.vuln = true;
  },
  monsterReset: function monsterReset(monster) {
    monster.runleft = this.game.add.tween(monster);
    this.rng01 = Math.random();
    this.rng02 = Math.random();
    monster.runleft
      .to({x:monster.x + this.rng01*450+20}, this.rng02*2000+500)
      .to({x:monster.x }, this.rng02*2000+500)
      .loop()
      .start();
    //this.client.updateMonsters(monster);
  }
};

module.exports = Game;
