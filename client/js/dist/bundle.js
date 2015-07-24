(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
'use strict';

function Boot() {};

Boot.prototype = {

	preload: function () {

	},

	create: function () {
		this.game.state.start('preloader');
	}
};

module.exports = Boot;

},{}],2:[function(require,module,exports){
var Survivor = require('./survivor');
var Enemy = require('./enemy');
function Client(game) {
	this.game = game;
	this.socket = null;
	this.isActive = false;
  this.debug = true;
};

Client.prototype = {
	create: function(){
		//connect to socket
		//this.socket = io.connect('http://localhost:8000');
	  	this.socket = io.connect('https://cryptic-springs-1537.herokuapp.com');
		var game = this.game;
		var socket = this.socket;
		//debug plugin
    	//this.game.add.plugin(Phaser.Plugin.Debug);
		//add player
		this.game.player.create();
		this.game.player.sprite.visible = false;
		this.game.player.hitbox1.visible = false;
		this.game.player.hitbox2.visible = false;
		this.game.player.climbboxUR.visible = true;
		this.game.player.climbboxUL.visible = true;
		this.game.player.climbboxDL.visible = true;
		this.game.player.climbboxDR.visible = true;
		//socket events
		this.socket.on('playerConnected', function(data){
			game.player.id = data.id;
			//game.survivors = [];
		});
		this.socket.on('playerSpawn', function(data){
    	//console.log(data);
			game.player.spawn(data.x, data.y,data.level);
			game.player.sprite.visible = true;
		});
    this.socket.on('playerRepawn', function(data){
      //console.log(data);
      game.player.respawn(data.x, data.y);
      game.player.sprite.visible = true;
      game.win = false;
    });

		this.socket.on('updatePlayers', function(data){
			_.each(data, function(updateSurvivor){
				if(updateSurvivor.id !== game.player.id){
					var survivor = _.find(game.survivors, function(s){
						return s.id === updateSurvivor.id;
					});
					if (!survivor) {
						var survivor = new Survivor(updateSurvivor.id, game);
						survivor.create(updateSurvivor.x, updateSurvivor.y);
						game.survivors.push(survivor);
					} else {
						survivor.sprite.x = updateSurvivor.x;
						survivor.sprite.y = updateSurvivor.y;
						survivor.sprite.status = updateSurvivor.status;
            survivor.sprite.level = updateSurvivor.level;
					}
					survivor.update();
				}
			})
		});
		this.socket.on('removePlayer', function(id){
			var player = _.remove(game.survivors, function(player) {
				return player.id === id;
			});
			if(player.length > 0){
				player[0].sprite.destroy();
			}
		});
		// Map
		this.socket.on('changeLevel', function(data){
			game.player.level = data.level;
			game.map.update(data.map);
			socket.emit('mapUpdated');
		});
		this.socket.on('getMap', function(data,items){
			game.map.create(data);
			game.items.create(items);
		//	game.enemy.create(monster);
			socket.emit('mapCreated');
		});
		// Monster Events
		this.socket.on('updateMonsters', function(data){
		// console.log(data);
		// 	console.log(game.monsters);
			if(data.length === undefined){
				var monster = _.find(game.monsters, function(m){
					return m.id === data.id;
				});
				if(!monster){
					console.log('creating monster');
					var monster = new Enemy(data.id, game);
					monster.create(data);
					game.monsters.push(monster);
				} else{
				//	console.log(data);
					monster.sprite.x = data.x;
					monster.sprite.y = data.y;
					monster.sprite.body.velocity.x = data.velox;
					monster.sprite.body.velocity.y = data.veloy;
					monster.hitpoints = data.hp;
				}
			}
			else{
				_.each(data, function(monsterData){
					//console.log(monsterData);
					var monster = _.find(game.monsters, function(m){
						return m.id === monsterData.id;
					});
					if(!monster){
						console.log('creating monster');
						var monster = new Enemy(monsterData.id, game);
						monster.create(monsterData);
						game.monsters.push(monster);
					} else{
						console.log('updating monster')
						monster.sprite.x = monsterData.x;
						monster.sprite.y = monsterData.y;
						monster.sprite.body.velocity.x = monsterData.velox;
						monster.sprite.body.velocity.y = monsterData.veloy;
						monster.sprite.hitpoints = monsterData.hp;
					}
					//monster.update(monsterData);
				})
			}
		});
		this.socket.on('removeMonster', function(id){
			var monster = _.remove(game.monsters, function(m) {
				return m.id === id;
			});
			if(monster.length > 0){
				monster[0].sprite.destroy();
			}
		});

	},
  	loadnewMap: function(){
		//console.log(gettingLevel);
  	  var level = this.game.player.level;
  	  this.socket.emit('requestLevelChange', level);
  	},
	update: function(){
		if(this.game.player.isActive && this.game.player.sprite.visible){
			this.socket.emit('newPlayerPosition', {
				x: this.game.player.sprite.x,
				y: this.game.player.sprite.y,
				status: this.game.player.status,
				level: this.game.player.level
			});
		}
	},
	updateMonsters: function(monster){
		//console.log(monster);
		if(this.game.player.isActive && this.game.player.sprite.visible){
			this.socket.emit('monsterUpdate', {
				id: monster.id,
				x: monster.x,
				y: monster.y,
				velox: monster.body.velocity.x,
				veloy: monster.body.velocity.y,
				hp: monster.hitpoints
			});
		}
	},
	monsterKilled: function(monster){
		//console.log(monster);
		if(this.game.player.isActive && this.game.player.sprite.visible){
			this.socket.emit('monsterKill', {
				id: monster.id
			});
		}
	},
	monsterSlashed: function(monster){
		console.log(monster);
		if(this.game.player.isActive && this.game.player.sprite.visible){

			this.socket.emit('monsterSlashed', {
				id: monster.id,
				x:monster.x,
				y:monster.y,
				velox: monster.body.velocity.x,
				veloy: monster.body.velocity.y,
				hp: monster.hitpoints
			});
		}
	},
	monsterRequested: function(x,y){
		var spawn = {
			x:x + 50,
			y:y - 50
		};
		this.socket.emit('requestMonster', spawn);
	},
  isInt:function(n) {
   return n % 1 === 0;
  }
};

module.exports = Client;

},{"./enemy":3,"./survivor":21}],3:[function(require,module,exports){
'use strict';

function Enemy(id, game) {
  this.game = game;
  this.id = id;
  this.running = null;
  this.rng01 = null;
  this.rng02 = null;
};
var enemyBase = {
  create: function (data) {
    //log Data
    // console.log(data);
    // add every monster from server
    this.sprite = this.game.monsterGroup.getFirstDead();
    this.sprite = this.game.add.sprite(32,48, 'enemy2');
    this.sprite.physicsType = Phaser.SPRITE;
    this.sprite.animations.add('left', [0, 1, 2], 5, true);
    this.sprite.animations.play('left');
    this.game.physics.arcade.enable(this.sprite);
    this.sprite.x = data.x;
    this.sprite.id = data.id;
    this.sprite.y = data.y;
    this.sprite.body.velocity.x = data.velox;
    this.sprite.body.velocity.y = data.veloy;
    this.sprite.spawned = false;

    this.sprite.body.collideWorldBounds = true;
    this.sprite.hitpoints = data.hp;
    this.game.monsterGroup.add(this.sprite);
      console.log(this.sprite.spawned);
  /*  this.rng01 = Math.random();
    this.rng02 = Math.random();
    this.sprite.runleft = this.game.add.tween(this.sprite);
    this.sprite.runleft
      .to({x:  this.sprite.x + this.rng01*450+20}, this.rng02*2000+500)
      .to({x:  this.sprite.x }, this.rng02*2000+500)
      .to({x:  this.sprite.x + 200}, 2000)
      .to({x:  this.sprite.x }, 2000)
      .loop()
      .start(); */
  },
  update: function(data) {
    console.log(data);
  }
};

var enemies = {};
_.extend(enemies, enemyBase);

Enemy.prototype = enemies;

module.exports = Enemy;

},{}],4:[function(require,module,exports){
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
  this.survivors = [];
  this.survivorGroup = null;
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
      if (this.game.physics.arcade.overlap(this.player.sprite,this.ladders)) {
        this.player.onLadder = true;
      } else {
        this.player.onLadder = false;
      }
      this.climbCheck();
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

},{"./client":2,"./items":5,"./map":7,"./player/player":16}],5:[function(require,module,exports){
'use strict';

function Items(game, map, items) {
  this.items = items;
  this.game = game;

};
var itemBase = {
  create: function (data) {
  //  Log ITEMS
   //console.log(data);
  //  this.item = this.game.add.sprite(600, 600, 'item');
  //  this.game.physics.arcade.enable(this.item);
  //  this.item.body.collideWorldBounds = true;
  }
};

var item = {};
_.extend(item, itemBase);

Items.prototype = item;

module.exports = Items;

},{}],6:[function(require,module,exports){
var Boot = require('./boot');
var Preloader = require('./preloader');
var Splash = require('./splash');
var Game = require('./game');

window.onload = function () {
	'use strict';

  window['phaser'] = {};
  window['phaser'].Boot = Boot;
	window['phaser'].Preloader = Preloader;
	window['phaser'].Splash = Splash;
  window['phaser'].Game = Game;


	var game;
	var ns = window['phaser'];
	game = new Phaser.Game(1024,640, Phaser.AUTO, 'phaser-game');
	game.state.add('boot', ns.Boot);
	game.state.add('game', ns.Game);
	game.state.add('preloader', ns.Preloader);
	game.state.add('splash', ns.Splash);


	game.state.start('boot');
};

},{"./boot":1,"./game":4,"./preloader":19,"./splash":20}],7:[function(require,module,exports){
'use strict';

function Map(game, player, myGame) {
	this.myGame = myGame;
	this.player = player;
	this.game = game;
	this.bg = null;
  this.maps = null;
  this.tilemap = null;
  this.currentMap = null;
	this.tileset = null;
	this.collisionLayer = null;
  this.portal = {};
  this.portal.x = null;
  this.portal.y = null;
  this.client = null;
}

var mapBase = {

	create: function (data) {
		// Log Map infos
		//	console.log(data + this.player.level);
		this.game.stage.backgroundColor = '#79BFE2';
		//this.bg = this.game.add.sprite(0, 0,'bg');
		this.bg = this.game.add.tileSprite(0, 0, 1024, 640,'bg');
		this.bg.fixedToCamera = true;
    this.maps = data;
    this.setCurrentLevel(this.maps[0],'level1');
		this.game.stage.smoothed = false;
		// add player group
		this.myGame.monsterGroup = this.game.add.group();
		this.myGame.survivorGroup = this.game.add.group();
    this.myGame.ladders = this.game.add.group();
	//	this.myGame.survivorGroup.createMultiple(100,'player');
	},
	update: function(data) {
		//  Scroll the background
    this.maps = data;
    var ll = this.player.level;
    //console.log(ll);
    this.setCurrentLevel(this.maps[ll],'level'+ll);
	},
  setCurrentLevel:function(level,name){
		//console.log(level);
    this.currentMap = level;
    if(this.collisionLayer !== null){
      this.collisionLayer.destroy();
    	console.log('destroyed');
    }
    this.tilemap = this.game.load.tilemap(name, null, this.currentMap, Phaser.Tilemap.TILED_JSON );
    this.tileset = this.game.add.tilemap(name);
		//set collision
    this.tileset.setCollisionByExclusion([ 13, 14, 15, 16, 46, 47, 48, 49, 50, 51, 99, 100, 101, 102, 103, 104, 105, 106, 107, 108, 109, 110, 111, 112, 113, 114, 115, 116, 117, 118, 119]);
    this.tileset.addTilesetImage('tiles-1');
    //set collisionLayer
    this.collisionLayer = this.tileset.createLayer('Tile Layer 1');
		this.collisionLayer.renderSettings.enableScrollDelta = true;
    this.collisionLayer.resizeWorld();
    this.portal.x = level.portalPosX * 16;
    this.portal.y = level.portalPosY * 16;
    // console.log('//// PORTAL SPAWNED AT');
    // console.log('//// x:' +  this.portal.x + 'y:'+ this.portal.y);
    // console.log('starting game');

		//console.log(this.collisionLayer);
  }
}

var map = {};
_.extend(map, mapBase);

Map.prototype = map;

module.exports = Map;

},{}],8:[function(require,module,exports){
var basePlayer = {
  create: function () {
    // adding player sprite
    this.sprite = this.game.add.sprite(32, this.game.world.height - 150, 'explorer');
    this.hitbox1 = this.game.add.sprite(32, this.game.world.height - 150, 'monk_hitbox');
    this.hitbox2 = this.game.add.sprite(32, this.game.world.height - 150, 'monk_hitbox');
    this.climbboxUR = this.game.add.sprite(32, this.game.world.height - 150, 'climbbox');
    this.climbboxUL = this.game.add.sprite(32, this.game.world.height - 150, 'climbbox');
    this.climbboxDL = this.game.add.sprite(32, this.game.world.height - 150, 'climbbox');
    this.climbboxDR = this.game.add.sprite(32, this.game.world.height - 150, 'climbbox');
    // adding physics
    this.game.physics.arcade.enable(this.sprite);
    this.game.physics.arcade.enable(this.hitbox1);
    this.game.physics.arcade.enable(this.hitbox2);
    this.game.physics.arcade.enable(this.climbboxUR);
    this.game.physics.arcade.enable(this.climbboxUL);
    this.game.physics.arcade.enable(this.climbboxDL);
    this.game.physics.arcade.enable(this.climbboxDR);
    this.hitbox1.body.allowGravity = false;
    this.hitbox2.body.allowGravity = false;
    this.climbboxUR.body.allowGravity = false;
    this.climbboxUL.body.allowGravity = false;
    this.climbboxDL.body.allowGravity = false;
    this.climbboxDR.body.allowGravity = false;
    // clip size
    this.sprite.body.setSize(29, 29, 29, 29);
    // adding animations
    this.sprite.animations.add('right', [2,3,4], 10, true);
    this.sprite.animations.add('left', [12,13,14], 10, true);
    this.sprite.animations.add('death', [20,21,22,23,24,25,26,27], 10, false);
    this.sprite.animations.add('climb_ladder', [30,31,32,30,33,34], 10, true);

    this.sprite.animations.add('monk_slash_rightup', [46,45,47,48,49,46,51,50], 16, true);
    this.sprite.animations.add('monk_slash_leftup', [56,55,57,58,59,56,41,40], 16, true);
    this.sprite.animations.add('monk_slash_leftdown', [50,51,50,44,43,42,40,41], 16, true);
    this.sprite.animations.add('monk_slash_rightdown', [40,41,50,51,40,41,50,51], 16, true);

    this.sprite.animations.add('monk_slash_right', [40,41,50,51,40,41,50,51], 16, true);
    this.sprite.animations.add('monk_slash_up', [44,45,44,43,53,54,53,52], 16, true);
    this.sprite.animations.add('monk_slash_left', [50,51,50,44,43,42,40,41], 16, true);
    this.sprite.animations.add('monk_slash_down', [50,41,60,51,50,41,50,51], 16, true);

    this.sprite.animations.add('explorer_slash_right', [40,41,42,43,44,45,46,47], 16, true);
    this.sprite.animations.add('explorer_slash_left', [50,51,52,53,54,55,56,57], 16, true);

    this.sprite.animations.add('demon_slash_right', [40,41,42,43,44], 16, true);
    this.sprite.animations.add('demon_slash_left', [50,51,52,53,54], 16, true);

    this.sprite.animations.add('climb_right_wall', [60,61,62,63], 12, true);
    this.sprite.animations.add('climb_left_wall', [70,71,72,73], 12, true);

    this.sprite.animations.add('climb_right_overhang', [64,65,66], 12, true);
    this.sprite.animations.add('climb_left_overhang', [74,75,76], 12, true);

    // this.hitbox2.animations.add('monk_slash_rightup', [0,1,2,3,4], 50, true);
    // this.hitbox2.animations.add('monk_slash_leftup',  [0,1,2,3,4], 50, true);
    // this.hitbox2.animations.add('monk_slash_leftdown',  [0,1,2,3,4], 50, true);
    // this.hitbox2.animations.add('monk_slash_rightdown', [0,1,2,3,4], 50, true);
    //
    // this.hitbox2.animations.add('monk_slash_right', [1,2,3,4,5], 50, true);
    // this.hitbox2.animations.add('monk_slash_up',  [1,2,3,4,5], 50, true);
    // this.hitbox2.animations.add('monk_slash_left',  [1,2,3,4,5], 50, true);
    // this.hitbox2.animations.add('monk_slash_down', [1,2,3,4,5], 50, true);

    // adding gravity and Player Velocity
    this.game.physics.arcade.gravity.y = this.gravity;
    this.sprite.body.maxVelocity.y = 500;

    this.sprite.body.collideWorldBounds = true;
    // make the camera follow the player
    this.game.camera.follow(this.sprite,Phaser.FOLLOW_PLATFORMER);
    this.cursors = this.game.input.keyboard.createCursorKeys();
    this.monsterButton = this.game.input.keyboard.addKey(Phaser.Keyboard.M);
    this.jumpButton = this.game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
    this.greetBtn = this.game.input.keyboard.addKey(Phaser.Keyboard.H);
    this.teleport = this.game.input.keyboard.addKey(Phaser.Keyboard.T);
    this.fullscreen = this.game.input.keyboard.addKey(Phaser.Keyboard.F);
    this.tron = this.game.input.keyboard.addKey(Phaser.Keyboard.R);
    this.slash = this.game.input.keyboard.addKey(Phaser.Keyboard.S);
    this.class0 = this.game.input.keyboard.addKey(Phaser.Keyboard.ZERO);
    this.class1 = this.game.input.keyboard.addKey(Phaser.Keyboard.ONE);
    this.class2 = this.game.input.keyboard.addKey(Phaser.Keyboard.TWO);
    this.class3 = this.game.input.keyboard.addKey(Phaser.Keyboard.THREE);
    this.class4 = this.game.input.keyboard.addKey(Phaser.Keyboard.FOUR);
    this.class5 = this.game.input.keyboard.addKey(Phaser.Keyboard.FIVE);
    this.ladderButton = this.game.input.keyboard.addKey(Phaser.Keyboard.L);
    this.specialButton = this.game.input.keyboard.addKey(Phaser.Keyboard.E);
    this.game.scale.fullScreenScaleMode = Phaser.ScaleManager.SHOW_ALL;

    // Set Fullscreen
    this.fullscreen.onDown.add(this.gofull, this);

    //set explorer class.
    this.setPlayerClass(0);
   },
  update: function() {
    // populate bit Array TEST
  },
  gofull: function () {
    // toggle fullscreen
    if (this.game.scale.isFullScreen){
      this.game.scale.stopFullScreen();
    } else {
      this.game.scale.startFullScreen(false);
    }
  },
  respawn: function(x, y) {
    this.alive = true;
    this.sprite.x = 0;//x;
    this.sprite.y = 0//y;
  },
  spawn: function(x, y,level) {
    this.alive = true;
    this.sprite.x = x;
    this.sprite.y = y;
    this.level = level;
  }
};

module.exports = basePlayer;

},{}],9:[function(require,module,exports){
'use strict';

var chatWheel = {

}

module.exports = chatWheel;


},{}],10:[function(require,module,exports){
var Constants = {
    teleport: {
      cd: 15000,
      rangeX: 320,
      rangeY: 160
    }
};

module.exports = Constants;

},{}],11:[function(require,module,exports){
var Demon = {
  playerClass: 5,
  moveMode: 0,
  classInit: function () {
    this.sprite.loadTexture('demon', 0);
    this.slashTime = 312;
  },
  classUpdate: function classUpdate() {
    //add some attacks for demon!
    //Attacking
    //Slash
    this.slashingDirection();
    if (this.slash.isDown) {
      if (!this.slashed) {
        this.slashat();
        this.slashed = true;
      }
    } else {
      this.slashed = false;
    }
  },
  slashat: function slashat() {
    if (this.Facing === 1 || this.Facing === 2 || this.Facing === 3 || this.Facing === 8) {
      this.sprite.animations.play('demon_slash_right');
    } else if (this.Facing === 4 || this.Facing === 5 || this.Facing === 6 || this.Facing === 7) {
      this.sprite.animations.play('demon_slash_left');
    }
    this.hitbox1.visible = true;
    this.hitbox2.visible = true;
    this.slashing = true;
    this.game.time.events.remove(this.slashTimer);
    this.slashTimer = this.game.time.events.add(this.slashTime,function(){this.hitbox1.visible = false;this.hitbox2.visible = false;this.slashing = false;},this);
  },
  slashingDirection: function slashingDirection() {
    this.hitbox2.x = this.sprite.x + 29;
    this.hitbox2.y = this.sprite.y + 29;
    if (this.Facing === 1 || this.Facing === 2 || this.Facing === 3 || this.Facing === 8) {
      //right
      this.hitbox1.x = this.sprite.x + 58;
      this.hitbox1.y = this.sprite.y + 29;
    } else if (this.Facing === 4 || this.Facing === 5 || this.Facing === 6 || this.Facing === 7) {
      //left
      this.hitbox1.x = this.sprite.x;
      this.hitbox1.y = this.sprite.y + 29;
    } 
  }
};

module.exports = Demon;
},{}],12:[function(require,module,exports){
var Explorer = {
  playerClass: 0,
  moveMode: 0,
  classInit: function () {
    this.sprite.loadTexture('explorer', 0);
  },
  classUpdate: function classUpdate() {
    switch (this.moveMode) {
      case 0:
        this.climbingMask();
        if (this.slash.isDown) {
          if (this.climbBoxUR || this.climbBoxUL) {
            this.switchToClimb();
          }
        }
      break;
      case 2:
        this.climbingMask();
        //Reverting to Normal Movement
        if (!this.slash.isDown || (!this.climbBoxUR && !this.climbBoxUL && !this.climbBoxDL && !this.climbBoxDR)) {
          this.switchToNormal();
        }
        this.directions();
        this.climb();
        //spawning a ladder
        if (this.specialButton.isDown) {
          if (!this.ladderOnCD) {
            this.spawningLadder = true;
            this.ladderOnCD = true;
            this.game.time.events.add(this.ladderCD,function(){this.ladderOnCD = false;},this);
          }
        }
      break;
      case 3:
      break;
      default:
        this.moveMode = 0;
      break;
    }
  },
  climbingMask: function climbingMask() {
    this.climbboxUR.x = this.sprite.x+44;
    this.climbboxUR.y = this.sprite.y+25;
    this.climbboxUL.x = this.sprite.x+25;
    this.climbboxUL.y = this.sprite.y+25;
    this.climbboxDL.x = this.sprite.x+25;
    this.climbboxDL.y = this.sprite.y+44;
    this.climbboxDR.x = this.sprite.x+44;
    this.climbboxDR.y = this.sprite.y+44;
  },
  switchToClimb: function switchToClimb() {
    console.log('Switched to Climb');
    this.moveMode = 2;
    this.sprite.body.velocity.x = 0;
    this.sprite.body.velocity.y = 0;
    this.sprite.body.acceleration.x = 0;
    this.sprite.body.acceleration.y = 0;
    this.sprite.body.allowGravity = false;
  },
  climb: function climb() {
    var climbspeed = 125;
    var overhangspeed = 85;
    var shimmyspeed = 175;
    var shaftspeed = 275;
    //Shaft
    if (this.climbBoxUR && this.climbBoxUL && this.climbBoxDL && this.climbBoxDR) {
      this.climbing(shaftspeed, shaftspeed, shaftspeed);
      this.climbingAnimation(0, this.H, this.V);
      this.ladderDirection = 1;
    } else {
    //Corner Right
      if (this.climbBoxUR && this.climbBoxUL && this.climbBoxDR) {
        this.climbing(overhangspeed, climbspeed, shimmyspeed);
        this.climbingAnimation(1, this.H, this.V);
        this.ladderDirection = 2;
    //Corner Left
      } else if (this.climbBoxUR && this.climbBoxUL && this.climbBoxDL) {
        this.climbing(overhangspeed, climbspeed, shimmyspeed);
        this.climbingAnimation(1, this.H, this.V);
        this.ladderDirection = 0;
    //Overhang
      } else if (this.climbBoxUR && this.climbBoxUL) {
        this.climbing(overhangspeed, climbspeed, shimmyspeed);
        this.climbingAnimation(1, this.H, this.V);
        this.ladderDirection = 1;
    //Wall to the Right
      } else if (this.climbBoxUR && this.climbBoxDR) {
        this.climbing(overhangspeed, climbspeed, shimmyspeed);
        this.climbingAnimation(2, this.H, this.V);
        this.ladderDirection = 2;
    //Wall to the Left
      } else if (this.climbBoxUL && this.climbBoxDL) {
        this.climbing(overhangspeed, climbspeed, shimmyspeed);
        this.climbingAnimation(3, this.H, this.V);
        this.ladderDirection = 0;
    //Overhang End Right
      } else if (this.climbBoxUL) {
        this.climbing(overhangspeed, climbspeed, overhangspeed);
        this.climbingAnimation(4, this.H, this.V);
        this.ladderDirection = 3;
    //Overhang End Left
      } else if (this.climbBoxUR) {
        this.climbing(overhangspeed, climbspeed, overhangspeed);
        this.climbingAnimation(5, this.H, this.V);
        this.ladderDirection = 3;
    //Wall Top Right
      } else if (this.climbBoxDR) {
        this.climbing(overhangspeed, climbspeed, overhangspeed);
        this.climbingAnimation(2, this.H, this.V);
        this.ladderDirection = 2;
    //Wall Top Left
      } else if (this.climbBoxDL) {
        this.climbing(overhangspeed, climbspeed, overhangspeed);
        this.climbingAnimation(3, this.H, this.V);
        this.ladderDirection = 0;
      }
    }
  },
  climbing: function climbing(sidespeed, upspeed, downspeed) {
    if (this.direction === 8 || this.direction === 1 || this.direction === 2 ) {
      // moving right
      this.sprite.body.velocity.x = sidespeed;
      this.H = 1;
    } else if (this.direction === 4 || this.direction === 5 || this.direction === 6 ) {
      // moving left
      this.sprite.body.velocity.x = -sidespeed;
      this.H = -1;
    } else {
      // resting
      this.sprite.body.velocity.x = 0;
      this.H = 0;
    }
    if (this.direction === 2 || this.direction === 3 || this.direction === 4 ) {
      // moving up
      this.sprite.body.velocity.y = -upspeed;
      this.V = -1;
    } else if (this.direction === 6 || this.direction === 7 || this.direction === 8 ) {
      // moving down
      this.sprite.body.velocity.y = downspeed;
      this.V = 1;
    } else {
      // resting
      this.sprite.body.velocity.y = 0;
      this.V = 0;
    }
  },
  climbingAnimation: function climbingAnimation(N, H, V) {
    //Animation Shaft
    if (N === 0) {
      //Climb Down
      if (V === 1) {
        this.sprite.animations.play('climb_ladder');
      //Climb Up
      } else if (V === -1) {
        this.sprite.animations.play('climb_ladder');
      //Climb to the Right
      } else if (H === 1) {
        this.sprite.animations.play('climb_ladder');
      //Climb to the Left
      } else if (H === -1) {
        this.sprite.animations.play('climb_ladder');
      //Hang
      } else {
        this.sprite.frame = 30;
      }
    //Animation Overhang
    } else if (N === 1) {
      //Climb to the Right
      if (H === 1) {
        this.sprite.animations.play('climb_right_overhang');
      //Climb to the Left
      } else if (H === -1) {
        this.sprite.animations.play('climb_left_overhang');
      //Hang
      } else {
        this.sprite.animations.stop();
        this.sprite.frame = 66;
      }
    //Animation Wall Right
    } else if (N === 2) {
      //Climb Down
      if (V === 1) {
        this.sprite.animations.play('climb_right_wall');
      //Climb Up
      } else if (V === -1) {
        this.sprite.animations.play('climb_right_wall');
      //Hang
      } else {
        this.sprite.animations.stop();
        this.sprite.frame = 61;
      }
    //Animation Wall Left
    } else if (N === 3) {
      //Climb Down
      if (V === 1) {
        this.sprite.animations.play('climb_left_wall');
      //Climb Up
      } else if (V === -1) {
        this.sprite.animations.play('climb_left_wall');
      //Hang
      } else {
        this.sprite.animations.stop();
        this.sprite.frame = 71;
      }
    //Animation Overhang End Right
    } else if (N === 4) {
      //Climb Down
      if (V === 1) {
        this.sprite.animations.play('climb_left_wall');
      //Climb Up
      } else if (V === -1) {
        this.sprite.animations.play('climb_left_wall');
      //Hang
      } else {
        this.sprite.animations.stop();
        this.sprite.frame = 74;
      }
    //Animation Overhang End Left
    } else {
      //Climb Down
      if (V === 1) {
        this.sprite.animations.play('climb_right_wall');
      //Climb Up
      } else if (V === -1) {
        this.sprite.animations.play('climb_right_wall');
      //Hang
      } else {
        this.sprite.animations.stop();
        this.sprite.frame = 64;
      }
    }
  }
};

module.exports = Explorer;

},{}],13:[function(require,module,exports){
var Monk = {
  playerClass: 1,
  moveMode: 0,
  classInit: function () {
    this.sprite.loadTexture('monk', 0);
    this.slashTime = 500;
  },
  classUpdate: function classUpdate() {
	  //Attacking
    //Slash
    this.slashingDirection();
    if (this.slash.isDown) {
      if (!this.slashed) {
        this.slashat();
        this.slashed = true;
      }
    } else {
      this.slashed = false;
    }
    switch (this.moveMode) {
    case 0:
    //Gliding
      this.glideCond();
      if (this.jumpButton.isDown) {
        this.glidy();
      }
    break;

    case 3:
    break;

    default:
      this.moveMode = 0;
    break;
    }
  },
  glide: function glide(N) {
    switch (N) {
      case 0:
      if (this.gliding) {
        this.sprite.body.acceleration.y = 0;
        this.sprite.body.maxVelocity.y = 500;
        this.sprite.body.allowGravity = true;
        this.gliding = false;
      }
      break;
      case 1:
      if (!this.gliding) {
        this.gliding = true;
        this.sprite.body.maxVelocity.y = 80;
        this.sprite.animations.stop();
        if (this.sprite.body.velocity.x > 0) {
          this.sprite.frame = 1;
        } else {
          this.sprite.frame = 11;
        }
      }
      break;
      case 2:
      if (!this.gliding) {
        this.gliding = true;
        this.sprite.body.allowGravity = false;
        this.sprite.body.acceleration.y = -500;
        this.sprite.animations.stop();
        if (this.sprite.body.velocity.x > 0) {
          this.sprite.frame = 5;
        } else {
          this.sprite.frame = 15;
        }
      }
      break;
    }
  },
  glidy: function glidy() {
    if ( !((this.sprite.body.onFloor() && !this.bunnyKiller) || this.jumpWindow)
    && !(this.wallJumpL && this.jumpRelease && this.cursors.right.isDown)
    && !(this.wallJumpR && this.jumpRelease && this.cursors.left.isDown) ) {
      if (this.sprite.body.velocity.y > 0
      && this.sprite.body.velocity.y < 400 && this.jumpRelease) {
        this.glide(1);
      } else if (this.sprite.body.velocity.y > 400 && this.jumpRelease) {
        this.glide(2);
      }
    }
  },
  glideCond: function glideCond() {
    if (this.sprite.body.blocked.up || this.sprite.body.blocked.down || !this.jumpButton.isDown) {
        this.glide(0);
    }
  },
  slashat: function slashat() {
    if (this.Facing === 1) {
      this.sprite.animations.play('monk_slash_right');
    } else if (this.Facing === 2) {
      this.sprite.animations.play('monk_slash_rightup');
    } else if (this.Facing == 3) {
      this.sprite.animations.play('monk_slash_up');
    } else if (this.Facing === 4) {
      this.sprite.animations.play('monk_slash_leftup');
    } else if (this.Facing === 5) {
      this.sprite.animations.play('monk_slash_left');
    } else if (this.Facing === 6) {
      this.sprite.animations.play('monk_slash_leftdown');
    } else if (this.Facing === 7) {
      this.sprite.animations.play('monk_down');
    } else if (this.Facing === 8) {
      this.sprite.animations.play('monk_slash_rightdown');
    }
    this.hitbox1.visible = true;
    this.hitbox2.visible = true;
    this.slashing = true;
    this.game.time.events.remove(this.slashTimer);
    this.slashTimer = this.game.time.events.add(this.slashTime,function(){this.hitbox1.visible = false;this.hitbox2.visible = false;this.slashing = false;},this);
  },
  slashingDirection: function slashingDirection() {
    if (this.Facing === 1 || this.Facing === 5) {
      //left and right
      this.hitbox1.x = this.sprite.x + 58;
      this.hitbox1.y = this.sprite.y + 29;
      this.hitbox2.x = this.sprite.x;
      this.hitbox2.y = this.sprite.y + 29;
      //up
    } else if (this.Facing == 3) {
      this.hitbox1.x = this.sprite.x + 14;
      this.hitbox1.y = this.sprite.y;
      this.hitbox2.x = this.sprite.x + 44;
      this.hitbox2.y = this.sprite.y;
      //down
    } else if (this.Facing == 7) {
      this.hitbox1.x = this.sprite.x + 58;
      this.hitbox1.y = this.sprite.y + 29;
      this.hitbox2.x = this.sprite.x;
      this.hitbox2.y = this.sprite.y + 29;
      //upright and downleft
    } else if (this.Facing === 2 || this.Facing === 6) {
      this.hitbox1.x = this.sprite.x + 58;
      this.hitbox1.y = this.sprite.y;
      this.hitbox2.x = this.sprite.x;
      this.hitbox2.y = this.sprite.y + 29;
      //upleft and downright
    } else if (this.Facing === 4 || this.Facing === 8) {
      this.hitbox1.x = this.sprite.x + 58;
      this.hitbox1.y = this.sprite.y + 29;
      this.hitbox2.x = this.sprite.x;
      this.hitbox2.y = this.sprite.y;
    } /* else {
      this.hitbox.x = this.sprite.x - 1;
      this.hitbox.y = this.sprite.y - 3;
    } */
  }
};

module.exports = Monk;

},{}],14:[function(require,module,exports){
var Explorer = require('./explorer');
var Monk = require('./monk');
var TronSoldier = require('./tronSoldier');
var Wizard = require('./wizard');
var Native = require('./native');
var Demon = require('./demon');

var movement = {
  update: function update() {
    // this.game.debug.spriteInfo(this.sprite, 32, 620);
    this.isActive = true;
    if (!this.dieing) {
      //Switching Class
      //Character Classes: Explorer = 0, Monk = 1, Tron Soldier = 2, Wizard = 3, (Big Brawn = 4, Dark = 5)
      if (this.getNewPlayerClass() !== -1 && this.getNewPlayerClass !== this.playerClass) {
        this.setPlayerClass(this.getNewPlayerClass());
      }
      //Basic Movement
      if (this.moveMode === 0) {
        //Running
        this.directions();
        this.basicRunning();
        //Jumping
        this.jumpCond();
        if (this.jumpButton.isDown) {
          this.jumpy();
        }
        if (this.cursors.up.isDown && this.onLadder) {
          this.switchToLadder();
          this.game.time.events.add(150,function(){this.mountingLadder = true;},this);
          if (this.sprite.body.blocked.down) {
            this.sprite.y -= 1;
            this.mountingLadder = false;
          }
        }
      }
      if (this.moveMode === 3) {
        if (this.jumpButton.isDown || !this.onLadder || this.sprite.body.blocked.down) {
          this.switchToNormal();
        }
        this.directions();
        this.climbLadder();
      }
      //Class Movement
      this.classUpdate();
    }
  },
  getNewPlayerClass: function getNewPlayerClass() {
    if (this.class0.isDown && this.playerClass !== 0) {
      return 0;
    }
    if (this.class1.isDown && this.playerClass !== 1) {
      return 1;
    }
    if (this.class2.isDown && this.playerClass !== 2) {
      return 2;
    }
    if (this.class3.isDown && this.playerClass !== 3) {
      return 3;
    }
    if (this.class4.isDown && this.playerClass !== 4) {
      return 4;
    }
    if (this.class5.isDown && this.playerClass !== 5) {
      return 5;
    }
    return -1;
  },
  setPlayerClass: function setPlayerClass (classId) {
    switch (classId) {
      case 0:
        _.extend(this, Explorer);
        this.status = 100;
        break;
      case 1:
        _.extend(this, Monk);
        this.status = 101;
        break;
      case 2:
        _.extend(this, TronSoldier);
        this.status = 102;
        break;
      case 3:
        _.extend(this, Wizard);
        this.status = 103;
      break;
      case 4:
        _.extend(this, Native);
        this.status = 104;
      break;
      case 5:
        _.extend(this, Demon);
        this.status = 105;
      break;
    }

    this.classInit();
  },
  classUpdate: function classUpdate() {
    // placeholder to be overwritten.
  },
  directions: function directions() {
    //Looking UP/RIGHT
    if (this.cursors.right.isDown && this.cursors.up.isDown) {
      this.direction = 2;
    //Looking UP/LEFT
    } else if (this.cursors.left.isDown && this.cursors.up.isDown) {
      this.direction = 4;
    //Looking DOWN/LEFT
    } else if (this.cursors.left.isDown && this.cursors.down.isDown) {
      this.direction = 6;
    //Looking DOWN/RIGHT
    } else if (this.cursors.right.isDown && this.cursors.down.isDown) {
      this.direction = 8;
    //Looking RIGHT
    } else if (this.cursors.right.isDown) {
      this.direction = 1;
    //Looking UP
    } else if (this.cursors.up.isDown) {
      this.direction = 3;
    //Looking LEFT
    } else if (this.cursors.left.isDown) {
      this.direction = 5;
    //Looking DOWN
    } else if (this.cursors.down.isDown) {
      this.direction = 7;
    //Idle
    } else {
      this.direction = 0;
    }
    if (this.direction != 0 && !this.slashing) {
      this.Facing = this.direction;
    }
  },
  basicRunning: function basicRunning() {
    // populate bit Array TEST
    if (this.cursors.left.isDown && this.cursors.right.isDown) {
      this.sprite.body.acceleration.x = 0;
    //Looking UP/RIGHT
    } else if (this.direction === 2) {
      this.moveLR(1, this.sprite);
    //Looking UP/LEFT
    } else if (this.direction === 4) {
      this.moveLR(-1, this.sprite);
    //Looking DOWN/LEFT
    } else if (this.direction === 6) {
      this.moveLR(-1, this.sprite);
    //Looking DOWN/RIGHT
    } else if (this.direction === 8) {
      this.moveLR(1, this.sprite);
    //Looking RIGHT
    } else if (this.direction === 1) {
      this.moveLR(1, this.sprite);
    //Looking UP
    } else if (this.direction === 3) {
      this.decelerate(this.sign(this.sprite.body.velocity.x));
    //Looking LEFT
    } else if (this.direction === 5) {
      this.moveLR(-1, this.sprite);
    //Looking DOWN
    } else if (this.direction === 7) {
      this.decelerate(this.sign(this.sprite.body.velocity.x));
    //Deceleration and Standing Still
    } else {
      this.decelerate(this.sign(this.sprite.body.velocity.x));
    }
  },
  decelerate: function decelerate(sign) {
    var body = this.sprite.body;
    //Sliding Friction
    if(body.onFloor() && (sign*body.velocity.x > this.groundCutoff)) {
       body.acceleration.x = -sign*this.groundFriction;
    }
    //Air Resistance
     else if (!body.onFloor() && sign*body.velocity.x > this.airCutoff) {
      body.acceleration.x = -sign*this.airFriction;
    }
    //Stopping
    else {
      body.velocity.x = 0;
      body.acceleration.x = 0;
    }
    //Animation Standing
    if (body.onFloor && !this.slashing && !this.gliding && !this.dieing) {
      this.sprite.animations.stop();
      this.sprite.frame = 0;
      this.status = 0;
    }
  },
  jumpCond: function jumpCond() {
    if (this.sprite.body.blocked.up) {
      this.jumpWindow = false;
      this.jumpSpeedBonus = 0;
      this.wallWindow = false;
    }
    if (!this.jumpButton.isDown) {
      this.jumpRelease = true;
      if (this.jumpStop) {
        this.jumpStop = false;
        if (this.sprite.body.velocity.y < 0) {
          this.sprite.body.velocity.y = 0;
        }
      }
      if (this.jumpWindow) {
        this.jumpWindow = false;
        this.jumpSpeedBonus = 0;
      }
      if (this.sprite.body.onFloor()) {
        this.bunnyKiller = false;
      }
    }
    if (this.sprite.body.blocked.left && !this.wallJumpL && !this.jumpButton.isDown) {
      this.wallJumpL = true;
      this.game.time.events.remove(this.wallWindow);
      this.wallWindow = this.game.time.events.add(this.wallJumpTime,function(){this.wallJumpL = false;this.wallJumpR = false;},this);
    } else if (this.sprite.body.blocked.right && !this.wallJumpR && !this.jumpButton.isDown) {
      this.wallJumpR = true;
      this.game.time.events.remove(this.wallWindow);
      this.wallWindow = this.game.time.events.add(this.wallJumpTime,function(){this.wallJumpL = false;this.wallJumpR = false;},this);
    }
  },
  jumpy: function jumpy() {
    if ((this.sprite.body.onFloor() && !this.bunnyKiller) || this.jumpWindow) {
      this.jump();
    } else if (this.wallJumpL && this.jumpRelease && this.cursors.right.isDown) {
      this.jump();
      this.wallJumpL = false;
      this.wallJumpR = false;
      this.sprite.body.velocity.x = this.wallJumpBoost;
    } else if (this.wallJumpR && this.jumpRelease && this.cursors.left.isDown) {
      this.jump();
      this.wallJumpL = false;
      this.wallJumpR = false;
      this.sprite.body.velocity.x = -this.wallJumpBoost;
    }
  },
  jump: function jump() {
    this.bunnyKiller = true;
    this.jumpRelease = false;
    this.jumpStop = true;
    if (this.sprite.body.onFloor()) {
      this.jumpSpeedBonus = (Math.abs(this.sprite.body.velocity.x))/this.jumpSpeedCoeff;
      this.jumpWindow = true;
      this.game.time.events.remove(this.jumpWindowTimer);
      this.jumpWindowTimer = this.game.time.events.add(this.jumpAirtime,function(){this.jumpWindow = false;this.jumpSpeedBonus = 0;},this);
    }
    else if (this.wallJumpL) {
      this.jumpWindow = true;
      this.jumpSpeedBonus = this.wallJumpBonus;
      this.game.time.events.remove(this.jumpWindowTimer);
      this.jumpWindowTimer = this.game.time.events.add(this.jumpAirtime,function(){this.jumpWindow = false;this.jumpSpeedBonus = 0;},this);
    }
    else if (this.wallJumpR) {
      this.jumpWindow = true;
      this.jumpSpeedBonus = this.wallJumpBonus;
      this.game.time.events.remove(this.jumpWindowTimer);
      this.jumpWindowTimer = this.game.time.events.add(this.jumpAirtime,function(){this.jumpWindow = false;this.jumpSpeedBonus = 0;},this);
    }
    this.sprite.body.velocity.y = -this.jumpSpeedBase-this.jumpSpeedBonus;
    //Animation Jumping
    if (!this.slashing && !this.gliding) {
      this.sprite.animations.stop();
      if ( this.sprite.body.velocity.x < -1) {
        this.sprite.frame = 11;
        this.status = 4;
      } else if ( this.sprite.body.velocity.x > 1) {
        this.sprite.frame = 1;
        this.status = 5;
      } else {
        this.sprite.frame = 0;
        this.status = 0;
      }
    }
  },
  moveLR: function moveLR(sign){
    var body = this.sprite.body;
    //Braking
    if (sign*body.velocity.x < 0) {
      if (body.onFloor()) {
        body.acceleration.x = sign*this.braking;
      } else {
        body.acceleration.x = sign*Math.max(this.airbraking,sign*this.airbrakeHigh*body.velocity.x);
      }
    //Starting
    } else if (body.onFloor && sign*body.velocity.x < this.boostWindow) {
      body.velocity.x = sign*this.boost;
    //Cruising
    } else {
      if (body.onFloor()) {
        body.acceleration.x = sign*this.runnig;
      } else if (sign*body.velocity.x < this.floatWindow) {
        body.acceleration.x = sign*this.floating;
      } else {
        body.acceleration.x = 0;
      }
    }
    //Animation
    if (body.onFloor() && !this.slashing && !this.gliding && !this.dieing) {
      if (sign === -1) {
        this.sprite.animations.play('left');
        this.status = 2;
      } else {
        this.sprite.animations.play('right');
        this.status = 3;
      }
    } else if (!body.onFloor() && !this.slashing && !this.gliding && !this.dieing) {
      if (sign === -1) {
        this.sprite.frame = 11;
        this.status = 4;
      } else {
        this.sprite.frame = 1;
        this.status = 5;
      }
    }
  },
  //Simple sign function. "sign" is also the parameter for multiple functions here. do not be confused though.
  sign: function sign(x){
    if(x < 0){
      return -1;
    } else {
      return 1;
    }
  },
  switchToNormal: function switchToNormal() {
    this.moveMode = 0;
    this.sprite.body.maxVelocity.y = 500;
    this.sprite.body.allowGravity = true;
    this.tronWindow = true;
    this.mountingLadder = false;
    this.game.time.events.add(500,function(){this.tronWindow = false;},this);
  },
  switchToLadder: function switchToLadder() {
    this.moveMode = 3;
    this.sprite.body.velocity.x = 0;
    this.sprite.body.velocity.y = 0;
    this.sprite.body.acceleration.x = 0;
    this.sprite.body.acceleration.y = 0;
    this.sprite.body.allowGravity = false;
  },
  climbLadder: function climbLadder() {
    var upspeed = 150;
    var downspeed = 150;
    var sidespeed = 75;
    if (!this.mountingLadder) {
      this.sprite.body.velocity.y = 0;
      if (!this.cursors.up.isDown) {
        this.mountingLadder = true;
      }
    }
    if (this.mountingLadder) {
      if (this.direction === 2 || this.direction === 3 || this.direction === 4 ) {
        // moving up
        this.sprite.body.velocity.y = -upspeed;
        this.sprite.animations.play('climb_ladder');
      } else if (this.direction === 6 || this.direction === 7 || this.direction === 8 ) {
        // moving down
        this.sprite.body.velocity.y = downspeed;
        this.sprite.frame = 0;
        this.sprite.animations.play('climb_ladder');
      } else {
        // resting
        this.sprite.body.velocity.y = 0;
      }
    }
    if (this.mountingLadder) {
      if (this.direction === 8 || this.direction === 1 || this.direction === 2 ) {
        // moving right
        this.sprite.body.velocity.x = sidespeed;
        this.sprite.animations.play('climb_ladder');
      } else if (this.direction === 4 || this.direction === 5 || this.direction === 6 ) {
        // moving left
        this.sprite.body.velocity.x = -sidespeed;
        this.sprite.animations.play('climb_ladder');
      } else {
        // resting
        this.sprite.body.velocity.x = 0;
      }
    }
    if (this.sprite.body.velocity.x === 0 && this.sprite.body.velocity.y === 0) {
      this.sprite.animations.stop();
      this.sprite.frame = 30;
    }
  }
};
module.exports = movement;

},{"./demon":11,"./explorer":12,"./monk":13,"./native":15,"./tronSoldier":17,"./wizard":18}],15:[function(require,module,exports){
var Native = {
  playerClass: 4,
  moveMode: 4,
  classInit: function () {
    this.sprite.loadTexture('native', 0);
  },
  classUpdate: function classUpdate() {
    switch (this.moveMode) {
      case 0:
        this.climbingMask();
        if (this.slash.isDown) {
          if (this.climbBoxUR || this.climbBoxUL) {
            this.switchToClimb();
          }
        }
        if (this.specialButton.isDown) {
          if (!this.ladderOnCD) {
            this.spawningLadder = true;
            this.ladderOnCD = true;
            this.game.time.events.add(this.ladderCD,function(){this.ladderOnCD = false;},this);
          }
        }
      break;
      case 2:
        this.climbingMask();
        //Reverting to Normal Movement
        if (!this.slash.isDown || (!this.climbBoxUR && !this.climbBoxUL && !this.climbBoxDL && !this.climbBoxDR)) {
          this.switchToNormal();
        }
        this.directions();
        this.climb();
        //spawning a ladder
        if (this.ladderButton.isDown) {
          if (!this.ladderOnCD) {
            this.ladderSpawn = true;
            this.ladderOnCD = true;
            this.game.time.events.add(this.ladderCD,function(){this.ladderOnCD = false;},this);
          }
        }
      break;
      case 3:
      break;
      default:
        this.moveMode = 0;
      break;
    }
  },
  climbingMask: function climbingMask() {
    this.climbboxUR.x = this.sprite.x+44;
    this.climbboxUR.y = this.sprite.y+25;
    this.climbboxUL.x = this.sprite.x+25;
    this.climbboxUL.y = this.sprite.y+25;
    this.climbboxDL.x = this.sprite.x+25;
    this.climbboxDL.y = this.sprite.y+44;
    this.climbboxDR.x = this.sprite.x+44;
    this.climbboxDR.y = this.sprite.y+44;
  },
  switchToClimb: function switchToClimb() {
    console.log('Switched to Climb');
    this.moveMode = 2;
    this.sprite.body.velocity.x = 0;
    this.sprite.body.velocity.y = 0;
    this.sprite.body.acceleration.x = 0;
    this.sprite.body.acceleration.y = 0;
    this.sprite.body.allowGravity = false;
  },
  climb: function climb() {
    var climbspeed = 125;
    var overhangspeed = 85;
    var shimmyspeed = 175;
    var shaftspeed = 275;
    //Shaft
    if (this.climbBoxUR && this.climbBoxUL && this.climbBoxDL && this.climbBoxDR) {
      this.climbing(shaftspeed, shaftspeed, shaftspeed);
      this.climbingAnimation(0, this.H, this.V);
    } else {
    //Corner Right
      if (this.climbBoxUR && this.climbBoxUL && this.climbBoxDR) {
        this.climbing(overhangspeed, climbspeed, shimmyspeed);
        this.climbingAnimation(1, this.H, this.V);
    //Corner Left
      } else if (this.climbBoxUR && this.climbBoxUL && this.climbBoxDL) {
        this.climbing(overhangspeed, climbspeed, shimmyspeed);
        this.climbingAnimation(1, this.H, this.V);
    //Overhang
      } else if (this.climbBoxUR && this.climbBoxUL) {
        this.climbing(overhangspeed, climbspeed, shimmyspeed);
        this.climbingAnimation(1, this.H, this.V);
    //Wall to the Right
      } else if (this.climbBoxUR && this.climbBoxDR) {
        this.climbing(overhangspeed, climbspeed, shimmyspeed);
        this.climbingAnimation(2, this.H, this.V);
    //Wall to the Left
      } else if (this.climbBoxUL && this.climbBoxDL) {
        this.climbing(overhangspeed, climbspeed, shimmyspeed);
        this.climbingAnimation(3, this.H, this.V);
    //Overhang End Right
      } else if (this.climbBoxUL) {
        this.climbing(overhangspeed, climbspeed, overhangspeed);
        this.climbingAnimation(4, this.H, this.V);
    //Overhang End Left
      } else if (this.climbBoxUR) {
        this.climbing(overhangspeed, climbspeed, overhangspeed);
        this.climbingAnimation(5, this.H, this.V);
    //Wall Top Right
      } else if (this.climbBoxDR) {
        this.climbing(overhangspeed, climbspeed, overhangspeed);
        this.climbingAnimation(2, this.H, this.V);
    //Wall Top Left
      } else if (this.climbBoxDL) {
        this.climbing(overhangspeed, climbspeed, overhangspeed);
        this.climbingAnimation(3, this.H, this.V);
      }
    }
  },
  climbing: function climbing(sidespeed, upspeed, downspeed) {
    if (this.direction === 8 || this.direction === 1 || this.direction === 2 ) {
      // moving right
      this.sprite.body.velocity.x = sidespeed;
      this.H = 1;
    } else if (this.direction === 4 || this.direction === 5 || this.direction === 6 ) {
      // moving left
      this.sprite.body.velocity.x = -sidespeed;
      this.H = -1;
    } else {
      // resting
      this.sprite.body.velocity.x = 0;
      this.H = 0;
    }
    if (this.direction === 2 || this.direction === 3 || this.direction === 4 ) {
      // moving up
      this.sprite.body.velocity.y = -upspeed;
      this.V = -1;
    } else if (this.direction === 6 || this.direction === 7 || this.direction === 8 ) {
      // moving down
      this.sprite.body.velocity.y = downspeed;
      this.V = 1;
    } else {
      // resting
      this.sprite.body.velocity.y = 0;
      this.V = 0;
    }
  },
   climbingAnimation: function climbingAnimation(N, H, V) {
    //Animation Shaft
    if (N === 0) {
      //Climb Down
      if (V === 1) {
        this.sprite.animations.play('climb_ladder');
      //Climb Up
      } else if (V === -1) {
        this.sprite.animations.play('climb_ladder');
      //Climb to the Right
      } else if (H === 1) {
        this.sprite.animations.play('climb_ladder');
      //Climb to the Left
      } else if (H === -1) {
        this.sprite.animations.play('climb_ladder');
      //Hang
      } else {
        this.sprite.frame = 30;
      }
    //Animation Overhang
    } else if (N === 1) {
      //Climb to the Right
      if (H === 1) {
        this.sprite.animations.play('climb_right_overhang');
      //Climb to the Left
      } else if (H === -1) {
        this.sprite.animations.play('climb_left_overhang');
      //Hang
      } else {
        this.sprite.animations.stop();
        this.sprite.frame = 66;
      }
    //Animation Wall Right
    } else if (N === 2) {
      //Climb Down
      if (V === 1) {
        this.sprite.animations.play('climb_right_wall');
      //Climb Up
      } else if (V === -1) {
        this.sprite.animations.play('climb_right_wall');
      //Hang
      } else {
        this.sprite.animations.stop();
        this.sprite.frame = 61;
      }
    //Animation Wall Left
    } else if (N === 3) {
      //Climb Down
      if (V === 1) {
        this.sprite.animations.play('climb_left_wall');
      //Climb Up
      } else if (V === -1) {
        this.sprite.animations.play('climb_left_wall');
      //Hang
      } else {
        this.sprite.animations.stop();
        this.sprite.frame = 71;
      }
    //Animation Overhang End Right
    } else if (N === 4) {
      //Climb Down
      if (V === 1) {
        this.sprite.animations.play('climb_left_wall');
      //Climb Up
      } else if (V === -1) {
        this.sprite.animations.play('climb_left_wall');
      //Hang
      } else {
        this.sprite.animations.stop();
        this.sprite.frame = 74;
      }
    //Animation Overhang End Left
    } else {
      //Climb Down
      if (V === 1) {
        this.sprite.animations.play('climb_right_wall');
      //Climb Up
      } else if (V === -1) {
        this.sprite.animations.play('climb_right_wall');
      //Hang
      } else {
        this.sprite.animations.stop();
        this.sprite.frame = 64;
      }
    }
  }
};

module.exports = Native;
},{}],16:[function(require,module,exports){
var constants = require('./constants');
var basePlayer = require('./basePlayer');
var movement = require('./movement');
var chatWheel = require('./chatwheel');

'use strict';

function Player(game,map) {
  this.map = map;
    this.game = game;
    // input
    this.cursors = null;
    //player
    this.sprite = null;
    this.hitbox1 = null;
    this.hitbox2 = null;
    this.climbboxUR = null;
    this.climbboxUL = null;
    this.climbboxDL = null;
    this.climbboxDR = null;
    this.status = null;
    this.level = null;
    // this.playerAction = null;
    // this.playerMovement = null;
    // this.chatWheel = null;
    this.alive = false;
    this.jumpButton = null;
    this.jumpStop = false;
    this.jumpWindow = false;
    this.bunnyKiller = false;
    this.greetBtn = null;
    this.jumpRelease = false;
    this.doubleJumpCondition = false;
    this.greeting = null;
    this.wallJumpL = false;
    this.wallJumpR = false;
    this.wallWindow = false;
    this.tron = null;
    this.tronWindow = false;
    this.teleport = null;
    this.blocks = null;
    this.climbBoxUR = false;
    this.climbBoxUL = false;
    this.climbBoxDL = false;
    this.climbBoxDR = false;
    this.teleportcd = false;
    this.direction = 1;
    this.Facing = 0;
    this.slash = null;
    this.slashed = false;
    this.slashing = false;
    this.slashTimer = null;
    this.dieing = false;
    this.vuln = false;
    this.invul = false;
    this.vulnTime = 1850;
    this.invultime = 750;
    this.slashTime = 500;
    this.ladderDirection = 1;
    this.ladderCD = 5000;
    this.ladderOnCD = false;
    this.onLadder = false;
    this.mountingLadder = false;
    this.spawningLadder = false;
    this.H = 0;
    this.V = 0;
    this.gliding = false;
    this.playerClass = 0;

    this.jumpWindowTimer = null;
    this.phasebooties = null;

    this.jumpSpeedBonus = 0;
    this.moveMode = 0;
    //All the Balance
    //General Map Data
    this.mapSizex = 640;
    this.tileSizex = 16;
    this.gravity = 750;
    //Teleport
    this.teleportCd = 15000;
    this.teleportRangeX = 320;
    this.teleportRangeY = 160;
    //Deceleration
    this.groundFriction = 950;
    this.airFriction = 0;
    this.groundCutoff = 200;
    this.airCutoff = 5;
    //Running
    this.braking = 1950;
    this.airbraking = 950;
    this.airbrakeHigh = 2;
    this.runnig = 250;
    this.boost = 150;
    this.boostWindow = 100;
    this.floating = 500;
    this.floatWindow = 250;
    //Jumping
    this.jumpSpeedBase = 250;
    this.jumpSpeedCoeff = 7;
    this.jumpAirtime = 500;
    this.wallJumpTime = 150;
    this.wallJumpBoost = 350;
    this.wallJumpBonus = 50;
    // Tron
    this.tronspeed = 700;
    this.tronleft = false;
    this.tronright = false;
    this.tronup = false;
    this.trondown = false;
    this.tronCd = 5000;
    this.tronCool = true;
}

var player = {};

_.extend(player, basePlayer);
_.extend(player, chatWheel);
_.extend(player, movement);

Player.prototype = player;

module.exports = Player;

},{"./basePlayer":8,"./chatwheel":9,"./constants":10,"./movement":14}],17:[function(require,module,exports){
var TronSoldier = {
  playerClass: 2,
  moveMode: 0,
  classInit: function () {
    this.sprite.loadTexture('tron', 0);
  },
  classUpdate: function classUpdate() {
  	switch (this.moveMode) {
  	case 0:
  	  //Switching to Tronmove
	    if (this.tron.isDown) {
	      if (!this.tronWindow && this.tronCool) {
	        this.switchToTron();
	      }
	    }
    break;

    case 1:
      //Tronmove
      //Reverting to Normal Movement
      if (this.tron.isDown  || this.sprite.body.blocked.up
                            || this.sprite.body.blocked.down
                            || this.sprite.body.blocked.left
                            || this.sprite.body.blocked.right) {
        if (!this.tronWindow) {
          this.switchToNormal();
        }
      }
      //Tronmoving
      this.tronMove();
    break;

    case 3:
    break;

    default:
      this.moveMode = 0;
    break;
    }
  },
  switchToTron: function switchToTron() {
    this.sprite.y = this.sprite.y - 16;
    this.moveMode = 1;
    this.sprite.body.velocity.x = 0;
    this.sprite.body.velocity.y = 0;
    this.sprite.body.acceleration.x = 0;
    this.sprite.body.acceleration.y = 0;
    this.sprite.body.allowGravity = false;
    this.sprite.body.maxVelocity.y = this.tronspeed;
    this.tronWindow = true;
    this.tronCool = false;
    this.game.time.events.add(500,function(){this.tronWindow = false;},this);
    this.game.time.events.add(this.tronCd,function(){this.tronCool = true;},this);
    this.tronleft = false;
    this.tronright = false;
    this.tronup = false;
    this.trondown = false;
  },
  tronMove: function tronMove() {
    //LEFT
    if (this.cursors.left.isDown && !this.tronleft) {
      if (!this.cursors.up.isDown && !this.cursors.down.isDown) {
        this.tronMoveL();
      }
    }
    //RIGHT
    else if (this.cursors.right.isDown && !this.tronright) {
      if (!this.cursors.up.isDown && !this.cursors.down.isDown) {
        this.tronMoveR();
      }
    }
    //UP
    else if (this.cursors.up.isDown && !this.tronup) {
      if (!this.cursors.left.isDown && !this.cursors.right.isDown) {
        this.tronMoveU();
      }
    }
    //DOWN
    else if (this.cursors.down.isDown && !this.trondown) {
      if (!this.cursors.left.isDown && !this.cursors.right.isDown) {
        this.tronMoveD();
      }
    }
  },
  tronMoveL: function tronMoveL() {
    this.sprite.frame = 33;
    this.status = 44;
    this.sprite.body.velocity.x = -this.tronspeed;
    this.sprite.body.velocity.y = 0;
    this.sprite.body.acceleration.x = 0;
    this.sprite.body.acceleration.y = 0;
    this.tronleft = true;
    this.tronright = false;
    this.tronup = false;
    this.trondown = false;
  },
  tronMoveR: function tronMoveR() {
    this.sprite.frame = 31;
    this.status = 45;
    this.sprite.body.velocity.x = this.tronspeed;
    this.sprite.body.velocity.y = 0;
    this.sprite.body.acceleration.x = 0;
    this.sprite.body.acceleration.y = 0;
    this.tronleft = false;
    this.tronright = true;
    this.tronup = false;
    this.trondown = false;
  },
  tronMoveU: function tronMoveU() {
    this.sprite.frame = 32;
    this.status = 46;
    this.sprite.body.velocity.y = -this.tronspeed;
    this.sprite.body.velocity.x = 0;
    this.sprite.body.acceleration.x = 0;
    this.sprite.body.acceleration.y = 0;
    this.tronleft = false;
    this.tronright = false;
    this.tronup = true;
    this.trondown = false;
  },
  tronMoveD: function tronMoveD() {
    this.sprite.frame = 30;
    this.status = 47;
    this.sprite.body.velocity.y = this.tronspeed;
    this.sprite.body.velocity.x = 0;
    this.sprite.body.acceleration.x = 0;
    this.sprite.body.acceleration.y = 0;
    this.tronleft = false;
    this.tronright = false;
    this.tronup = false;
    this.trondown = true;
  }
};

module.exports = TronSoldier;

},{}],18:[function(require,module,exports){
var Wizard = {
  playerClass: 3,
  moveMode: 0,
  classInit: function () {
    this.sprite.loadTexture('wizard', 0);
  },
  classUpdate: function classUpdate() {
    switch (this.moveMode) {
      case 0:
        if (this.teleport.isDown && !this.teleportcd) {
          this.teleportLR(this.direction);
        }
      break;
    }
  },
  teleportLR: function teleportLR(z) {
    if (z === 1) {
      this.sprite.x = this.sprite.x + this.teleportRangeX;
    } else if (z === 2){
      this.sprite.y = this.sprite.y - Math.floor(this.teleportRangeY/1.5);
      this.sprite.x = this.sprite.x + Math.floor(this.teleportRangeX/1.5);
    } else if (z === 3){
      this.sprite.y = this.sprite.y - Math.floor(this.teleportRangeY);
    } else if (z === 4){
      this.sprite.y = this.sprite.y - Math.floor(this.teleportRangeY/1.5);
      this.sprite.x = this.sprite.x - Math.floor(this.teleportRangeX/1.5);
    } else if (z === 5){
      this.sprite.x = this.sprite.x - Math.floor(this.teleportRangeX);
    } else if (z === 6){
      this.sprite.y = this.sprite.y + Math.floor(this.teleportRangeY/1.5);
      this.sprite.x = this.sprite.x - Math.floor(this.teleportRangeX/1.5);
    } else if (z === 7){
      this.sprite.y = this.sprite.y + Math.floor(this.teleportRangeY);
    } else {
      this.sprite.y = this.sprite.y + Math.floor(this.teleportRangeY/1.5);
      this.sprite.x = this.sprite.x + Math.floor(this.teleportRangeX/1.5);
    }
    this.teleportcd = true;
    this.game.time.events.add(this.teleportCd,function(){this.teleportcd = false;},this);
  }
};

module.exports = Wizard;

},{}],19:[function(require,module,exports){

'use strict';

function Preloader() {
  this.ready = false;
}

Preloader.prototype = {

  preload: function () {
    this.game.load.image("bg", "assets/bg.png");
    this.game.load.image('tiles-1', 'assets/tiles-1.png');
    this.game.load.image('item', 'assets/item.png');

    this.game.load.image('rope_ladder_top_left', 'assets/rope_ladder/ladder_1.png');
    this.game.load.image('rope_ladder_top', 'assets/rope_ladder/ladder_2.png');
    this.game.load.image('rope_ladder_top_right', 'assets/rope_ladder/ladder_3.png');
    this.game.load.image('rope_ladder_middle', 'assets/rope_ladder/ladder_4.png');
    this.game.load.image('rope_ladder_bottom', 'assets/rope_ladder/ladder_5.png');

    this.game.load.image('vine_top_left', 'assets/vine/ladder_1.png');
    this.game.load.image('vine_top_right', 'assets/vine/ladder_2.png');
    this.game.load.image('vine_middle_left', 'assets/vine/ladder_3.png');
    this.game.load.image('vine_middle_right', 'assets/vine/ladder_4.png');
    this.game.load.image('vine_bottom_left', 'assets/vine/ladder_5.png');
    this.game.load.image('vine_bottom_right', 'assets/vine/ladder_6.png');

    this.game.load.spritesheet('monk_hitbox', 'assets/monk_hitbox.png', 29, 29);
    //
    // this.game.load.spritesheet('monk_slash_rightup', 'assets/monk_slash_rightup.png', 32, 32);
    // this.game.load.spritesheet('monk_slash_leftup', 'assets/monk_slash_leftup.png', 32, 32);
    // this.game.load.spritesheet('monk_slash_leftdown', 'assets/monk_slash_leftdown.png', 32, 32);
    // this.game.load.spritesheet('monk_slash_rightdown', 'assets/monk_slash_rightdown.png', 32, 32);
    //
    // this.game.load.spritesheet('monk_slash_right', 'assets/monk_slash_right.png', 32, 32);
    // this.game.load.spritesheet('monk_slash_up', 'assets/monk_slash_up.png', 32, 32);
    // this.game.load.spritesheet('monk_slash_left', 'assets/monk_slash_left.png', 32, 32);
    // this.game.load.spritesheet('monk_slash_down', 'assets/monk_slash_down.png', 32, 32);


  //  this.game.load.spritesheet('player', 'assets/player.png', 58, 58);
    this.game.load.spritesheet('explorer', 'assets/explorer.png',87, 87);
    this.game.load.spritesheet('wizard', 'assets/wizard.png',87, 87);
    this.game.load.spritesheet('monk', 'assets/monk.png',87, 87);
    this.game.load.spritesheet('tron', 'assets/tron.png', 87,87);
    this.game.load.spritesheet('demon', 'assets/demon.png', 87, 87);
    this.game.load.spritesheet('native', 'assets/native.png', 87, 87);


    this.game.load.spritesheet('enemy', 'assets/enemy.png', 64, 48);
    this.game.load.spritesheet('enemy2', 'assets/enemy2.png', 80, 64);
    //this.game.load.spritesheet('blackdude', 'assets/blackdude.png', 29, 29);
    this.game.load.spritesheet('climbbox', 'assets/climbbox.png', 18, 18);
    this.game.load.image('logo', 'assets/title.png');
    this.ready = true;
  },
  update: function () {
    if (!!this.ready) {
      this.game.state.start('splash');
    }
  }
};

module.exports = Preloader;

},{}],20:[function(require,module,exports){

'use strict';

function Splash() {

}

Splash.prototype = {

  create: function () {
    this.stage.backgroundColor = 0xFFFFFF;

    this.logo = this.add.sprite(this.world.centerX, this.world.centerY, 'logo');
    this.logo.smoothed = true;
    this.logo.anchor.set(0.5, 0.5);
    //this.logo.scale.set(0.5);
    this.logo.alpha = 0;

    this.createTween();
  },
  createTween() {
      var logoTween = this.add.tween(this.logo).to({alpha: 1}, 1000,
          Phaser.Easing.Cubic.In, true, 0, 0, true);

      logoTween.onComplete.add(startGame,this);
      function startGame(){
        this.game.state.start('game');
      }
  }
};

module.exports = Splash;

},{}],21:[function(require,module,exports){
'use strict';

function Survivor(id, game) {
	this.id = id;
	this.game = game;
	this.sprite = null;
	this.lastStatus = 0;
};

Survivor.prototype = {

	create: function (x, y) {
		this.sprite = this.game.survivorGroup.getFirstDead();
		this.sprite = this.game.add.sprite(32, this.game.world.height - 150, 'explorer');
    // adding animations
    this.sprite.animations.add('right', [2,3,4], 10, true);
    this.sprite.animations.add('left', [12,13,14], 10, true);
		this.sprite.animations.add('death', [20,21,22,23,24,25,26,27], 10, false);
		this.sprite.animations.add('monk_slash_rightup', [36,35,37,38,39,36,41,40], 16, true);
		this.sprite.animations.add('monk_slash_leftup', [46,45,47,48,49,46,31,30], 16, true);
		this.sprite.animations.add('monk_slash_leftdown', [40,41,40,34,33,32,30,31], 16, true);
		this.sprite.animations.add('monk_slash_rightdown', [30,31,40,41,30,31,40,41], 16, true);

		this.sprite.animations.add('monk_slash_right', [30,31,40,41,30,31,40,41], 16, true);
		this.sprite.animations.add('monk_slash_up', [34,35,34,33,43,44,43,42], 16, true);
		this.sprite.animations.add('monk_slash_left', [40,41,40,34,33,32,30,31], 16, true);
		this.sprite.animations.add('monk_slash_down', [50,41,60,51,50,41,50,51], 16, true);

		this.sprite.animations.add('climb_right_wall', [30,31,32,33], 12, true);
		this.sprite.animations.add('climb_left_wall', [40,41,42,43], 12, true);

		this.sprite.animations.add('climb_right_overhang', [34,35,36], 12, true);
		this.sprite.animations.add('climb_left_overhang', [44,45,46], 12, true);
		this.sprite.reset(x, y);
		this.game.survivors.push(this);
	},
	update: function() {
		switch (this.sprite.status) {
		case 0: //Idle
  		if(this.lastStatus !== 0){
  			//this.sprite.animations.stop();
  			this.sprite.frame = 4;
  			this.lastStatus = 0;
  		}
		break;
    case 1: //Waving
      if(this.lastStatus !== 1){
        //this.sprite.animations.stop();
        this.sprite.frame = 10;
        this.lastStatus = 1;
      }
    break;
    case 2:
      if(this.lastStatus !== 2){
        //this.sprite.animations.stop();
        this.sprite.animations.play('left');
        this.lastStatus = 2;
      }
    break;
    case 3:
      if(this.lastStatus !== 3){
        //this.sprite.animations.stop();
        this.sprite.animations.play('right');
        this.lastStatus = 3;
      }
    break;
    case 4:
      if(this.lastStatus !== 4){
        //this.sprite.animations.stop();
        this.lastStatus = 4;
      }
    break;
    case 5:
      if(this.lastStatus !== 5){
        //this.sprite.animations.stop();
        this.lastStatus = 5;
      }
    break;
    case 6:
      if(this.lastStatus !== 6){
        //this.sprite.animations.stop();
        this.sprite.animations.play('death');
        this.lastStatus = 6;
      }
    break;
    case 100:
      if (this.lastStatus !== 100) {
        this.sprite.loadTexture('explorer', 0);
      }
    break;
    case 101:
      if (this.lastStatus !== 101) {
        this.sprite.loadTexture('monk', 0);
      }
    break;
    case 102:
      if (this.lastStatus !== 102) {
        this.sprite.loadTexture('tron', 0);
      }
    break;
    case 103:
      if (this.lastStatus !== 103) {
        this.sprite.loadTexture('wizard', 0);
      }
    break;
    case 104:
      if (this.lastStatus !== 104) {
        this.sprite.loadTexture('native', 0);
      }
    break;
    case 105:
      if (this.lastStatus !== 105) {
        this.sprite.loadTexture('demon', 0);
      }
    break;
	  }
  }
};

module.exports = Survivor;

},{}]},{},[6])


//# sourceMappingURL=bundle.js.map