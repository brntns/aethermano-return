var Items = require('./items');
var Player = require('./player/player');
var Map = require('./map');
var Client = require('./client');
var Enemy = require('./enemy');

function Game() {
  this.client = null;
  this.player = null;
  this.map = null;
  this.enemy = null;
  this.client = null;
  this.win = false;
  this.items = null;
  this.survivors = [];
  this.survivorGroup = null;
  this.monsterStun = 1000;
  this.playerStun = 200;
  this.invulTime = 500;
  this.vulnTime = 3000;
}

Game.prototype = {
  create: function () {
    // enable frames manipulation & tracking
    this.game.time.advancedTiming = true;
    // enable physics
    this.game.physics.startSystem(Phaser.Physics.ARCADE);
    // creating game components
    this.map = new Map(this.game,this.player, this);
    this.player = new Player(this.game, this.map);
    // this.map = new Map(this.game,this.player, this);
    this.enemy = new Enemy(this.game,this.map,this);
    this.items = new Items(this.game,this.map,this);
    this.client = new Client(this);
    this.client.create();
    //console.log(this.map);
  },
  update: function () {
    // show Level
    this.game.debug.text(this.player.level || '', 2, 14, "#ffffff", { font: "30px "} );
        // if player exists
    if(this.player !== null){
          // make player collide
      this.game.physics.arcade.collide(this.player.sprite,this.map.collisionLayer);
      this.game.physics.arcade.collide(this.player.sprite,this.items.item, this.itemCollisionHandler, null, this);
      this.game.physics.arcade.collide(this.enemy.monsters,this.map.collisionLayer);
      this.game.physics.arcade.overlap(this.player.sprite,this.enemy.monsters, this.enemyCollisionHandler, null, this);
      this.game.physics.arcade.overlap(this.player.hitbox,this.enemy.monsters, this.enemySlashingHandler, null, this);
      // bring player sprite to top
      this.player.sprite.bringToTop();
      this.player.hitbox.bringToTop();
      // Update the player
      this.player.update();
      //check for windcondition
      if(this.player.sprite.x > this.map.portal.x && this.player.sprite.x < this.map.portal.x +300 && this.player.sprite.y > this.map.portal.y && this.player.sprite.y < this.map.portal.y + 300 && !this.win){
        //console.log('CELEBRATE');
        this.win = true;
        this.client.loadnewMap();
      }
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
  enemyCollisionHandler:function (playerSprite, monster) {
    if (this.player.moveMode > 0) {
      monster.destroy();
    } else if (!this.player.invul) {
      if (!this.player.vuln) {
        this.player.vuln = false;
        this.player.invul = true;
        console.log('OUCH!');
        console.log(this.time.events);
        this.player.invulTimer = this.game.time.events.add(this.invulTime, function(){this.player.invul = false; console.log('invul complete');},this);
        this.player.vulnTimer = this.game.time.events.add(this.vulnTime, function(){this.player.vuln = false; console.log('vuln complete');},this);
        console.log(this.time.events);
        this.player.sprite.body.velocity.x = Math.random()*1200-600;
        this.player.sprite.body.velocity.y = -Math.random()*600;
      } else {
        var X = this.map.maps[0].layers[0].height*16;
        var Y = this.map.maps[0].layers[0].width*16;
        var PosX = Math.floor(Math.random()*(X-32));
        var PosY = Math.floor(Math.random()*(Y-32));
        console.log('Respawn '+PosX+' '+PosY);
        this.player.sprite.x = PosX;
        this.player.sprite.x = PosX;
        console.log('Respawned');
      }
      //this.player.respawn(0, 0);
    } else {
      console.log('blergh');
    }
  },
  enemySlashingHandler:function (playerHitbox, monster) {
    if (this.player.slashing) {
      if (monster.hitpoints > 7) {
        monster.hitpoints = monster.hitpoints - 7;
        monster.body.velocity.x = Math.random()*1200-600;
        monster.body.velocity.y = -Math.random()*600;
        monster.runleft.pause();
        this.game.time.events.remove(monster.stunTimer);
        monster.stunTimer = this.game.time.events.add(this.monsterStun,function(){this.monsterReset(monster)},this);
      } else {
        monster.destroy();
      }
      this.player.slashing = false;
    }
  },
  itemCollisionHandler:function (playerSprite, item) {
    item.destroy();
    this.player.sprite.y = this.player.sprite.y - 20;
    this.player.sprite.body.velocity.x = 0;
    this.player.sprite.body.velocity.y = 0;
    this.player.sprite.body.acceleration.x = 0;
    this.player.sprite.body.acceleration.y = 0;
    this.player.sprite.body.allowGravity = false;
    this.player.moveMode = 1;

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
    }
};

module.exports = Game;
