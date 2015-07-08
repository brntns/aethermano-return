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
'use strict';

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
		//add debug console
    this.game.add.plugin(Phaser.Plugin.Debug);
		//add player
		this.game.player.create();
		this.game.player.sprite.visible = false;
		// socket events
		this.socket.on('playerConnected', function(data){
			game.player.id = data.id;
			game.survivors = [];
		});
		this.socket.on('playerSpawn', function(data){
      console.log(data);
			game.player.spawn(data.x, data.y,data.level);
			game.player.sprite.visible = true;
		});
    this.socket.on('playerRepawn', function(data){
      console.log(data);
      game.player.respawn(data.x, data.y);
      game.player.sprite.visible = true;
      game.win = false;
    });
    this.socket.on('changeLevel', function(data){
      console.log(data);
      game.player.level = data.level;
			game.map.update(data.map);
      socket.emit('mapUpdated');
    });
		this.socket.on('getMap', function(data, items){
			game.map.create(data);
      game.items.create(items);
			socket.emit('mapCreated');
		});
		this.socket.on('updatePlayers', function(data){
			_.each(data, function(updateSurvivor){
				if(updateSurvivor.id !== game.player.id){
					var survivor = _.find(game.survivors, function(s){
						return s.id === updateSurvivor.id;
					});
					if(!survivor){
						var survivor = new Survivor(updateSurvivor.id, game)
						survivor.create(updateSurvivor.x, updateSurvivor.y,updateSurvivor.status,updateSurvivor.level);
						game.survivors.push(survivor);
					}else{

						survivor.sprite.x = updateSurvivor.x;
						survivor.sprite.y = updateSurvivor.y;
						survivor.sprite.status = updateSurvivor.status;
            survivor.sprite.status = updateSurvivor.level;
					}
					survivor.update();
				}
			})

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
    //this.game.map.update(mapData);
    //his.game.state.start('preloader');
  },
	update: function(){

		if(this.game.player.isActive && this.game.player.sprite.visible){
			//this.isActive = false;
			this.socket.emit('newPlayerPosition', {
				x: this.game.player.sprite.x,
				y: this.game.player.sprite.y,
        status: this.game.player.status,
        level: this.game.player.level
			});
		}
	},
  isInt:function(n) {
   return n % 1 === 0;
  }
};

