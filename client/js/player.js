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

  this.jumpWindowTimer = null;

}

Player.prototype = {
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
    console.log(this.sprite);
    this.greeting.visible = false;
	},
  hello: function(x,y){
    this.greeting.x = x -32;
    this.greeting.y = y -60;
    this.status = 'hello';
  },
	spawn: function(x, y) {
		if(this.alive){
      return;
    }
		this.alive = true;
		this.sprite.x = x;
		this.sprite.y = y;
	},
  sign: function(x){
    if(x < 0){
      return -1;
    } else {
      return 1;
    }
  },
	dodgeReset: function() {
		this.dodgeWindow = false;
	},
	jumpReset: function() {
		  this.jumpWindow = false;
	},
  wallJumpReset: function() {
    this.wallWindow = false;
  },
  wallReset: function() {
    this.wallJumpL = false;
    this.wallJumpR = false;
  },
  teleportReset: function() {
    this.teleportcd = false;
  },
  moveLR: function(sign){
    var body = this.sprite.body;
    //Braking
    if (sign*body.velocity.x < 0) {
      if (body.onFloor()) {
        body.acceleration.x = sign*1950;
      } else {
        body.acceleration.x = sign*Math.max(950,sign*2*body.velocity.x);
      }
    //Starting
    } else if (body.onFloor && sign*body.velocity.x < 100) {
      body.velocity.x = sign*150;
    //Cruising
    } else {
      if (body.onFloor()) {
        body.acceleration.x = sign*250;
      } else if (sign*body.velocity.x < 250) {
        body.acceleration.x = sign*500;
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
  },
  decelerate: function(sign) {
    var body = this.sprite.body;
    //Sliding Friction
    if(body.onFloor() && (sign*body.velocity.x > 20)) {
      body.acceleration.x = -sign*950;
    }
    //Air Resistance
    else if (!body.onFloor() && sign*body.velocity.x > 5) {
      body.acceleration.x = -sign*0;
    }
    //Stopping
    else if (body.velocity.x != 0) {
      body.velocity.x = 0;
      body.acceleration.x = 0;
    }
    //Animation Standing
    if (body.onFloor) {
      this.sprite.animations.stop();
      this.sprite.frame = 4;
    }
  },
  jump: function() {
    this.bunnyKiller = true;
    this.jumpRelease = false;
    this.jumpStop = true;
    this.sprite.body.velocity.y = -250-(Math.abs(this.sprite.body.velocity.x))/7;
    if (this.sprite.body.onFloor() || this.wallJumpL || this.wallJumpR) {
      this.jumpWindow = true;
      this.game.time.events.remove(this.jumpWindowTimer);
      this.jumpWindowTimer = this.game.time.events.add(500,this.jumpReset,this);
    }
    //Animation Jumping
    this.sprite.animations.stop();
    if (this.sprite.body.velocity.x < -20) {
      this.sprite.frame = 3;
    } else if (this.sprite.body.velocity.x > 20) {
      this.sprite.frame = 1;
    } else {
      this.sprite.frame = 4;
    }
  },
  update: function() {
    this.game.debug.spriteInfo(this.sprite, 32, 620);
      this.isActive = true;
    //Talking
    if (this.greetBtn.isDown) {
      this.greeting.visible = true;
      this.hello(this.sprite.x, this.sprite.y);
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
    else if (this.cursors.left.isDown){
      this.status = 'right';
      this.moveLR(-1);
    }
    // Moving RIGHT
    else if (this.cursors.right.isDown) {
      this.status = 'right';
      this.moveLR(1);
    }
    //Deceleration and Standing Still
    else {
      this.decelerate(this.sign(this.sprite.body.velocity.x));
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
      this.jumpReset();
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
    if (this.teleport.isDown && !this.teleportcd) {
      var playerPosition = this.sprite.x/16+this.sprite.y/16*640;
          this.sprite.x = this.sprite.x + 320;
          this.teleportcd = true;
          this.game.time.events.add(500,this.teleportReset,this);
    }
  }
};



// this.map.tileset.layers[0].data[]
     // for (var i = 0; i < 3; i++) {
        //if (this.map.tileset.layers[0].data[playerPosition+20+640*i] === 0 && this.map.tileset.layers[0].data[playerPosition+21+640*i] === 0 && this.map.tileset.layers[0].data[playerPosition+22+640*i] === 0) {
       // }
    //  }

































