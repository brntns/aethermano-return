var Items = require('./items/items');
var Player = require('./player/player');
var Map = require('./map/map');
var Client = require('./client/client');
var vines =  require('./handlers/vines');
var climbchecks =  require('./handlers/climb');
var teleport =  require('./handlers/teleport');
var attackhandler =  require('./handlers/attackhandler');
var playerchecks =  require('./handlers/playerchecks');


function Game() {
  this.client = null;
  this.player = null;
  this.map = null;
  this.worldMap = [];
  this.menuOpen = true;
  this.enemy = null;
  this.activeChat = false;
  this.items = null;
  this.monsterGroup = null;
  this.monsters = [];
  this.compassGroup = null;
  this.menuGroup = null;
  this.compasses = [];
  this.incomingChat = [];
  this.chatGroup = null;
  this.survivorGroup = null;
  this.survivors = [];
  this.monsterStun = 1000;
  this.playerStun = 200;
  this.invulTime = 750;
  this.vulnTime = 1850;
  this.ladders = null;
  this.overlay = null;
  this.fireballTrigger = false;
  this.lights = null;
  this.locationGroup = null;
  this.lightradius = 175;
}

var gameBase = {
  create: function create() {
  	this.game.stage.backgroundColor = '#333333';
    // enable frames manipulation & tracking
    this.game.time.advancedTiming = true;
    // enable physics
    this.game.physics.startSystem(Phaser.Physics.ARCADE);
    this.game.physics.arcade.OVERLAP_BIAS = 1;
    this.monsterGroup = this.game.add.group();
    // this.boundsGroup = this.game.add.group();
    this.menuGroup = this.game.add.group();
    this.survivorGroup = this.game.add.group();
    this.compassGroup = this.game.add.group();
    this.ladders = this.game.add.group();
    this.lights = this.game.add.group();
    this.locationGroup = this.game.add.group();
    // creating game components
    this.player = new Player(this.game, this.map);
    this.map = new Map(this.game,this.player, this);
    this.items = new Items(this.game,this);
    this.client = new Client(this);
    this.client.create();

    this.shadowTexture = this.game.add.bitmapData(this.game.width, this.game.height);
    this.lightSprite = this.game.add.image(this.game.camera.x, this.game.camera.y, this.shadowTexture);
    this.lightSprite.blendMode = Phaser.blendModes.MULTIPLY;
    // Create the lights
    this.lightSprite.fixedToCamera = true;
    this.lights.add(this.player.sprite);
  },
  update: function update() {
    // Menu
    if(this.menuOpen){
      this.client.menu.update(this.player.cursors);
    } else {
      this.menuGroup.destroy();
    }
    // Deathchat hiding and aggro
    if (!this.player.dieing) {
      if (this.chatGroup !== null) {
        this.chatGroup.visible = false;
      }
      if (this.player.text !== null) {
        this.player.text.visible = false;
      }
      this.incomingChat = [];
    }
    // Deathchat
    if (this.player.sendchat.isDown && !this.activeChat && this.player.dieing) {
      this.activeChat = true;
      if (this.player.text !== null) {
        this.player.text.visible = true;
      }
      if (this.chatGroup !== null) {
        this.chatGroup.visible = true;
      }
      var txt =  this.player.chat.join('');
      var chat = {
        id: this.player.id,
        msg: txt
      };
      this.client.updateChat(chat);
      this.game.time.events.add(1000, function(){this.activeChat = false;}, this);
      this.player.chat = [];
      this.player.text.destroy();
    }
    // Vul animation
    if (this.player.vuln && !this.player.dieing) {
      this.player.sprite.tint = 0xFAA1A1;
    } else {
      this.player.sprite.tint = 0xffffff;
    }
    // Invul animation
    if (this.player.invul && !this.player.dieing) {
      this.player.sprite.alpha = 0.5;
      this.player.sprite.tint = 0xffffff;
    } else {
      this.player.sprite.alpha = 1;
    }
    // Collision
    if (this.player !== null && this.map.collisionLayer !== null ) {
      this.updateShadowTexture();
      this.lightSprite.bringToTop();
      //console.log(this.player.status);
      // make player collide
      this.game.physics.arcade.collide(this.player.sprite, this.map.collisionLayer);
      //this.game.physics.arcade.collide(this.player.sprite,this.boundsGroup);
      this.game.physics.arcade.collide(this.player.sprite, this.items.item, this.itemCollisionHandler, null, this);
      this.game.physics.arcade.collide(this.monsterGroup, this.map.collisionLayer, this.enemyHandler, null, this);
      //this.game.physics.arcade.overlap(this.player.sprite,this.monsterGroup, this.enemyCollisionHandler, null, this);
      this.game.physics.arcade.overlap(this.player.hitbox1, this.monsterGroup, this.enemySlashingHandler, null, this);
      this.game.physics.arcade.overlap(this.player.hitbox2, this.monsterGroup, this.enemySlashingHandler, null, this);
      this.game.physics.arcade.overlap(this.player.bullets, this.monsterGroup, this.enemyBulletHandler, null, this);
      this.game.physics.arcade.overlap(this.player.bullets, this.map.collisionLayer, this.wallHit, null, this);
      this.game.physics.arcade.overlap(this.player.sprite, this.locationGroup, this.changeLevel, null, this);
      if (this.game.physics.arcade.overlap(this.player.sprite, this.ladders)) {
        this.player.onLadder = true;
      } else {
        this.player.onLadder = false;
      }
      this.climbCheck();
      if (this.compasses.length > 0) {
        for (var i = 0; i < this.compasses.length; i++) {
          this.compasses[i].sprite.bringToTop();
        }
      }
      if (this.locationGroup.length > 0) {
        for (var i = 0; i < this.locationGroup.length; i++) {
          this.locationGroup.children[i].bringToTop();
        }
      }
      this.player.sprite.bringToTop();
      // this.player.climbboxUR.bringToTop();
      // this.player.climbboxUL.bringToTop();
      // this.player.climbboxDL.bringToTop();
      // this.player.climbboxDR.bringToTop();
      if (this.player.text !== null) {
        this.player.text.bringToTop();
      }
      if (this.chatGroup !== null) {
        this.chatGroup.bringToTop();
      }
      // Update the player
      this.player.update();
      //update nearby Monsters
      if (this.player.spawningLadder) {
        this.player.spawningLadder = false;
        if (this.player.playerClass === 0) {
          this.ladderSpawn(this.player.sprite.x,this.player.sprite.y,this.player.ladderDirection);
          this.client.spawnLadder(this.player.sprite.x,this.player.sprite.y,this.player.ladderDirection);
        }
        if (this.player.playerClass === 4) {
          var randy = Math.floor(Math.random()+0.5);
          this.vineSpawn(this.player.sprite.x,this.player.sprite.y,randy);
          this.client.spawnVine(this.player.sprite.x,this.player.sprite.y,this.player.ladderDirection);
        }
      }
      if (this.player.detonate) {
        this.detonateFireball(this.player.bullet);
      }
      if (this.player.teleporting !== 0) {
        this.teleportPlayer();
      }
    }
    if (this.client !== null && this.player !== null) {
      // Check aggro INFO: needs relocation
      for (var i = 0; i < this.monsterGroup.children.length; i++) {
        var distanceToPlayer = this.game.physics.arcade.distanceBetween(this.monsterGroup.children[i], this.player.sprite);
        this.monsterAggro(distanceToPlayer,this.monsterGroup.children[i]);
        if (this.player.playerClass === 7 && this.player.bullet !== undefined && this.player.bullet !== null) {
          var distanceToBullet = this.game.physics.arcade.distanceBetween(this.monsterGroup.children[i], this.player.bullet);
          this.skullAggro(distanceToBullet,this.monsterGroup.children[i], this.player.bullet);
        }
        if (this.monsterGroup.children[i].laser !== undefined) {
          this.game.physics.arcade.overlap(this.player.sprite,this.monsterGroup.children[i].laser, this.enemyCollisionHandler, null, this);
        }
      };

      var bits = {
				x: this.player.sprite.x,
				y: this.player.sprite.y,
        status: this.player.status,
        level: this.player.level
			};
      this.client.update(bits);
    }
  },
  startExplorer: function startExplorer() {
    this.menuOpen = false;
    this.player.setPlayerClass(0);
    this.client.loadMonsters(this.worldMap[0].monsters,this);
    this.map.create(this.worldMap[0].map);
  },
  startConjurer: function startConjurer() {
    this.menuOpen = false;
    this.player.setPlayerClass(9);
    this.client.loadMonsters(this.worldMap[0].monsters,this);
    this.map.create(this.worldMap[0].map);
  },
  startKnight: function startKnight() {
    this.menuOpen = false;
    this.player.setPlayerClass(8);
    this.client.loadMonsters(this.worldMap[0].monsters,this);
    this.map.create(this.worldMap[0].map);
  },
  changeLevel: function changeLevel(playerSprite, location) {
    if (this.player.cursors.up.isDown) {
      this.map.update(this.world[location.i].map);
      this.items.create(this.world[location.i].locations);
    }
  },
  globalChat: function globalChat(e) {
    if (this.chatGroup !== null) {
      this.chatGroup.destroy();
    }
    var build = [];
    for (var i = 0; i < this.incomingChat.length; i++) {
      var text = this.incomingChat[i].msg;
      build.push(text);
    }
    var msg = build.join('\n');
    var send = msg.toLowerCase();
    var style = { font: "22px PixelFraktur", fill: "#000000", align: "left", strokeThickness:4, stroke: "#FFFFFF" };
    this.chatGroup = this.game.add.text(150,370,send, style);
    this.chatGroup.anchor.x = 0;
    this.chatGroup.anchor.y = 1;
    this.chatGroup.fixedToCamera = true;
    this.chatGroup.bringToTop();
  },
  monsterAggro: function monsterAggro(range,monster) {
    if (range < 200 && !monster.aggro) {
      monster.aggro = true;
      monster.aggrotarget = true;
      this.chasePlayer(range, monster);
      this.client.updateMonsters(monster);
      monster.idle = false;
    } else if (range < 200 && monster.aggrotarget){
      this.chasePlayer(range, monster);
      this.client.updateMonsters(monster);
      monster.idle = false;
    } else {
      monster.aggro = false;
      monster.aggrotarget = false;
      this.monsterIdle(monster);
    }
  },
  monsterIdle: function monsterIdle(monster) {
    if (!monster.charging && !monster.idle) {
      console.log('idling');
      var randy = Math.random();
      if (randy > 0.5) {
        monster.body.velocity.x = 0;
        monster.body.velocity.y = 0;
        monster.animations.play('left');
      } else {
        monster.body.velocity.x = 0;
        monster.body.velocity.y = 0;
        monster.animations.play('right');
      }
      monster.idle = true;
    }
  },
  chasePlayer: function chasePlayer(range, monster) {
    var horiDist = this.player.sprite.x - monster.x;
    var vertDist = this.player.sprite.y - monster.y;
    var slope = horiDist/vertDist;
    if (!monster.charging) {
      if (horiDist < 100 && horiDist >= 0) {
        monster.body.velocity.x = -50;
        monster.body.velocity.y = 0;
        monster.animations.play('left');
      } else if (horiDist > -100 && horiDist < 0) {
        monster.body.velocity.x = 50;
        monster.body.velocity.y = 0;
        monster.animations.play('right');
      } else if (slope >= 0 && slope < 3) {
        monster.body.velocity.x = 0;
        monster.body.velocity.y = 50;
        monster.animations.play('right');
      } else if (slope > 5) {
        monster.animations.play('right');
        monster.body.velocity.x = 0;
        monster.body.velocity.y = -50;
      } else if (slope < 0 && slope > -3) {
        monster.body.velocity.x = 0;
        monster.body.velocity.y = 50;
        monster.animations.play('left');
      } else if (slope < -5) {
        monster.animations.play('left');
        monster.body.velocity.x = 0;
        monster.body.velocity.y = -50;
      } else if (slope > 0) {
        monster.body.velocity.x = 0;
        monster.body.velocity.y = 0;
        monster.charging = true;
        this.game.time.events.add(2000,function(){
          monster.charging = false;
          this.beholderLaser(monster, 0);
        },this);
        this.game.time.events.add(1000,function(){
          monster.animations.play('firing_right');
          this.beholderLaser(monster, 1);
        },this);
        monster.animations.stop();
        monster.animations.play('chargeUp_right');
      } else if (slope < 0) {
        monster.body.velocity.x = 0;
        monster.body.velocity.y = 0;
        monster.charging = true;
        this.game.time.events.add(2000,function(){
          monster.charging = false;
          this.beholderLaser(monster, 0);
        },this);
        this.game.time.events.add(1000,function(){
          monster.animations.play('firing_left');
          this.beholderLaser(monster, 2);
        },this);
        monster.animations.stop();
        monster.animations.play('chargeUp_left');
      } else {
        monster.body.velocity.x = 0;
        monster.body.velocity.y = 0;
      }
    }
  },
  beholderLaser: function beholderLaser(monster, N) {
    if (N === 0) {
      if (monster.laser.children !== null && monster.laser.children !== undefined) {
        for (var i = 0; i < monster.laser.children.length; i++) {
          monster.laser.children[i].kill();
        }
      }
    } else if (N === 1) {
      this.laserSpawnRight(monster);
    } else if (N === 2) {
      this.laserSpawnLeft(monster);
    }
  },
  laserSpawnRight: function laserSpawnRight(monster) {
    var X = monster.x + monster.width;
    var Y = monster.y + 36;
    var maxX = this.map.maps[0].layers[0].height*16;
    var maxY = this.map.maps[0].layers[0].width*16;
    var laserMaxlength = 15;
    var theMap = this.map.collisionLayer.layer.data;
    loop:
    for (var i = 0; i < laserMaxlength; i++) {
      if (Y+8*i < maxY
      && X+32*i+32 < maxX
      && this.tileCheck(X+32*i+32,Y+16*i)
      && this.tileCheck(X+32*i,Y+8*i)
      && i < laserMaxlength-1) {
          var laserPart = this.add.sprite(32,32, 'beholder_laser', 0);
          this.addLaserPart(monster, laserPart, X+32*i, Y+8*i, 0);
      } else if ((Y+8*i < maxY && X+32*i < maxX && this.tileCheck(X+32*i,Y+8*i))
      || i === laserMaxlength-1) {
        if (i > 0) {
          var laserPart = this.add.sprite(32,32, 'beholder_laser', 0);
          this.addLaserEnd(monster, laserPart, X+32*i, Y+8*i, 0);
        }
        break loop;
      } else {
        break loop;
      }
    }
  },
  laserSpawnLeft: function laserSpawnLeft(monster) {
    var X = monster.x - 32;
    var Y = monster.y + 36;
    var maxX = this.map.maps[0].layers[0].height*16;
    var maxY = this.map.maps[0].layers[0].width*16;
    var laserMaxlength = 15;
    var theMap = this.map.collisionLayer.layer.data;
    loop:
    for (var i = 0; i < laserMaxlength; i++) {
      if (Y+8*i < maxY
      && X+32*i+32 < maxX
      && this.tileCheck(X-32*i-32,Y+16*i)
      && this.tileCheck(X-32*i,Y+8*i)
      && i < laserMaxlength-1) {
          var laserPart = this.add.sprite(32,32, 'beholder_laser', 0);
          this.addLaserPart(monster, laserPart, X-32*i, Y+8*i, 1);
      } else if ((Y+8*i < maxY && X+32*i < maxX && this.tileCheck(X-32*i-32,Y+8*i))
      || i === laserMaxlength-1) {
        if (i > 0) {
          var laserPart = this.add.sprite(32,32, 'beholder_laser', 0);
          this.addLaserEnd(monster, laserPart, X-32*i, Y+8*i, 1);
        }
        break loop;
      } else {
        break loop;
      }
    }
  },
  addLaserPart: function addLaserPart(monster, laserPart, X, Y, N) {
    laserPart.physicsType = Phaser.SPRITE;
    this.game.physics.arcade.enable(laserPart);
    laserPart.visible = true;
    laserPart.body.allowGravity = false;
    laserPart.body.immovable = true;
    laserPart.body.setSize(32,2,0,7);
    laserPart.x = X;
    laserPart.y = Y;
    if (N === 0) {
      laserPart.animations.add('flashy',[0,1],8,true);
      laserPart.animations.play('flashy');
    } else {
      laserPart.animations.add('flashy',[2,3],8,true);
      laserPart.animations.play('flashy');
    }
    monster.laser.add(laserPart);
  },
  addLaserEnd: function addLaserEnd(monster, laserPart, X, Y, N) {
    laserPart.physicsType = Phaser.SPRITE;
    this.game.physics.arcade.enable(laserPart);
    laserPart.visible = true;
    laserPart.body.allowGravity = false;
    laserPart.body.immovable = true;
    laserPart.body.setSize(32,2,0,7);
    laserPart.x = X;
    laserPart.y = Y;
    if (N === 0) {
      laserPart.animations.add('flashy',[4,5],8,true);
      laserPart.animations.play('flashy');
    } else {
      laserPart.animations.add('flashy',[6,7],8,true);
      laserPart.animations.play('flashy');
    }
    monster.laser.add(laserPart);
  },
  tileCheck: function tileCheck(x, y, width, height) {
    var X = Math.floor(x/16);
    var Y = Math.floor(y/16);
    var theMap = this.map.collisionLayer.layer.data;
    var value = true;
    loop:
    for (k = 0; k < width; k++) {
      for (l = 0; l < height; l++) {
        if (theMap[Y+k][X+l].index !== -1 && (theMap[Y+k][X+l].index < 68 || theMap[Y+k][X+l].index > 119)) {
          value = false;
          break loop;
        }
      }
    }
    return value;
  },
  skullAggro: function skullAggro (range, monster, bullet) {
    if(range < 500 && !bullet.aggro){
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
  enemyCollisionHandler: function enemyCollisionHandler(playerSprite, monster) {
    if (this.player.moveMode > 0) {
      this.player.switchToNormal();
    } else if (!this.player.invul && !this.player.dieing) {
      if (!this.player.vuln) {
        this.player.vuln = true;
        this.player.invul = true;
        this.player.status = 8;
        this.player.invulTimer = this.game.time.events.add(this.invulTime, function(){this.player.invul = false; this.player.status = 12;}, this);
        this.player.vulnTimer = this.game.time.events.add(this.vulnTime, function(){this.player.vuln = false; this.player.status = 11;}, this);
        //this.player.sprite.body.velocity.x = Math.random()*1200-600;
        //this.player.sprite.body.velocity.y = -Math.random()*600;
      } else {
        this.player.dieing = true;
        this.player.sprite.body.velocity.x = 0;
        this.player.sprite.body.velocity.y = 0;
        this.player.sprite.body.acceleration.x = 0;
        this.player.sprite.body.acceleration.y = 0;
        //this.game.time.events.add(3000, this.respawnPlayer, this);
        var death = this.player.sprite.animations.play('death');
        this.player.status = 6;
        this.afterLife();
        death.onComplete.add(function(){
          console.log('Respawned');
          playerSprite.animations.frame = 26;
        });
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
    //this.game.stage.backgroundColor =  '#79BFE2';
    var X = this.map.maps[0].layers[0].height*16;
    var Y = this.map.maps[0].layers[0].width*16;
    var PosX = Math.floor(Math.random()*(X-32));
    var PosY = Math.floor(Math.random()*(Y-32));
    this.player.sprite.x = PosX;
    this.player.sprite.x = PosX;
    this.player.dieing = false;
    this.player.sprite.animations.stop();
    this.player.sprite.animations.frame = 0;
  },
  itemCollisionHandler: function itemCollisionHandler(playerSprite, item) {
    item.destroy();
    this.player.sprite.y = this.player.sprite.y - 20;
    this.player.switchToTron();
  },
  enemyHandler: function enemyHandler(monster,map) {
    if(!monster.spawned){
      monster.spawned = true;
      //this.client.updateMonsters(monster);
    }
  },
  updateShadowTexture: function updateShadowTexture() {
    this.shadowTexture.context.fillStyle = 'rgb(100, 100, 100)';
    this.shadowTexture.context.fillRect(0, 0, this.game.width, this.game.height);
    this.lights.forEach(function(light) {
      var radius = this.lightradius,
          heroX = light.x - this.game.camera.x,
          heroY = light.y - this.game.camera.y;
      // Draw circle
      var gradient = this.shadowTexture.context.createRadialGradient(
        heroX, heroY, this.lightradius * 0.5,
        heroX, heroY, radius);
      gradient.addColorStop(0, 'rgba(255, 255, 255, 1.0)');
      gradient.addColorStop(1, 'rgba(255, 255, 255, 0.0)');
      this.shadowTexture.context.beginPath();
      this.shadowTexture.context.fillStyle = gradient;
      this.shadowTexture.context.arc(heroX, heroY, radius, 0, Math.PI*2,false);
      this.shadowTexture.context.fill();
    }, this);
    // This just tells the engine it should update the texture cache
    this.shadowTexture.dirty = true;
  }
};

var game = {};
_.extend(game, gameBase);
_.extend(game, vines);
_.extend(game, climbchecks);
_.extend(game, teleport);
_.extend(game, attackhandler);
_.extend(game, playerchecks);

Game.prototype = game;

module.exports = Game;
