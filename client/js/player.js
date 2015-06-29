'use strict';

function Player(game,map) {
	this.map = map;
	this.game = game;
	this.cursors = null;
  this.pad1 = null;
	this.sprite = null;
	this.status = null;
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

  this.teleport = null;
  this.blocks = null;
  this.teleportcd = false;
  this.teleportd = 1;

  this.jumpWindowTimer = null;
  this.phasebooties = null;

}

var playerBase = {
	create: function () {
    // adding player sprite
		this.sprite = this.game.add.sprite(32, this.game.world.height - 150, 'dude');
    // adding physics
		this.game.physics.arcade.enable(this.sprite);
     this.phasebooties = this.game.add.sprite(480,320,'booties');
    // adding animations
	 	this.sprite.animations.add('left', [0, 1, 2, 3], 10, true);
    this.sprite.animations.add('right', [5, 6, 7, 8], 10, true);
    // adding gravity and Player Velocity
		this.game.physics.arcade.gravity.y = 750;
		this.sprite.body.maxVelocity.y = 500;
    // Set World Boundaries and FullscreenMode
    this.game.scale.fullScreenScaleMode = Phaser.ScaleManager.EXACT_FIT;
		this.sprite.body.collideWorldBounds = true;
    // make the camera follow the player
		this.game.camera.follow(this.sprite);
    // Set Input
		this.cursors = this.game.input.keyboard.createCursorKeys();
		this.jumpButton = this.game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
    this.greetBtn = this.game.input.keyboard.addKey(Phaser.Keyboard.H);
    this.teleport = this.game.input.keyboard.addKey(Phaser.Keyboard.T);
    this.fullscreen = this.game.input.keyboard.addKey(Phaser.Keyboard.F);
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
  spawn: function(x, y) {
      if(this.alive){
        return;
      }
      this.alive = true;
      this.sprite.x = x;
      this.sprite.y = y;
    }
};

var player = {};
_.extend(player, movement);
_.extend(player, chatWheel);
_.extend(player, playerBase);

Player.prototype = player;


























