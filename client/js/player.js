'use strict';

function Player(game,map) {
	this.map = map;
	this.game = game;
	this.cursors = null;
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

}

var playerBase = {
	create: function () {
    // adding player sprite
		this.sprite = this.game.add.sprite(32, this.game.world.height - 150, 'dude');
    // adding physics
		this.game.physics.arcade.enable(this.sprite);
    // adding animations
	 	this.sprite.animations.add('left', [0, 1, 2, 3], 10, true);
    this.sprite.animations.add('right', [5, 6, 7, 8], 10, true);
    // adding gravity and Player Velocity
		this.game.physics.arcade.gravity.y = 750;
		this.sprite.body.maxVelocity.y = 500;
    // Set World Boundaries
		this.sprite.body.collideWorldBounds = true;
    // make the camera follow the player
		this.game.camera.follow(this.sprite);
    // Set Input
		this.cursors = this.game.input.keyboard.createCursorKeys();
		this.jumpButton = this.game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
    this.greetBtn = this.game.input.keyboard.addKey(Phaser.Keyboard.H);
    this.teleport = this.game.input.keyboard.addKey(Phaser.Keyboard.T);
    // Set Hello Message
    this.greeting = this.game.add.sprite( 0, 0, 'hello');
    // Bring Message to top NOT WORKING
    this.greeting.bringToTop();
    console.log(this.map)
  //  console.log(this.sprite);
    this.greeting.visible = false;
	},

	spawn: function(x, y) {
		if(this.alive){
      return;
    }
		this.alive = true;
		this.sprite.x = x;
		this.sprite.y = y;
	},

  update: function() {
    // if(this.sprite.x === this.map.mapData.portalPosx && this.sprite.x === this.map.mapData.portalPosy ){
    //   console.log('CELEBRATE');
    // }
    this.game.debug.spriteInfo(this.sprite, 32, 620);
      this.isActive = true;
    //Talking
    if (this.greetBtn.isDown) {
      this.greeting.visible = true;
      hello(this.sprite.x, this.sprite.y);
    }
    if (this.greetBtn.isUp) {
      this.greeting.visible = false;
    }
    //Movement
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
        if (this.sprite.body.velocity.y<0) {
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
      this.wallWindow = this.game.time.events.add(150,this.wallReset,this);
    } else if (this.sprite.body.blocked.right && !this.wallJumpR && !this.jumpButton.isDown) {
      this.wallJumpR = true;
      this.game.time.events.remove(this.wallWindow);
      this.wallWindow = this.game.time.events.add(150,this.wallReset,this);
    }
    //Jumping Action
    if (this.jumpButton.isDown) {
      if ((this.sprite.body.onFloor() && !this.bunnyKiller) || this.jumpWindow) {
         this.jump();
      } else if (this.wallJumpL && this.jumpRelease && this.cursors.right.isDown) {
        this.jump();
        this.wallReset();
        this.sprite.body.velocity.x = 350;
      } else if (this.wallJumpR && this.jumpRelease && this.cursors.left.isDown) {
        this.jump();
        this.wallReset();
        this.sprite.body.velocity.x = -350;
      }
    }
    //Teleporting
    if (this.teleport.isDown && !this.teleportcd) {
      this.teleportLR(this.teleportd);
    }
  }
};

var player = {};
_.extend(player, movement);
_.extend(player, chatWheel);
_.extend(player, playerBase);

Player.prototype = player;


