module.exports = Client;

},{}],3:[function(require,module,exports){
var Items = require('./items');
var Player = require('./player/player');
var Map = require('./map');
var Client = require('./client');

function Game() {
	this.client = null;
	this.player = null;
	this.map = null;
  this.win = false;
  this.items = null;
	this.survivors = [];
	this.survivorGroup = null;
}

Game.prototype = {
	create: function () {

    this.game.time.advancedTiming = true;
   // console.log(this.game.time);
    this.game.time.desiredFps = 60;

		this.game.physics.startSystem(Phaser.Physics.ARCADE);

    this.items = new Items(this.game, this.map, this);
		this.player = new Player(this.game, this.map);
    this.map = new Map(this.game,this.player, this);
		this.client = new Client(this);
		this.client.create();

	},

	update: function () {
    //console.log(this.map.portal.x);
    //  console.log(this.player.sprite.x  +' '+ this.map.portal.x  +' '+this.player.sprite.y +' '+ this.map.portal.y )
    //  this.game.time.fps= 27;
    this.game.debug.text(this.player.level || '--', 2, 14, "#00ff00");
    if(this.player.sprite.x > this.map.portal.x && this.player.sprite.x < this.map.portal.x +300 && this.player.sprite.y > this.map.portal.y && this.player.sprite.y < this.map.portal.y + 300 && !this.win){
      console.log('CELEBRATE');
      this.win = true;
      this.client.loadnewMap();

    }
    // if player exists
		if(this.player !== null){
      // make player collide
			this.game.physics.arcade.collide(this.player.sprite,this.map.collisionLayer);
      // bring player sprite to top
      this.player.sprite.bringToTop();
      // Update the player
			this.player.update();
		}
    // if not
    if(this.client !== null)
      this.client.update();
	},
	render: function () {
	}
};

module.exports = Game;

},{"./client":2,"./items":4,"./map":6,"./player/player":11}],4:[function(require,module,exports){
'use strict';

function Items(game, map, items) {
  this.items = items;
  this.game = game;

};
var itemBase = {
  create: function (data) {
    // Log ITEMS
 //   console.log(data);
  }
};

var item = {};
_.extend(item, itemBase);

Items.prototype = item;

module.exports = Items;

},{}],5:[function(require,module,exports){
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
	var h = window.outerHeight;
	var w = window.outerWidth;
	game = new Phaser.Game(1000,720, Phaser.AUTO, 'phaser-game');
	game.state.add('boot', ns.Boot);
	game.state.add('preloader', ns.Preloader);
	game.state.add('game', ns.Game);

	game.state.start('boot');
};

},{"./boot":1,"./game":3,"./preloader":12}],6:[function(require,module,exports){
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

		this.game.stage.backgroundColor = '#440e62';
		//load map

		// add player Group
		this.myGame.survivorGroup = this.game.add.group();
		this.myGame.survivorGroup.createMultiple(100,'dude');
		//add tilemap


	},

	update: function(data) {
    this.maps = data;
    var ll = this.player.level;
    //console.log(ll);
    this.setCurrentLevel(this.maps[ll],'level'+ll);
	},
  setCurrentLevel:function(level,name){
    console.log(name);
     this.currentMap = level;

     if(  this.collisionLayer !== null){
        this.collisionLayer.destroy();
      console.log('destroyed');
     }

    this.game.load.tilemap(name, null, this.currentMap, Phaser.Tilemap.TILED_JSON );
    this.tileset = this.game.add.tilemap(name);

    this.tileset.setCollisionByExclusion([ 13, 14, 15, 16, 46, 47, 48, 49, 50, 51 ]);
    this.tileset.addTilesetImage('tiles-1');
    //Set collisionLayer
    this.collisionLayer = this.tileset.createLayer('Tile Layer 1');
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

},{}],7:[function(require,module,exports){
var basePlayer = {
  create: function () {
    // adding player sprite
    this.sprite = this.game.add.sprite(32, this.game.world.height - 150, 'dude');
    // adding physics
    this.game.physics.arcade.enable(this.sprite);
    // this.phasebooties = this.game.add.sprite(480,320,'booties');
    // adding animations
    this.sprite.animations.add('left', [0, 1, 2, 3], 10, true);
    this.sprite.animations.add('right', [5, 6, 7, 8], 10, true);
    // adding gravity and Player Velocity
    this.game.physics.arcade.gravity.y = this.gravity;
    this.sprite.body.maxVelocity.y = 500;
    // Set World Boundaries and FullscreenMode
    this.game.scale.fullScreenScaleMode = Phaser.ScaleManager.SHOW_ALL;
    this.sprite.body.collideWorldBounds = true;
    // make the camera follow the player
    this.game.camera.follow(this.sprite);
    // Set Input
    this.cursors = this.game.input.keyboard.createCursorKeys();
    this.jumpButton = this.game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
    this.greetBtn = this.game.input.keyboard.addKey(Phaser.Keyboard.H);
    this.teleport = this.game.input.keyboard.addKey(Phaser.Keyboard.T);
    this.fullscreen = this.game.input.keyboard.addKey(Phaser.Keyboard.F);
    this.tron = this.game.input.keyboard.addKey(Phaser.Keyboard.R);
    // Set Fullscreen
    this.fullscreen.onDown.add(this.gofull, this);
  //  this.level = 'level1';
   },

  update: function() {

   this.mouseMov();

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

    // if(this.alive){
    //   return;
    // }
   // console.log(level);
    this.alive = true;
    this.sprite.x = x;
    this.sprite.y = y;
   // this.level = level;
  },
  spawn: function(x, y,level) {

    // if(this.alive){
    //   return;
    // }
   // console.log(level);
    this.alive = true;
    this.sprite.x = x;
    this.sprite.y = y;
    this.level = level;
  }
};

module.exports = basePlayer;

},{}],8:[function(require,module,exports){
'use strict';

var chatWheel = {

}

module.exports = chatWheel;


},{}],9:[function(require,module,exports){
var Constants = {
    teleport: {
      cd: 15000,
      rangeX: 320,
      rangeY: 160
    }
};

module.exports = Constants;

},{}],10:[function(require,module,exports){
var movement = {
  mouseMov: function mouseMov(){
    // this.game.debug.spriteInfo(this.sprite, 32, 620);
      this.isActive = true;
    //Movement
    if (this.moveMode === 0) {
    //Running and Air Control
    //Skating
    if (this.cursors.left.isDown && this.cursors.right.isDown) {
      this.sprite.body.acceleration.x = 0;
    }
    //Moving LEFT
    else if (this.cursors.left.isDown) {
      this.status = 'right';
      this.moveLR(-1, this.sprite);
      this.teleportd = -1;
    }
    // Moving RIGHT
    else if (this.cursors.right.isDown) {
      this.status = 'right';
      this.moveLR(1, this.sprite);
      this.teleportd = 1;
    }
    else if (this.cursors.up.isDown) {
      this.teleportd = -2;
      this.decelerate(this.sign(this.sprite.body.velocity.x),this.sprite);
    }
    else if (this.cursors.down.isDown) {
      this.teleportd = 2;
      this.decelerate(this.sign(this.sprite.body.velocity.x),this.sprite);
    }
    //Deceleration and Standing Still
    else {
      this.decelerate(this.sign(this.sprite.body.velocity.x),this.sprite);
    }
    //Jumping
    //Jumping Conditional Switches
    if (this.sprite.body.blocked.up) {
      this.jumpReset();
      this.wallJumpReset();
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
        this.jumpReset();
      }
      if (this.sprite.body.onFloor()) {
        this.bunnyKiller = false;
      }
    }
    if (this.sprite.body.blocked.left && !this.wallJumpL && !this.jumpButton.isDown) {
      this.wallJumpL = true;
      this.game.time.events.remove(this.wallWindow);
      this.wallWindow = this.game.time.events.add(this.wallJumpTime,this.wallReset,this);
    } else if (this.sprite.body.blocked.right && !this.wallJumpR && !this.jumpButton.isDown) {
      this.wallJumpR = true;
      this.game.time.events.remove(this.wallWindow);
      this.wallWindow = this.game.time.events.add(this.wallJumpTime,this.wallReset,this);
    }
    //Jumping Action
    if (this.jumpButton.isDown) {
      if ((this.sprite.body.onFloor() && !this.bunnyKiller) || this.jumpWindow) {
         this.jump();
      } else if (this.wallJumpL && this.jumpRelease && this.cursors.right.isDown) {
        this.jump();
        this.wallReset();
        this.sprite.body.velocity.x = this.wallJumpBoost;
      } else if (this.wallJumpR && this.jumpRelease && this.cursors.left.isDown) {
        this.jump();
        this.wallReset();
        this.sprite.body.velocity.x = -this.wallJumpBoost;
      }
    }
    //Teleporting
    if (this.teleport.isDown && !this.teleportcd) {
      this.teleportLR(this.teleportd);
    }
    //Switching to Tronmove
    if (this.tron.isDown) {
      if (!this.tronWindow && this.tronCool) {
        this.moveMode = 1;
        this.sprite.body.velocity.x = 0;
        this.sprite.body.velocity.y = 0;
        this.game.physics.arcade.gravity.y = 0;
        this.sprite.body.maxVelocity.y = this.tronspeed;
        this.tronWindow = true;
        this.tronCool = false;
        this.game.time.events.add(500,this.tronReset,this);
        this.game.time.events.add(this.tronCd,this.tronCdReset,this);
        this.tronleft = false;
        this.tronright = false;
        this.tronup = false;
        this.trondown = false;
      }
    }
    //Tronmove
    } else if (this.moveMode = 1) {
      //LEFT
      if (this.cursors.left.isDown && !this.tronleft) {
        if (!this.cursors.up.isDown && !this.cursors.down.isDown) {
          this.sprite.body.velocity.x = -this.tronspeed;
          this.sprite.body.velocity.y = 0;
          this.sprite.body.acceleration.x = 0;
          this.sprite.body.acceleration.y = 0;
          this.tronleft = true;
          this.tronright = false;
          this.tronup = false;
          this.trondown = false;
        }
      }
      //RIGHT
      else if (this.cursors.right.isDown && !this.tronright) {
        if (!this.cursors.up.isDown && !this.cursors.down.isDown) {
          this.sprite.body.velocity.x = this.tronspeed;
          this.sprite.body.velocity.y = 0;
          this.sprite.body.acceleration.x = 0;
          this.sprite.body.acceleration.y = 0;
          this.tronleft = false;
          this.tronright = true;
          this.tronup = false;
          this.trondown = false;
        }
      }
      //UP
      else if (this.cursors.up.isDown && !this.tronup) {
        if (!this.cursors.left.isDown && !this.cursors.right.isDown) {
          this.sprite.body.velocity.y = -this.tronspeed;
          this.sprite.body.velocity.x = 0;
          this.sprite.body.acceleration.x = 0;
          this.sprite.body.acceleration.y = 0;
          this.tronleft = false;
          this.tronright = false;
          this.tronup = true;
          this.trondown = false;
        }
      }
      //DOWN
      else if (this.cursors.down.isDown && !this.trondown) {
        if (!this.cursors.left.isDown && !this.cursors.right.isDown) {
          this.sprite.body.velocity.y = this.tronspeed;
          this.sprite.body.velocity.x = 0;
          this.sprite.body.acceleration.x = 0;
          this.sprite.body.acceleration.y = 0;
          this.tronleft = false;
          this.tronright = false;
          this.tronup = false;
          this.trondown = true;
        }
      }
      //Reverting to Normal Movement
      if (this.tron.isDown || this.sprite.body.blocked.up || this.sprite.body.blocked.down || this.sprite.body.blocked.left || this.sprite.body.blocked.right) {
        if (!this.tronWindow) {
          this.moveMode = 0;
          this.sprite.body.maxVelocity.y = 500;
          this.sprite.body.velocity.x = 0;
          this.sprite.body.velocity.y = 0;
          this.game.physics.arcade.gravity.y = this.gravity;
          this.tronWindow = true;
          this.game.time.events.add(500,this.tronReset,this);
        }
      }
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
    if (body.onFloor) {
      this.sprite.animations.stop();
      this.sprite.frame = 4;
    }
  },
  jump: function jump() {
    this.bunnyKiller = true;
    this.jumpRelease = false;
    this.jumpStop = true;
    this.sprite.body.velocity.y = -this.jumpSpeedBase-this.jumpSpeedBonus;
    if (this.sprite.body.onFloor()) {
      this.jumpSpeedBonus = (Math.abs(this.sprite.body.velocity.x))/this.jumpSpeedCoeff;
      this.jumpWindow = true;
      this.game.time.events.remove(this.jumpWindowTimer);
      this.jumpWindowTimer = this.game.time.events.add(this.jumpAirtime,this.jumpReset,this);
    }
    else if (this.wallJumpL) {
      this.jumpWindow = true;
      this.jumpSpeedBonus = this.wallJumpBonus;
      this.game.time.events.remove(this.jumpWindowTimer);
      this.jumpWindowTimer = this.game.time.events.add(this.jumpAirtime,this.jumpReset,this);
    }
    else if (this.wallJumpR) {
      this.jumpWindow = true;
      this.jumpSpeedBonus = this.wallJumpBonus;
      this.game.time.events.remove(this.jumpWindowTimer);
      this.jumpWindowTimer = this.game.time.events.add(this.jumpAirtime,this.jumpReset,this);
    }
    //Animation Jumping
    this.sprite.animations.stop();
    if ( this.sprite.body.velocity.x < -20) {
       this.sprite.frame = 3;
    } else if ( this.sprite.body.velocity.x > 20) {
       this.sprite.frame = 1;
    } else {
       this.sprite.frame = 4;
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
  //Resets for various conditions, awkward but required
  dodgeReset: function dodgeReset() {
    this.dodgeWindow = false;
  },
  tronReset: function tronReset() {
    this.tronWindow = false;
  },
  tronCdReset: function tronCdReset() {
    this.tronCool = true;
  },
  jumpReset: function jumpReset() {
    this.jumpWindow = false;
    this.jumpSpeedBonus = 0;
  },
  wallJumpReset: function wallJumpReset() {
    this.wallWindow = false;
  },
  wallReset: function wallReset() {
    this.wallJumpL = false;
    this.wallJumpR = false;
  },
  teleportReset: function teleportReset() {
    this.teleportcd = false;
  },
  teleportLR: function teleporting(sign) {
    if (Math.abs(sign) === 1) {
      this.sprite.x = this.sprite.x + sign*this.teleportRangeX;
    }
    else {
      this.sprite.y = this.sprite.y + 0.5*sign*this.teleportRangeY;
    }
          console.log(this.teleportRangeX);
    this.teleportcd = true;
    this.game.time.events.add(this.teleportCd,this.teleportReset,this);
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
    if (body.onFloor()) {
      if (sign === -1) {
        this.sprite.animations.play('left');
      } else {
        this.sprite.animations.play('right');
      }
    }
  }
};

module.exports = movement;

},{}],11:[function(require,module,exports){
var constants = require('./constants');
var basePlayer = require('./basePlayer');
var movement = require('./movement');
var chatWheel = require('./chatwheel');

'use strict';

function Player(game,map) {
	this.map = map;
	this.game = game;
	this.cursors = null;
  this.pad1 = null;
	this.sprite = null;
	this.status = null;
  this.level = null;
  // this.playerAction = null;
  // this.playerMovement = null;
  // this.chatWheel = null;
	this.alive = false;
	this.jumpButton = null;
	this.dodgeWindow = false;
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
  this.teleportcd = false;
  this.teleportd = 1;

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
  this.teleportCd = constants.teleport.cd;
  this.teleportRangeX = constants.teleport.rangeX;
  this.teleportRangeY = constants.teleport.rangeY;
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
}

var player = {};
_.extend(player, movement);
_.extend(player, chatWheel);
_.extend(player, basePlayer);

Player.prototype = player;

module.exports = Player;

},{"./basePlayer":7,"./chatwheel":8,"./constants":9,"./movement":10}],12:[function(require,module,exports){

'use strict';

function Preloader() {
	this.asset = null;
	this.ready = false;
}

Preloader.prototype = {

	preload: function () {
  	this.game.load.bitmapFont('carrier_command', 'assets/carrier_command.png', 'assets/carrier_command.xml');
  	this.game.load.image('tiles-1', 'assets/tiles-1.png');
  	this.game.load.image('hello', 'assets/hello.png');
  	this.game.load.image('booties','assets/booties.png');
		this.ready = true;
		this.game.load.spritesheet('dude', 'assets/dude.png', 29, 29);
		this.game.load.spritesheet('blackdude', 'assets/blackdude.png', 29, 29);

	},

	create: function () {
	//	this.asset.cropEnabled = false;

	},

	update: function () {
		if (!!this.ready) {
			this.game.state.start('game');
		}
	},

	onLoadComplete: function () {
		this.ready = true;
	}
};

module.exports = Preloader;

},{}]},{},[5])


//# sourceMappingURL=bundle.js.map