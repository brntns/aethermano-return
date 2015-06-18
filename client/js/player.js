'use strict';

function Player(game,map) {
	this.map = map;
	this.game = game;
	this.cursors = null;
	this.sprite = null;
	this.sprite2 = null;
	this.speed = 120;
	this.alive = false;
};

Player.prototype = {

	create: function () {

		this.sprite = this.game.add.sprite(32, this.game.world.height - 150, 'dude');
		
		this.game.physics.arcade.enable(this.sprite);	
	  this.sprite.animations.add('left', [0, 1, 2, 3], 10, true);
    this.sprite.animations.add('right', [5, 6, 7, 8], 10, true);
		
		this.sprite.body.gravity.y = 300;
		this.sprite.body.collideWorldBounds = true;
		
		this.cursors = this.game.input.keyboard.createCursorKeys();
	},

	spawn: function(x, y) {
		if(this.alive)
			return;
		this.alive = true;
		//console.log(x,y);
		this.sprite.x = 1;
		this.sprite.y = 1;
	},
	update: function() {
		
 		this.sprite.body.velocity.x = 0;

    if (this.cursors.left.isDown){
        //  Move to the left
        this.sprite.body.velocity.x = -150;

        this.sprite.animations.play('left');
    }
    else if (this.cursors.right.isDown) {
        //  Move to the right
        this.sprite.body.velocity.x = 150;

        this.sprite.animations.play('right');
    }
    else{
        //  Stand still
        this.sprite.animations.stop();

        this.sprite.frame = 4;
    }

    //  Allow the player to jump if they are touching the ground.
    if (this.cursors.up.isDown ){
       this.sprite.body.velocity.y = -350;
    }
		
	

	}

};