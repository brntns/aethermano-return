'use strict';

function Player(game,map) {
	this.map = map;
	this.game = game;
	this.cursors = null;
	this.sprite = null;
	this.status = null;
	this.alive = false;
	this.jumpButton = null;
	this.bpmText = null;
	this.dodgeWindow = false;
	this.jumpStop = false;
	this.jumpWindow = false;
	this.bunnyKiller = false;
  this.greetBtn = null;
	this.jumpdouble = false;
	this.doubleJumpCondition = false;
  this.greeting = null;
};

Player.prototype = {

	create: function () {

		this.sprite = this.game.add.sprite(32, this.game.world.height - 150, 'dude');

		this.game.physics.arcade.enable(this.sprite);	

	 	this.sprite.animations.add('left', [0, 1, 2, 3], 10, true);
    this.sprite.animations.add('right', [5, 6, 7, 8], 10, true);


		this.game.physics.arcade.gravity.y = 750;

		this.sprite.body.maxVelocity.y = 500;

		this.sprite.body.collideWorldBounds = true;
     
     
    this.sprite.bringToTop();

		this.game.camera.follow(this.sprite);

		this.cursors = this.game.input.keyboard.createCursorKeys();
		this.jumpButton = this.game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
    this.greetBtn = this.game.input.keyboard.addKey(Phaser.Keyboard.H);

    this.greeting = this.game.add.sprite( 0, 0, 'hello');
    this.greeting.bringToTop(this);
    this.greeting.visible = false;
	},
  hello: function(x,y){
        this.greeting.x = x -32;
        this.greeting.y = y -60;  
           this.status = 'hello';
  },
	spawn: function(x, y) {
		if(this.alive)
			return;
		this.alive = true;
		this.sprite.x = x;
		this.sprite.y = y;
	},
	dodgeReset: function() {
		this.dodgeWindow = false;
	},
	jumpReset: function() {
		this.jumpWindow = false;
	},
  moveLR: function(sign){
    var body = this.sprite.body;
    if(sign*body.velocity.x < 0){
      if (body.onFloor()) {
        body.acceleration.x = sign*1950;
      }
      else {
        body.acceleration.x = sign*Math.min(1950,sign*45000/body.velocity.x);
      } 
    }
    else if (sign*body.velocity.x < 100) {
      body.velocity.x = sign*150;
    }
    else {
      if (body.onFloor()) {
        body.acceleration.x = sign*250;
      }
      else if (sign*body.velocity.x < 250){
        body.acceleration.x = sign*200;
      }
      else { 
        body.acceleration.x = 0;
      }  
    }
    //Animation Running Left
    if (body.onFloor()) {
      if (sign = -1){
        this.sprite.animations.play('left');
      }
      else{
        this.sprite.animations.play('right');
      }
    }
  },
	update: function() {
		
    if(this.greetBtn.isDown){
      this.greeting.visible = true;
   
    this.hello(this.sprite.x, this.sprite.y);
    }
     if(this.greetBtn.isUp){
     
       this.greeting.visible = false;
    }
	//Movement
	//Running and Air Control
    //Moving LEFT
    if (this.cursors.left.isDown && this.cursors.right.isDown) {
      this.sprite.body.acceleration = 0;
    }
    else if (this.cursors.left.isDown){
      this.status = 'right';
      moveLR(-1);
    }
    // Moving RIGHT
    else if (this.cursors.right.isDown) {
       this.status = 'right';
       moveLR(1);
    }
  //Deceleration and Standing Still
/*  // Dimestop on DOWN
    else if (this.cursors.down.isDown && this.sprite.body.onFloor()) {
      this.sprite.body.acceleration.x = 0;
      this.sprite.body.velocity.x = 0;
  //Animation Dimestop
      this.sprite.animations.stop();
      this.sprite.frame = 4;
    } */
  //Automatic Deceleration
    else{
      if(this.sprite.body.onFloor()){
      	if(this.sprite.body.velocity.x > 20){
      		this.sprite.body.acceleration.x = -950;
      	}
      	else if(this.sprite.body.velocity.x < -20){
      		this.sprite.body.acceleration.x = 950;
      	}
      	else {
      		this.sprite.body.velocity.x = 0;
      		this.sprite.body.acceleration.x = 0;
      	}
      }
      else{
      	if(this.sprite.body.velocity.x > 5){
      		this.sprite.body.acceleration.x = -0;
      	}
      	else if(this.sprite.body.velocity.x < -5){
      		this.sprite.body.acceleration.x = 0;
      	}
      	else {
      		this.sprite.body.velocity.x = 0;
      		this.sprite.body.acceleration.x = 0;
        }
  	  }
  //Animation Standing
      if (this.sprite.body.onFloor) {
        this.sprite.animations.stop();
        this.sprite.frame = 4;
    
      }
    }

    if (this.sprite.body.blocked.up) {
        this.jumpReset();
    }
    //  Allow the player to jump if they are touching the ground and/or various other conditionals.
    if (this.jumpButton.isDown  
    	 && ((this.sprite.body.onFloor() && !this.bunnyKiller) 
    	   || this.jumpWindow )) {
      this.bunnyKiller = true;
  	  this.jumpDouble = false;	
      this.jumpStop = true;
      this.sprite.body.velocity.y = -250-(Math.abs(this.sprite.body.velocity.x))/7;
      // this.bmpText.destroy();
      if (this.sprite.body.onFloor()) {
      	this.jumpWindow = true;
				this.game.time.events.add(500,this.jumpReset,this);
	    }
      this.sprite.animations.stop();
      if(this.sprite.body.velocity.x < 0){
        this.sprite.frame = 3;
      }
      else if(this.sprite.body.velocity.x > 0){
        this.sprite.frame = 6;
      }
      else {
        this.sprite.frame = 4;
      }
    }

    if (!this.jumpButton.isDown){
    	this.jumpDouble = true;
    	if(this.jumpStop){
    		this.jumpStop = false;
    		if(this.sprite.body.velocity.y<0){
    			this.sprite.body.velocity.y = 0;
    		}
    	}
    	this.jumpReset();
    	if(this.sprite.body.onFloor()){
    		this.bunnyKiller = false;
    	}
    }

  }
	};