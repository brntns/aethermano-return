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
  this.activeChat = false;
  this.items = null;
  this.monsterGroup = null;
  this.monsters = [];
  this.talkGroup = null;
  this.talks = [];
  this.incomingChat = [];
  this.chatGroup = null;
  this.survivorGroup = null;
  this.survivors = [];
  this.monsterStun = 1000;
  this.playerStun = 200;
  this.invulTime = 750;
  this.vulnTime = 1850;
  this.monsterTimer = true;
  this.ladders = null;
  this.overlay = null;
  this.fireballTrigger = false;
}

Game.prototype = {
  create: function create() {
    // enable frames manipulation & tracking
    this.game.time.advancedTiming = true;
    // enable physics
    //this.game.plugins.add(Phaser.Plugin.PixelScaler,2)
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

    if(!this.player.dieing){
      if(this.chatGroup !== null){
        this.chatGroup.visible = false;
      }
      if(this.player.text !== null){
            this.player.text.visible = false;
      }
      this.incomingChat = [];
    }
    if(this.player.sendchat.isDown && !this.activeChat && this.player.dieing){
      this.activeChat = true;
          if(this.player.text !== null){
        this.player.text.visible = true;
      }
          if(this.chatGroup !== null){
        this.chatGroup.visible = true;
      }
      var txt =  this.player.chat.join('');
      var chat = {
        id: this.player.id,
        msg: txt
      };
      this.client.updateChat(chat);
      this.game.time.events.add(1000, function(){this.activeChat = false;},this);
      this.player.chat = [];
      this.player.text.destroy();
    }
    if (this.player.vuln && !this.player.dieing) {
      this.player.sprite.tint = 0xFAA1A1;
    } else {
      this.player.sprite.tint = 0xffffff;
    }
    if (this.player.invul && !this.player.dieing){
      this.player.sprite.alpha = 0.5;
      this.player.sprite.tint = 0xffffff;
    } else {
      this.player.sprite.alpha = 1;
    }
    if(this.player.letterM.isDown && this.monsterTimer){
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

      for (var i = 0; i < this.monsterGroup.children.length; i++) {

        var distanceToPlayer = this.game.physics.arcade.distanceBetween(this.monsterGroup.children[i], this.player.sprite);
        this.monsterAggro(distanceToPlayer,this.monsterGroup.children[i]);
        if (this.player.playerClass === 7 && this.player.bullet !== undefined && this.player.bullet !== null) {
          var distanceToBullet = this.game.physics.arcade.distanceBetween(this.monsterGroup.children[i], this.player.bullet);
          this.skullAggro(distanceToBullet,this.monsterGroup.children[i], this.player.bullet);
        }
      };
      // this.map.bg.tilePosition.y += 1;
      // console.log(this.monsterGroup);
      // make player collide
      this.game.physics.arcade.collide(this.player.sprite,this.map.collisionLayer);
      this.game.physics.arcade.collide(this.player.sprite,this.items.item, this.itemCollisionHandler, null, this);
      this.game.physics.arcade.collide(this.monsterGroup,this.map.collisionLayer, this.enemyHandler,null,this);
      this.game.physics.arcade.overlap(this.player.sprite,this.monsterGroup, this.enemyCollisionHandler, null, this);
      this.game.physics.arcade.overlap(this.player.hitbox1,this.monsterGroup, this.enemySlashingHandler, null, this);
      this.game.physics.arcade.overlap(this.player.hitbox2,this.monsterGroup, this.enemySlashingHandler, null, this);
      this.game.physics.arcade.overlap(this.player.bullets,this.monsterGroup, this.enemyBulletHandler, null, this);
      this.game.physics.arcade.overlap(this.player.bullets,this.map.collisionLayer, this.wallHit, null, this);
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

      if(this.player.text !== null){
        this.player.text.bringToTop();
      }
      if(this.chatGroup !== null){
        this.chatGroup.bringToTop();
      }
      // Update the player
      this.player.update();
      //update nearby Monsters
      if (this.player.spawningLadder) {
        this.player.spawningLadder = false;
        if (this.player.playerClass === 0) {
          this.ladderSpawn(this.player.sprite.x,this.player.sprite.y,this.player.ladderDirection);
        }
        if (this.player.playerClass === 4) {
          var randy = Math.floor(Math.random()+0.5);
          this.vineSpawn(this.player.sprite.x,this.player.sprite.y,randy);
        }
      }
      if (this.player.detonate) {
        this.detonateFireball(this.player.bullet);
      }
      if (this.player.teleporting !== 0) {
        this.teleportPlayer();
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
  globalChat: function globalChat(e){
    if(this.chatGroup !== null){
      this.chatGroup.destroy();
    }
    var build = [];
    for (var i = 0; i < this.incomingChat.length; i++) {
      var text = this.incomingChat[i].msg;
      build.push(text);
    }
    var msg = build.join('\n');
    var send = msg.toLowerCase();
    var style = { font: "22px PixelFraktur", fill: "#000000", align: "left",strokeThickness:4,stroke:"#FFFFFF" };
    this.chatGroup = this.game.add.text(150,370,send, style);
    this.chatGroup.anchor.x = 0;
    this.chatGroup.anchor.y = 1;
    this.chatGroup.fixedToCamera = true;
    this.chatGroup.bringToTop();
  },
  monsterAggro: function monsterAggro(range,monster){
    if(range < 200 && !monster.aggro){
      console.log('aggroing');
      monster.aggro = true;
      this.chasePlayer(monster);
      this.client.updateMonsters(monster);
    }else{
      monster.aggro = false;
    }
  },
  chasePlayer: function chasePlayer(monster){
    this.physics.arcade.moveToObject(monster, this.player.sprite, 60, null);
  },
  skullAggro: function skullAggro (range, monster, bullet) {
    if(range < 500 && !bullet.aggro){
      console.log('skull aggroing');
      bullet.aggro = true;
      this.physics.arcade.moveToObject(bullet, monster, 100, null);
      if (bullet.body.velocity.x > 0) {
        bullet.animations.play('fly_right');
      } else {
        bullet.animations.play('fly_left');
      }
    } else {
        bullet.aggro = false;
    }
  },
  vineSpawn: function vineSpawn(x, y, n) {
    var X = Math.floor((x+29)/16);
    var Y = Math.floor((y+29)/16);
    var maxX = this.map.maps[0].layers[0].height*16;
    var maxY = this.map.maps[0].layers[0].width*16;
    var alternate = 0;
    loop:
    for (var i = 0; i < 20; i++) {
      if (Y+2*i+3 < maxY && X+1 < maxX && this.ladderTileCheck(X,Y-2*i) && this.ladderTileCheck(X,Y-2*i-2)) {
        if (i === 0) {
          if (this.map.collisionLayer.layer.data[Y-2*i+2][X].index !== -1
          && this.map.collisionLayer.layer.data[Y-2*i+2][X+1].index !== -1) {
            if (n === 0) {
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
      } else if (Y+2*i+1 < maxY && X+1 < maxX && this.ladderTileCheck(X,Y-2*i)) {
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
  ladderTileCheck: function ladderTileCheck(X, Y) {
    var theMap = this.map.collisionLayer.layer.data;
    var value = true;
    loop:
    for (k = 0; k < 2; k++) {
      for (l = 0; l < 2; l++) {
        if (theMap[Y+k][X+l].index !== -1 && (theMap[Y+k][X+l].index < 68 || theMap[Y+k][X+l].index > 119)) {
          value = false;
          break loop;
        }
      }
    }
    return value;
  },
  ladderSpawn: function ladderSpawn(x, y, n) {
    var X = Math.floor((x+29)/16);
    var Y = Math.floor((y+29)/16);
    var maxX = this.map.maps[0].layers[0].height*16;
    var maxY = this.map.maps[0].layers[0].width*16;
    console.log(this.map.collisionLayer.layer.data);
    loop:
    for (var i = 0; i < 15; i++) {
      var theMap = this.map.collisionLayer.layer.data;
      if (Y+2*i+2 < maxY && X+1 < maxX && this.ladderTileCheck(X,Y+2*i) && this.ladderTileCheck(X,Y+2*i+2)) {
        if (i === 0) {
          if (n === 0) {
            var ladder = this.add.sprite(32,32, 'rope_ladder_top_left');
            this.addLadderPart(ladder, X, Y, i);
          } else if (n === 2) {
            var ladder = this.add.sprite(32,32, 'rope_ladder_top_right');
            this.addLadderPart(ladder, X, Y, i);
          } else if (n === 1) {
            var ladder = this.add.sprite(32,32, 'rope_ladder_top');
            this.addLadderPart(ladder, X, Y, i);
          } else {
            break loop;
          }
        } else {
          var ladder = this.add.sprite(32,32, 'rope_ladder_middle');
          this.addLadderPart(ladder, X, Y, i);
        }
      } else if (Y+2*i+1 < maxY && X+1 < maxX && this.ladderTileCheck(X,Y+2*i)) {
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
        var mapIndex = layer.layer.data[coordsY+j-2][coordsX+i+1].index;
        if (mapIndex !== -1 && (mapIndex < 69 || mapIndex > 119)) {
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
        var mapIndex = layer.layer.data[coordsY+j-2][coordsX+i-2].index;
        if (mapIndex !== -1 && (mapIndex < 69 || mapIndex > 119)) {
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
        var mapIndex = layer.layer.data[coordsY+j+1][coordsX+i-2].index;
        if (mapIndex !== -1 && (mapIndex < 69 || mapIndex > 119)) {
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
        var mapIndex = layer.layer.data[coordsY+j+1][coordsX+i+1].index;
        if (mapIndex !== -1 && (mapIndex < 69 || mapIndex > 119)) {
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
        this.player.status = 8;
        console.log('OUCH!');
        //console.log(this.time.events);
        this.player.invulTimer = this.game.time.events.add(this.invulTime, function(){this.player.invul = false; this.player.status = 12;}, this);
        this.player.vulnTimer = this.game.time.events.add(this.vulnTime, function(){this.player.vuln = false; this.player.status = 11;}, this);
        //console.log(this.time.events);
        this.player.sprite.body.velocity.x = Math.random()*1200-600;
        this.player.sprite.body.velocity.y = -Math.random()*600;
      } else {
        this.player.dieing = true;
        this.player.sprite.body.velocity.x = 0;
        this.player.sprite.body.velocity.y = 0;
        //this.game.time.events.add(3000, this.respawnPlayer, this);
        var death = this.player.sprite.animations.play('death');
        this.player.status = 6;
        this.afterLife();
        death.onComplete.add(function(){
          console.log('Respawned');
          playerSprite.animations.frame = 26;
        });

        //console.log('Respawned');
      }
    }
  },
  afterLife: function afterLife(){
    this.overlay = this.game.add.tileSprite(0, 0, 1280,720,'overlay');
    this.overlay.inputEnabled = true;
    this.overlay.events.onInputDown.add(this.respawnPlayer, this);
    this.overlay.fixedToCamera = true;
    this.overlay.alpha = 0.5;
  },
  respawnPlayer: function respawnPlayer(data) {
    this.overlay.destroy();
    this.game.stage.backgroundColor =  '#79BFE2';
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
          this.slashMonster(monster, 20, 0, 0);
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
        this.slashMonster(monster, 4, 0, 0);
        this.game.time.events.add(50, function(){this.player.slashing = true;},this);
      break;
      case 7: //Witchdoc
        this.slashMonster(monster, 10, 0, 0);
        playerHitbox.kill();
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
      //this.client.updateMonsters(monster);
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
  },
  teleportPlayer: function teleportPlayer() {
    var X = 0;
    var Y = 0;
    switch (this.player.teleporting) {
      case 1:
        Y = this.player.sprite.body.y;
        X = this.player.sprite.body.x + this.player.teleportRangeX;
      break;
      case 2:
        Y = this.player.sprite.body.y - Math.floor(this.player.teleportRangeY/1.5);
        X = this.player.sprite.body.x + Math.floor(this.player.teleportRangeX/1.5);
      break;
      case 3:
        Y = this.player.sprite.body.y - Math.floor(this.player.teleportRangeY);
        X = this.player.sprite.body.x;
      break;
      case 4:
        Y = this.player.sprite.body.y - Math.floor(this.player.teleportRangeY/1.5);
        X = this.player.sprite.body.x - Math.floor(this.player.teleportRangeX/1.5);
      break;
      case 5:
        Y = this.player.sprite.body.y;
        X = this.player.sprite.body.x - Math.floor(this.player.teleportRangeX);
      break;
      case 6:
        Y = this.player.sprite.body.y + Math.floor(this.player.teleportRangeY/1.5);
        X = this.player.sprite.body.x - Math.floor(this.player.teleportRangeX/1.5);
      break;
      case 7:
        Y = this.player.sprite.body.y + Math.floor(this.player.teleportRangeY);
        X = this.player.sprite.body.x;
      break;
      case 8:
        Y = this.player.sprite.body.y + Math.floor(this.player.teleportRangeY/1.5);
        X = this.player.sprite.body.x + Math.floor(this.player.teleportRangeX/1.5);
      break;
      default:
        Y = this.player.sprite.body.y;
        X = this.player.sprite.body.x;
      break;
    }
    this.player.teleporting = 0;
    var tileX = Math.floor(X/16);
    var tileY = Math.floor(Y/16);
    var maxX = this.map.maps[0].layers[0].height*16;
    var maxY = this.map.maps[0].layers[0].width*16;
    console.log(tileX+' '+tileY+' '+X+' '+Y+' '+maxX+' '+maxY);
    loop:
    for (var i = 0; i < 5; i++) {
      for (var j = 0; j < 5; j++) {
        console.log('Working on Teleport...');
        if (Y - 16*i + 29 < maxY && X + 16*j + 29 < maxX && Y > 0 && X > 0 && this.ladderTileCheck(tileX+j, tileY-i)) {
          Y -= 16*i;
          X += 16*j;
          this.player.sprite.body.x = X;
          this.player.sprite.body.y = Y;
          console.log('Teleported!')
          break loop;
        }
      }
    }
    this.player.sprite.animations.stop();
    var Player = this.player;
    var TeleportArrival = this.player.sprite.animations.play('teleport_arrival');
    TeleportArrival.onComplete.add(function(){Player.switchToNormal();console.log('Switched to Normal');})
  }
};

module.exports = Game;
