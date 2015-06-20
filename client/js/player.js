'use strict';

function Player(game,map) {
	this.map = map;
	this.game = game;
	this.cursors = null;
	this.sprite = null;
	this.speed = 120;
	this.alive = false;
	this.jumpButton = null;
	this.bpmText = null;
	this.dodgeWindow = false;
	this.jumpStop = false;
	this.jumpWindow = false;
	this.bunnyKiller = false;

	this.jumpdouble = false;
	this.doubleJumpCondition = false;

};

Player.prototype = {

	create: function () {

		this.sprite = this.game.add.sprite(32, this.game.world.height - 150, 'dude');

		this.game.physics.arcade.enable(this.sprite);	

	 	  	this.sprite.animations.add('left', [0, 1, 2, 3], 10, true);
    	this.sprite.animations.add('right', [5, 6, 7, 8], 10, true);


		this.game.physics.arcade.gravity.y = 750;
		this.sprite.body.maxVelocity.x = 250;
		this.sprite.body.maxVelocity.y = 500;

		this.sprite.body.collideWorldBounds = true;

		this.game.camera.follow(this.sprite);

		this.cursors = this.game.input.keyboard.createCursorKeys();
		this.jumpButton = this.game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);

		this.bmpText = this.game.add.bitmapText(300, 100, 'carrier_command','press space to jump !',18);

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

	update: function() {
			  

	//Movement
	//Running and Air Control
    if (this.cursors.left.isDown){
      if(this.sprite.body.velocity.x > 0){
      	    if (this.sprite.body.onFloor()) {
                  this.sprite.body.acceleration.x = -950;
                }
            else {
                this.sprite.body.acceleration.x = -450;
            }	
      	}
      	else {
      		this.sprite.body.acceleration.x = -250;
  		}
        if (this.sprite.body.onFloor()) {
          this.sprite.animations.play('left');
        }
    }
    else if (this.cursors.right.isDown) {
            if(this.sprite.body.velocity.x < 0){
            if (this.sprite.body.onFloor()) {
                  this.sprite.body.acceleration.x = 950;
                }
            else {
                this.sprite.body.acceleration.x = 450;
            } 
        }
      	else {
      		this.sprite.body.acceleration.x = 250;
  		}
      if (this.sprite.body.onFloor()) {
        this.sprite.animations.play('right');
    }
    }
 /* // Dimestop on DOWN
     else if (this.cursors.down.isDown && this.sprite.body.onFloor()) {
        this.sprite.body.acceleration.x = 0;
        this.sprite.body.velocity.x = 0;
        this.sprite.animations.stop();
        this.sprite.frame = 4;
      } */
    else{
      //  Deceleration and Standing Still
      if(this.sprite.body.onFloor()){

      	if(this.sprite.body.velocity.x > 20){
      		this.sprite.body.acceleration.x = -450;
      	}
      	else if(this.sprite.body.velocity.x < -20){
      		this.sprite.body.acceleration.x = 450;

      	}
      	else {
      		this.sprite.body.velocity.x = 0;
      		this.sprite.body.acceleration.x = 0;
      	}
      }
      else{
      	if(this.sprite.body.velocity.x > 5){
      		this.sprite.body.acceleration.x = -50;
      	}
      	else if(this.sprite.body.velocity.x < -5){
      		this.sprite.body.acceleration.x = 50;
      	}
      	else {
      		this.sprite.body.velocity.x = 0;
      		this.sprite.body.acceleration.x = 0;
        }
  	  }
      if (this.sprite.body.onFloor) {
        this.sprite.animations.stop();
        this.sprite.frame = 4;
      }
    }


    //  Allow the player to jump if they are touching the ground and/or various other conditionals.
    this.doubleJumpCondition = this.jumpDouble && (this.sprite.body.velocity.y<20 && this.sprite.body.velocity.y>-20);
    if 	(
    	this.jumpButton.isDown  
    	&& 	(
    		(
    		this.sprite.body.onFloor() 
    		&& !this.bunnyKiller
    		) 
    		|| this.jumpWindow 
    		|| this.doubleJumpCondition
    		) 
    	) {
      this.bunnyKiller = true;
  	  this.jumpDouble = false;	
      this.jumpStop = true;
      this.sprite.body.velocity.y = -250;
      this.bmpText.destroy();
      if (this.sprite.body.onFloor() || this.doubleJumpCondition) {
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