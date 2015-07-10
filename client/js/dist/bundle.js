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

function Client(game) {
	this.game = game;
	this.socket = null;
	this.isActive = false;
  	this.debug = true;
};

Client.prototype = {
	create: function(){
		//connect to socket
		this.socket = io.connect('http://localhost:8000');
	  //this.socket = io.connect('https://cryptic-springs-1537.herokuapp.com');
		var game = this.game;
		var socket = this.socket;
		//add debug console
    //this.game.add.plugin(Phaser.Plugin.Debug);
		//add player
		this.game.player.create();
		this.game.player.sprite.visible = false;
		//add enemy
		//this.game.enemy.monster.visible = false;
		//socket events
		this.socket.on('playerConnected', function(data){
			game.player.id = data.id;
			game.survivors = [];
		});
		this.socket.on('playerSpawn', function(data){
      //console.log(data);
			game.player.spawn(data.x, data.y,data.level);
			game.player.sprite.visible = true;
			game.player.hitbox.visible = false;
		});
		this.socket.on('monsterSpawns', function(data){
      //console.log(data);
			game.enemy.spawn(data);
			game.enemy.monster.visible = true;
		});
    this.socket.on('playerRepawn', function(data){
      //console.log(data);
      game.player.respawn(data.x, data.y);
      game.player.sprite.visible = true;
      game.win = false;
    });
    this.socket.on('changeLevel', function(data){
      //console.log(data);
      game.player.level = data.level;
			game.map.update(data.map);
      socket.emit('mapUpdated');
    });
		this.socket.on('getMap', function(data,monster,items){
			game.map.create(data);
			game.items.create(items);
      game.enemy.create(monster);
			socket.emit('mapCreated');
		});
		this.socket.on('updateMovement', function(data){
      game.player.playerMov(data, game.player.sprite);
		});
		this.socket.on('updatePlayers', function(data){
		//	_.each(data, function(updateSurvivor){
			console.log(data);
				// if(updateSurvivor.id !== game.player.id){
				//	console.log('test');
					// var survivor = _.find(game.survivors, function(s){
					// 	return s.id === updateSurvivor.id;
					// });
					// if(!survivor){
					// 	//	console.log('no survivor');
					// 	var survivor = new Survivor(updateSurvivor.id, game);
					// 	survivor.create(0,0);
					// 	game.survivors.push(this.survivor);
					// } else{
					// 	//	console.log('this survivor');
					// 	survivor.update(data.mov, survivor);
					// }

			//	}
		//	})

		});
		this.socket.on('removePlayer', function(id){
			var player = _.remove(game.survivors, function(player) {
				//console.log(player , id);
				return player.id === id;
			});
			//console.log('removing :' , player);
			if(player.length > 0)
				player[0].sprite.destroy();
		});
	},
  loadnewMap: function(){
    var level = this.game.player.level;
    this.socket.emit('requestLevelChange', level);
  },
	update: function(bits){
		//if(this.game.player.isActive && this.game.player.sprite.visible){
			this.socket.emit('newPlayerPosition', bits);
		//	console.log(bits);
	//	}
	},
  isInt:function(n) {
   return n % 1 === 0;
  }
};

