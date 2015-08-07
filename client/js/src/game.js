var Items = require('./items');
var Player = require('./player/player');
var Map = require('./map');
var Client = require('./client');
var vines =  require('./game/vines');
var climbchecks =  require('./game/climb');
var teleport =  require('./game/teleport');
var attackhandler =  require('./game/attackhandler');

function Game() {
  this.client = null;
  this.player = null;
  this.map = null;
  this.worldMap = [];
  this.menuOpen = true;
  this.enemy = null;
  this.win = false;
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
  this.locationGroup = null;
  this.boundsGroup = null;
}

var gameBase = {
  create: function create() {
  	this.game.stage.backgroundColor = '#000000';
    // enable frames manipulation & tracking
    this.game.time.advancedTiming = true;
    // enable physics
    this.game.physics.startSystem(Phaser.Physics.ARCADE);
    this.game.physics.arcade.OVERLAP_BIAS = 1;
    this.monsterGroup = this.game.add.group();
    this.boundsGroup = this.game.add.group();
    this.menuGroup = this.game.add.group();
    this.survivorGroup = this.game.add.group();
    this.compassGroup = this.game.add.group();
    this.ladders = this.game.add.group();
    this.locationGroup = this.game.add.group();
    // creating game components
    this.player = new Player(this.game, this.map);
    this.map = new Map(this.game,this.player, this);
    this.items = new Items(this.game,this);
    this.client = new Client(this);
    this.client.create();
  },
  update: function update() {
    // Menu

    if(this.menuOpen){
      this.client.menu.update(this.player.cursors);
    } else{
      this.menuGroup.destroy();
    }
    // Deathchat hiding and aggro
    if(!this.player.dieing){
      if(this.chatGroup !== null){
        this.chatGroup.visible = false;
      }
      if(this.player.text !== null){
        this.player.text.visible = false;
      }
      this.incomingChat = [];
      // aggro
      for (var i = 0; i < this.monsterGroup.children.length; i++) {
        var distanceToPlayer = this.game.physics.arcade.distanceBetween(this.monsterGroup.children[i], this.player.sprite);
        this.monsterAggro(distanceToPlayer,this.monsterGroup.children[i]);
        if (this.player.playerClass === 7 && this.player.bullet !== undefined && this.player.bullet !== null) {
          var distanceToBullet = this.game.physics.arcade.distanceBetween(this.monsterGroup.children[i], this.player.bullet);
          this.skullAggro(distanceToBullet,this.monsterGroup.children[i], this.player.bullet);
        }
      };
    }
    // Deathchat
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
    // Vul animation
    if (this.player.vuln && !this.player.dieing) {
      this.player.sprite.tint = 0xFAA1A1;
    } else {
      this.player.sprite.tint = 0xffffff;
    }
    // Invul animation
    if (this.player.invul && !this.player.dieing){
      this.player.sprite.alpha = 0.5;
      this.player.sprite.tint = 0xffffff;
    } else {
      this.player.sprite.alpha = 1;
    }
    // Collision
    if(this.player !== null && this.map.collisionLayer !== null ){
      console.log(this.player.status);
      // make player collide
      this.game.physics.arcade.collide(this.player.sprite,this.map.collisionLayer);
      //this.game.physics.arcade.collide(this.player.sprite,this.boundsGroup);
      this.game.physics.arcade.collide(this.player.sprite,this.items.item, this.itemCollisionHandler, null, this);
      this.game.physics.arcade.collide(this.monsterGroup,this.map.collisionLayer, this.enemyHandler,null,this);
      this.game.physics.arcade.overlap(this.player.sprite,this.monsterGroup, this.enemyCollisionHandler, null, this);
      this.game.physics.arcade.overlap(this.player.hitbox1,this.monsterGroup, this.enemySlashingHandler, null, this);
      this.game.physics.arcade.overlap(this.player.hitbox2,this.monsterGroup, this.enemySlashingHandler, null, this);
      this.game.physics.arcade.overlap(this.player.bullets,this.monsterGroup, this.enemyBulletHandler, null, this);
      this.game.physics.arcade.overlap(this.player.bullets,this.map.collisionLayer, this.wallHit, null, this);
      this.game.physics.arcade.overlap(this.player.sprite,this.locationGroup, this.changeLevel, null, this);
      if (this.game.physics.arcade.overlap(this.player.sprite,this.ladders)) {
        this.player.onLadder = true;
      } else {
        this.player.onLadder = false;
      }
      this.climbCheck();
      if(this.compasses.length > 0){
        for (var i = 0; i < this.compasses.length; i++) {
          this.compasses[i].sprite.bringToTop();
        }
      }
      if(this.locationGroup.length > 0){
        for (var i = 0; i < this.locationGroup.length; i++) {
          this.locationGroup.children[i].bringToTop();
        }
      }
      this.player.sprite.bringToTop();
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
  startExplorer: function startExplorer(){
    this.menuOpen = false;
    this.client.loadMonsters(this.worldMap[0].monsters,this);

    this.map.create(this.worldMap[0].map);
  },
  startConjurer: function startConjurer(){
    this.menuOpen = false;
    this.player.setPlayerClass(9);
    this.client.loadMonsters(this.worldMap[0].monsters,this);
    this.map.create(this.worldMap[0].map);
  },
  startKnight: function startKnight(){
    this.menuOpen = false;
    this.client.loadMonsters(this.worldMap[0].monsters,this);

    this.player.setPlayerClass(8);

    this.map.create(this.worldMap[0].map);
  },
  changeLevel: function changeLevel(playerSprite, location) {
    if (this.player.cursors.up.isDown) {
      this.map.update(this.world[location.i].map);
      this.items.create(this.world[location.i].locations);
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
    if (range < 100 && !monster.aggro) {
      console.log('aggroing');
      monster.aggro = true;
      this.chasePlayer(monster);
      this.client.updateMonsters(monster);
    } else {
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
    //this.game.stage.backgroundColor =  '#79BFE2';
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
  }
};

var game = {};
_.extend(game, gameBase);
_.extend(game, vines);
_.extend(game, climbchecks);
_.extend(game, teleport);

Game.prototype = game;

module.exports = Game;
