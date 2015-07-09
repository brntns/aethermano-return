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