module.exports = Client;

},{"./survivor":14}],3:[function(require,module,exports){
'use strict';

function Enemy(game,map,enemy) {
  this.game = game;
	this.map = map;
  this.monster = enemy;
  this.monsters = null;
  this.running = null;
  this.rng01 = null;
  this.rng02 = null;
};
var enemyBase = {
  create: function (data) {
    //log Data
    //console.log(data);
    this.monsters = this.game.add.group();
    this.monsters.visible = false;
    // add every monster from server
    for (var i = 0; i < data.length; i++) {
      this.monster = this.game.add.sprite(32,48, 'enemy');
      this.monster.physicsType = Phaser.SPRITE;
      this.game.physics.arcade.enable(this.monster);
      this.monster.animations.add('left', [0, 1, 2], 10, true);
      this.monster.animations.play('left');
      this.monster.body.collideWorldBounds = true;
      this.monsters.add(this.monster);
    }
 },
  spawn: function(data) {
    // spawn all monsters
    this.monsters.forEach(function(monster) {
      //choose random spawnpoint
      var spawnPoint = Math.floor((Math.random() * data.length));
      monster.reset = null;
      monster.x = data[spawnPoint].x;
      monster.y = data[spawnPoint].y;
      monster.runleft = this.game.add.tween(monster);
      this.rng01 = Math.random();
      this.rng02 = Math.random();
      monster.runleft
        .to({x:monster.x + this.rng01*450+20}, this.rng02*2000+500)
        .to({x:monster.x }, this.rng02*2000+500)
        .loop()
        .start();
    }, this);
    this.monsters.visible = true;
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
  this.graceTime = 1000;
  this.monsterStun = 1000;
  this.playerStun = 200;
  this.jumpButton = null;
  this.greetBtn = null;
  this.cursors = null;
  this.teleport = null;
  this.fullscreen = null;
  this.tron = null;
  this.slash = null;

}

Game.prototype = {
  create: function () {
    // enable frames manipulation & tracking
    this.game.time.advancedTiming = true;
    // enable physics
    this.game.physics.startSystem(Phaser.Physics.ARCADE);
    // creating game components
    this.player = new Player(this.game, this.map);
    this.map = new Map(this.game,this.player, this);
    this.enemy = new Enemy(this.game,this.map,this);
    this.items = new Items(this.game,this.map,this);
    this.client = new Client(this);
    this.client.create();
    // Set Input
    this.cursors = this.game.input.keyboard.createCursorKeys();
    this.jumpButton = this.game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
    this.teleport = this.game.input.keyboard.addKey(Phaser.Keyboard.T);
    this.fullscreen = this.game.input.keyboard.addKey(Phaser.Keyboard.F);
    this.tron = this.game.input.keyboard.addKey(Phaser.Keyboard.R);
    this.slash = this.game.input.keyboard.addKey(Phaser.Keyboard.S);
    // Set World Boundaries and FullscreenMode
    this.game.scale.fullScreenScaleMode = Phaser.ScaleManager.SHOW_ALL;
    // Set Fullscreen
    this.fullscreen.onDown.add(this.gofull, this);
  },
  gofull: function () {
    // toggle fullscreen
    if (this.game.scale.isFullScreen){
      this.game.scale.stopFullScreen();
    } else {
      this.game.scale.startFullScreen(false);
    }
  },
  update: function () {
    // show Level
      this.game.debug.text(this.player.level || '', 2, 14, "#ffffff", { font: "30px "} );
        // if player exists
    if(this.player !== null){
      if(this.cursors.left.isDown) {
        this.player.bitArray[1] = 1;
      }else{
        this.player.bitArray[1] = 0;
      }
      if(this.cursors.right.isDown) {
        this.player.bitArray[2] = 1;
      }else{
        this.player.bitArray[2] = 0;
      }
      if(this.cursors.up.isDown) {
        this.player.bitArray[3] = 1;
      }else{
        this.player.bitArray[3] = 0;
      }
      if(this.cursors.down.isDown) {
        this.player.bitArray[4] = 1;
      }else{
        this.player.bitArray[4] = 0;
      }
      if(this.jumpButton.isDown) {
        this.player.bitArray[5] = 1;
      }else{
        this.player.bitArray[5] = 0;
      }
      if(this.slash.isDown) {
        this.player.bitArray[6] = 1;
      }else{
        this.player.bitArray[6] = 0;
      }
      if(this.tron.isDown) {
        this.player.bitArray[14] = 1;
      }else{
        this.player.bitArray[14] = 0;
      }
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
    if(this.client !== null) {
      //old movement
      // var bits = {
			// 	x: this.player.sprite.x,
			// 	y: this.player.sprite.y,
      //   status: this.player.status,
      //   level: this.player.level
			// };
      this.buildMov(this.player.bitArray);


    }
  },
  buildMov: function(array){
    var bits = array.join("");
    this.sendMov(bits);
  },
  sendMov: function(bits){
    this.client.update(bits);
  },
  enemyCollisionHandler:function (player, monster) {
    if (this.player.moveMode > 0) {
      monster.destroy();
    } else if (this.player.vuln) {
      this.player.vuln = false;
      this.game.time.events.add(this.graceTime,this.graceReset,this);
      this.player.sprite.body.velocity.x = Math.random()*1200-600;
      this.player.sprite.body.velocity.y = -Math.random()*600;
      //this.player.respawn(0, 0);
    }
  },
  enemySlashingHandler:function (player, monster) {
    if (this.player.slashing) {
      monster.body.velocity.x = Math.random()*1200-600;
      monster.body.velocity.y = -Math.random()*600;
      monster.runleft.pause();
      this.game.time.events.remove(monster.reset);
      monster.reset = this.game.time.events.add(this.monsterStun,function(){this.monsterReset(monster)},this);
    }
  },
  itemCollisionHandler:function (player, item) {
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
    console.log('monster reset');
  }
};

module.exports = Game;

},{"./client":2,"./enemy":3,"./items":5,"./map":7,"./player/player":12}],5:[function(require,module,exports){
'use strict';

function Items(game, map, items) {
  this.items = items;
  this.game = game;

};
var itemBase = {
  create: function (data) {
  //  Log ITEMS
   console.log(data);
   this.item = this.game.add.sprite(600, 600, 'item');
   this.game.physics.arcade.enable(this.item);
   this.item.body.collideWorldBounds = true;
  }
};

var item = {};
_.extend(item, itemBase);

Items.prototype = item;

module.exports = Items;

},{}],6:[function(require,module,exports){
var Boot = require('./boot');
var Game = require('./game');
var Preloader = require('./preloader');

window.onload = function () {
	'use strict';

  window['phaser'] = {};
  window['phaser'].Boot = Boot;
  window['phaser'].Game = Game;
  window['phaser'].Preloader = Preloader;

	var game;
	var ns = window['phaser'];
	game = new Phaser.Game(1024,640, Phaser.AUTO, 'phaser-game');
	game.state.add('boot', ns.Boot);
	game.state.add('preloader', ns.Preloader);
	game.state.add('game', ns.Game);

	game.state.start('boot');
};

},{"./boot":1,"./game":4,"./preloader":13}],7:[function(require,module,exports){
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
    this.maps = data;
    this.setCurrentLevel(this.maps[0],'level1')
		// set background color
		this.game.stage.backgroundColor = '#333333';
		// add player group
		this.myGame.survivorGroup = this.game.add.group();
	//	this.myGame.survivorGroup.createMultiple(100,'player');
	},
	update: function(data) {
    this.maps = data;
    var ll = this.player.level;
    //console.log(ll);
    this.setCurrentLevel(this.maps[ll],'level'+ll);
	},
  setCurrentLevel:function(level,name){
    //console.log(name);
    this.currentMap = level;
    if(this.collisionLayer !== null){
      this.collisionLayer.destroy();
    	console.log('destroyed');
    }
    this.game.load.tilemap(name, null, this.currentMap, Phaser.Tilemap.TILED_JSON );
    this.tileset = this.game.add.tilemap(name);
		//set collision
    this.tileset.setCollisionByExclusion([ 13, 14, 15, 16, 46, 47, 48, 49, 50, 51 ]);
    this.tileset.addTilesetImage('tiles-1');
    //set collisionLayer
    this.collisionLayer = this.tileset.createLayer('Tile Layer 1');
		this.collisionLayer.renderSettings.enableScrollDelta = true;
    this.collisionLayer.resizeWorld();
    this.portal.x = this.currentMap.portalPosx * 16;
    this.portal.y = this.currentMap.portalPosy * 16;
    // console.log('//// PORTAL SPAWNED AT');
    // console.log('//// x:' +(this.currentMap.portalPosx * 16) + 'y:'+ (this.currentMap.portalPosy * 16));
    // console.log('starting game');
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
    this.sprite = this.game.add.sprite(32, this.game.world.height - 150, 'player');
    this.hitbox = this.game.add.sprite(32, this.game.world.height - 150, 'hitbox');
    // adding physics
    this.game.physics.arcade.enable(this.sprite);
    this.game.physics.arcade.enable(this.hitbox);
    this.hitbox.body.allowGravity = false;
    // adding animations
    this.sprite.animations.add('left', [14, 15, 16, 17], 10, true);
    this.sprite.animations.add('right', [8, 9, 10, 11], 10, true);
    // adding gravity and Player Velocity
    this.game.physics.arcade.gravity.y = this.gravity;
    this.sprite.body.maxVelocity.y = 500;
  
    this.sprite.body.collideWorldBounds = true;
    // make the camera follow the player
    this.game.camera.follow(this.sprite);


   },
  update: function() {
    // populate bit Array TEST
    //this.playerMov();
  },
  respawn: function(x, y) {
    this.alive = true;
    this.sprite.x = x;
    this.sprite.y = y;
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
var movement = {
  playerMov: function playerMov(data, sprite) {
    // this.game.debug.spriteInfo(this.sprite, 32, 620);
    // get movement
    //  console.log(sprite);
    if (data) {
      var output = [],
      sNumber = data.toString();
      for (var i = 0, len = sNumber.length; i < len; i += 1) {
          output.push(+sNumber.charAt(i));
      }
      this.mouseMov(output, sprite);
    } else {
      //this.mouseMov();
    }
  },
  mouseMov: function mouseMov(movBits, sprite) {
  //  console.log(movBits);
    //  console.log(sprite);
    // this.game.debug.spriteInfo(this.sprite, 32, 620);
    this.isActive = true;
    //Normal Movement
    if (this.moveMode === 0) {
      this.basicRunning(movBits, sprite);
      this.jumpCond(movBits[5], sprite);
      if (movBits[5] === 1) {
        this.jumpy(movBits,sprite);
        //console.log('jumping');
      }
      //Teleporting
      if (movBits[14] === 1 && !this.teleportcd) {
        this.teleportLR(this.direction, sprite);
      }
      //Switching to Tronmove
      if (movBits[14] === 1) {
        if (!this.tronWindow && this.tronCool) {
          this.switchToTron(sprite);
        }
      }
      //Attacking
      //Slash
      this.slashingDirection(sprite);
      if (movBits[6] === 1) {
        if (!this.slashed) {
          this.slashat(sprite);
          this.slashed = true;
        }
      } else {
        this.slashed = false;
      }
    //Tronmove
    } else if (this.moveMode = 1) {
      this.tronMove(movBits, sprite);
      //Reverting to Normal Movement
      if (movBits[14] === 1 || sprite.body.blocked.up
                            || sprite.body.blocked.down
                            || sprite.body.blocked.left
                            || sprite.body.blocked.right) {
        if (!this.tronWindow) {
          this.switchToNormal(sprite);
        }
      }
    }
  },
  basicRunning: function basicRunning(movBits, sprite) {
    //Normal Running, Jumping and Air Control
    //Skating
    //  console.log(sprite);
    if (movBits[1] === 1 && movBits[2] === 1) {
      sprite.body.acceleration.x = 0;
    //Looking UP/RIGHT
    } else if (movBits[2] === 1 && movBits[3] === 1) {
        this.movBits = 'right';
        this.moveLR(1, sprite);
        this.direction = 2;
    //Looking UP/LEFT
    } else if (movBits[1] === 1 && movBits[3] === 1) {
        this.movBits = 'left';
        this.moveLR(-1, sprite);
        this.direction = 4;
    //Looking DOWN/LEFT
    } else if (movBits[1] === 1 && movBits[4]=== 1) {
        this.movBits = 'left';
        this.moveLR(-1, sprite);
        this.direction = 6;
    //Looking DOWN/RIGHT
    } else if (movBits[2] === 1 && movBits[4] === 1) {
        this.movBits = 'right';
        this.moveLR(1, sprite);
        this.direction = 8;
    //Looking RIGHT
    } else if (movBits[2] === 1) {
        this.movBits = 'right';
        this.moveLR(1, sprite);
        this.direction = 1;
    //Looking UP
    } else if (movBits[3] === 1) {
        this.direction = 3;
        this.decelerate(this.sign(sprite.body.velocity.x),this.sprite);
    //Looking LEFT
    } else if (movBits[1] === 1) {
        this.movBits = 'left';
        this.moveLR(-1, sprite);
        this.direction = 5;
    //Looking DOWN
    } else if (movBits[4] === 1) {
        this.direction = 7;
        this.decelerate(this.sign(sprite.body.velocity.x),this.sprite);
    //Deceleration and Standing Still
    } else {
        this.decelerate(this.sign(sprite.body.velocity.x),sprite);
    }
  },
  decelerate: function decelerate(sign , sprite) {
    //console.log(sprite);
    var body = sprite.body;
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
    if (body.onFloor) {
      sprite.animations.stop();
      sprite.frame = 0;
    }
  },
  jumpCond: function jumpCond(status ,  sprite) {
    if (sprite.body.blocked.up) {
      this.jumpWindow = false;
      this.jumpSpeedBonus = 0;
      this.wallWindow = false;
    }
    if (status !== 1) {
      this.jumpRelease = true;
      if (this.jumpStop) {
        this.jumpStop = false;
        if (sprite.body.velocity.y < 0) {
          sprite.body.velocity.y = 0;
        }
      }
      if (this.jumpWindow) {
        this.jumpWindow = false;
        this.jumpSpeedBonus = 0;
      }
      if (sprite.body.onFloor()) {
        this.bunnyKiller = false;
      }
    }
    if (sprite.body.blocked.left && !this.wallJumpL && status !== 1) {
      this.wallJumpL = true;
      this.game.time.events.remove(this.wallWindow);
      this.wallWindow = this.game.time.events.add(this.wallJumpTime,function(){this.wallJumpL = false;this.wallJumpR = false;},this);
    } else if (sprite.body.blocked.right && !this.wallJumpR && status !== 1) {
      this.wallJumpR = true;
      this.game.time.events.remove(this.wallWindow);
      this.wallWindow = this.game.time.events.add(this.wallJumpTime,function(){this.wallJumpL = false;this.wallJumpR = false;},this);
    }
  },
  jumpy: function jumpy(movBits, sprite) {
    if ((sprite.body.onFloor() && !this.bunnyKiller) || this.jumpWindow) {
       this.jump( sprite);
    } else if (this.wallJumpL && this.jumpRelease && movBits[2] === 1) {
      this.jump( sprite);
      this.wallJumpL = false;
      this.wallJumpR = false;
      sprite.body.velocity.x = this.wallJumpBoost;
    } else if (this.wallJumpR && this.jumpRelease && movBits[1] === 1) {
      this.jump( sprite);
      this.wallJumpL = false;
      this.wallJumpR = false;
      sprite.body.velocity.x = -this.wallJumpBoost;
    }
  },
  jump: function jump( sprite) {
    this.bunnyKiller = true;
    this.jumpRelease = false;
    this.jumpStop = true;
    sprite.body.velocity.y = -this.jumpSpeedBase-this.jumpSpeedBonus;
    if (sprite.body.onFloor()) {
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
    //Animation Jumping
  sprite.animations.stop();
    if ( sprite.body.velocity.x < -20) {
       sprite.frame = 13;
    } else if ( this.sprite.body.velocity.x > 20) {
       sprite.frame = 7;
    } else {
       sprite.frame = 2;
    }
  },
  teleportLR: function teleportLR(z,  sprite) {
    //console.log(sprite);
    if (z === 1) {
      sprite.x = sprite.x + this.teleportRangeX;
    } else if (z === 2){
      sprite.y = sprite.y - Math.floor(this.teleportRangeY/1.5);
    sprite.x = sprite.x + Math.floor(this.teleportRangeX/1.5);
    } else if (z === 3){
    sprite.y = sprite.y - Math.floor(this.teleportRangeY);
    } else if (z === 4){
      sprite.y = sprite.y - Math.floor(this.teleportRangeY/1.5);
    sprite.x = sprite.x - Math.floor(this.teleportRangeX/1.5);
    } else if (z === 5){
    sprite.x = sprite.x - Math.floor(this.teleportRangeX);
    } else if (z === 6){
      sprite.y = sprite.y + Math.floor(this.teleportRangeY/1.5);
      sprite.x = sprite.x - Math.floor(this.teleportRangeX/1.5);
    } else if (z === 7){
      sprite.y = sprite.y + Math.floor(this.teleportRangeY);
    } else {
      sprite.y = sprite.y + Math.floor(this.teleportRangeY/1.5);
      sprite.x = sprite.x + Math.floor(this.teleportRangeX/1.5);
    }
    this.teleportcd = true;
    this.game.time.events.add(this.teleportCd,function(){this.teleportcd = false;},this);
  },
  moveLR: function moveLR(sign,  sprite){
    var body = sprite.body;
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
    if (body.onFloor()) {
      if (sign === -1) {
        sprite.animations.play('left');
      } else {
        sprite.animations.play('right');
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
  slashat: function slashat() {
    this.hitbox.visible = true;
    this.slashing = true;
    this.game.time.events.remove(this.slashTimer);
    this.slashTimer = this.game.time.events.add(this.slashTime,function(){this.hitbox.visible = false;this.slashing = false;},this);
  },
  slashingDirection: function slashingDirection(sprite) {
  //  console.log(sprite);
    if (this.direction == 1) {
      this.hitbox.x = sprite.x + 27;
      this.hitbox.y = sprite.y - 3;
    } else if (this.direction == 2) {
      this.hitbox.x = sprite.x + 27;
      this.hitbox.y = sprite.y - 30;
    } else if (this.direction == 3) {
      this.hitbox.x = sprite.x - 1;
      this.hitbox.y = sprite.y - 30;
    } else if (this.direction == 4) {
      this.hitbox.x = sprite.x - 30;
      this.hitbox.y = sprite.y - 30;
    } else if (this.direction == 5) {
      this.hitbox.x = sprite.x - 30;
      this.hitbox.y = sprite.y - 3;
    } else if (this.direction == 6) {
      this.hitbox.x = sprite.x - 30;
      this.hitbox.y = sprite.y + 30;
    } else if (this.direction == 7) {
      this.hitbox.x = sprite.x - 1;
      this.hitbox.y = this.sprite.y + 31;
    } else {
      this.hitbox.x = sprite.x + 27;
      this.hitbox.y = sprite.y + 31;
    }
  },
  switchToNormal: function switchToNormal(sprite) {
    this.moveMode = 0;
    sprite.body.maxVelocity.y = 500;
    sprite.body.velocity.x = 0;
    sprite.body.velocity.y = 0;
    sprite.body.allowGravity = true;
    this.tronWindow = true;
    this.game.time.events.add(500,function(){this.tronWindow = false;},this);
  },
  switchToTron: function switchToTron(sprite) {
    sprite.y = sprite.y - 16;
    this.moveMode = 1;
    sprite.body.velocity.x = 0;
    sprite.body.velocity.y = 0;
    sprite.body.acceleration.x = 0;
    sprite.body.acceleration.y = 0;
    sprite.body.allowGravity = false;
    sprite.body.maxVelocity.y = this.tronspeed;
    this.tronWindow = true;
    this.tronCool = false;
    this.game.time.events.add(500,function(){this.tronWindow = false;},this);
    this.game.time.events.add(this.tronCd,function(){this.tronCool = true;},this);
    this.tronleft = false;
    this.tronright = false;
    this.tronup = false;
    this.trondown = false;
  },
  tronMove: function tronMove(movBits, sprite) {
    //LEFT
    if (movBits[1] === 1 && !this.tronleft) {
      if (movBits[3] === 0  && movBits[4] === 0) {
        this.tronMoveL(sprite);
      }
    }
    //RIGHT
    else if (movBits[2] === 1 && !this.tronright) {
      if (movBits[3] === 0 && movBits[4] === 0) {
        this.tronMoveR(sprite);
      }
    }
    //UP
    else if (movBits[3] === 1 && !this.tronup) {
      if (movBits[1] === 0 && movBits[2] === 0) {
        this.tronMoveU(sprite);
      }
    }
    //DOWN
    else if (movBits[4] === 1 && !this.trondown) {
      if (movBits[1] === 0 && movBits[2] === 0) {
        this.tronMoveD(sprite);
      }
    }
  },
  tronMoveL: function tronMoveL(sprite) {
    sprite.frame = 6;
    sprite.body.velocity.x = -this.tronspeed;
    sprite.body.velocity.y = 0;
    sprite.body.acceleration.x = 0;
    sprite.body.acceleration.y = 0;
    this.tronleft = true;
    this.tronright = false;
    this.tronup = false;
    this.trondown = false;
  },
  tronMoveR: function tronMoveR(sprite) {
    sprite.frame = 5;
    sprite.body.velocity.x = this.tronspeed;
    sprite.body.velocity.y = 0;
    sprite.body.acceleration.x = 0;
    sprite.body.acceleration.y = 0;
    this.tronleft = false;
    this.tronright = true;
    this.tronup = false;
    this.trondown = false;
  },
  tronMoveU: function tronMoveU(sprite) {
    sprite.frame = 3;
    sprite.body.velocity.y = -this.tronspeed;
    sprite.body.velocity.x = 0;
    sprite.body.acceleration.x = 0;
    sprite.body.acceleration.y = 0;
    this.tronleft = false;
    this.tronright = false;
    this.tronup = true;
    this.trondown = false;
  },
  tronMoveD: function tronMoveD(sprite) {
    sprite.frame = 4;
    sprite.body.velocity.y = this.tronspeed;
    sprite.body.velocity.x = 0;
    sprite.body.acceleration.x = 0;
    sprite.body.acceleration.y = 0;
    this.tronleft = false;
    this.tronright = false;
    this.tronup = false;
    this.trondown = true;
  }
};

module.exports = movement;

},{}],12:[function(require,module,exports){
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
  this.hitbox = null;
  this.status = null;
  this.level = null;
  // this.playerAction = null;
  // this.playerMovement = null;
  // this.chatWheel = null;
  this.alive = false;
  // this.jumpButton = null;
  this.jumpStop = false;
  this.jumpWindow = false;
  this.bunnyKiller = false;
  // this.greetBtn = null;
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
  this.teleportcd = false;
  this.direction = 1;
  this.slash = null;
  this.slashed = false;
  this.slashing = false;
  this.slashTimer = null;
  this.vuln = true;
  this.slashTime = 120;

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
  this.tronspeed = 1000;
  this.tronleft = false;
  this.tronright = false;
  this.tronup = false;
  this.trondown = false;
  this.tronCd = 5000;
  this.tronCool = true;
  this.bitArray = [
    0, // active
    0, // left
    0, // right
    0, // up
    0, // down
    0, // jump
    0, // attack
    0, // special
    0, // chat
    0, // start
    0, // select
    0, // L1
    0, // R1
    0, // L2
    0, // R2
    0, // Item 1
    0, //   |
    0, //   |
    0, //   |
    0, //   |
    0, // Item 2
    0, //   |
    0, //   |
    0, //   |
    0, //   |
    0, // Item 3
    0, //   |
    0, //   |
    0, //   |
    0, //   |
    0, //
    0, //
  ];
}

var player = {};
_.extend(player, movement);
_.extend(player, chatWheel);
_.extend(player, basePlayer);

Player.prototype = player;

module.exports = Player;

},{"./basePlayer":8,"./chatwheel":9,"./constants":10,"./movement":11}],13:[function(require,module,exports){

'use strict';

function Preloader() {
  this.ready = false;
}

Preloader.prototype = {

  preload: function () {
    this.game.load.image('tiles-1', 'assets/tiles-1.png');
    this.game.load.image('item', 'assets/item.png');
    this.game.load.spritesheet('hitbox', 'assets/slashhitbox.png', 32, 32);
    this.game.load.spritesheet('player', 'assets/player.png', 29, 29);
    this.game.load.spritesheet('enemy', 'assets/enemy.png', 64, 48);
    this.game.load.spritesheet('blackdude', 'assets/blackdude.png', 29, 29);
    this.ready = true;
  },
  update: function () {
    if (!!this.ready) {
      this.game.state.start('game');
    }
  }
};

module.exports = Preloader;

},{}],14:[function(require,module,exports){
'use strict';

function Survivor(id, game) {
	this.id = id;
	this.game = game;
	this.sprite = null;
};

Survivor.prototype = {

	create: function (x, y) {
		this.sprite = this.game.survivorGroup.getFirstDead();
		this.sprite = this.game.add.sprite(32, this.game.world.height - 150, 'blackdude');
		this.sprite.reset(x, y);
		// adding player sprite
		this.hitbox = this.game.add.sprite(32, this.game.world.height - 150, 'hitbox');
		// adding physics
		this.game.physics.arcade.enable(this.sprite);
		this.game.physics.arcade.enable(this.hitbox);
		this.hitbox.body.allowGravity = false;
		// adding animations
		this.sprite.animations.add('left', [14, 15, 16, 17], 10, true);
		this.sprite.animations.add('right', [8, 9, 10, 11], 10, true);
		// adding gravity and Player Velocity
		this.game.physics.arcade.gravity.y = this.gravity;
		this.sprite.body.maxVelocity.y = 500;
		// Set World Boundaries and FullscreenMode
		this.game.scale.fullScreenScaleMode = Phaser.ScaleManager.SHOW_ALL;
		this.sprite.body.collideWorldBounds = true;
		// make the camera follow the player
		this.game.survivors.push(this);
	},
	update: function(data, sprite) {
		this.game.player.playerMov(data, sprite);
		// console.log(data);
		// console.log(this.survivor);
	}
};

module.exports = Survivor;

},{}]},{},[6])


//# sourceMappingURL=bundle.js.map