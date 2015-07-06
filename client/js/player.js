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
}

var playerBase = {
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
    this.slash = this.game.input.keyboard.addKey(Phaser.Keyboard.S);
    // Set Fullscreen
    this.fullscreen.onDown.add(this.gofull, this);
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

var player = {};
_.extend(player, movement);
_.extend(player, chatWheel);
_.extend(player, playerBase);

Player.prototype = player;
