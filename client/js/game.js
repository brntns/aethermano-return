(function() {
	'use strict';

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
	}

	Game.prototype = {

		create: function () {

      this.game.time.advancedTiming = true;
     // console.log(this.game.time);
      this.game.time.desiredFps = 60;
			// enable physics
			this.game.physics.startSystem(Phaser.Physics.ARCADE);
			// creating game components
			this.player = new Player(this.game, this.map);
      this.map = new Map(this.game,this.player, this);
			this.enemy = new Enemy(this.game,this.map,this);
			this.items = new Items(this.game,this.map,this);
			this.client = new Client(this);
			this.client.create();
		},

		update: function () {
			// show Level
    	this.game.debug.text(this.player.level || '', 2, 14, "#ffffff", { font: "30px "} );
      // if player exists
			if(this.player !== null){
        // make player collide
				this.game.physics.arcade.collide(this.player.sprite,this.map.collisionLayer);
				this.game.physics.arcade.collide(this.player.sprite,this.items.item, this.itemCollisionHandler, null, this);
				this.game.physics.arcade.collide(this.enemy.monsters,this.map.collisionLayer);
				this.game.physics.arcade.collide(this.player.sprite,this.enemy.monsters, this.enemyCollisionHandler, null, this);
        // bring player sprite to top
        this.player.sprite.bringToTop();
        // Update the player
				this.player.update();
				//check for windcondition
				if(this.player.sprite.x > this.map.portal.x && this.player.sprite.x < this.map.portal.x +300 && this.player.sprite.y > this.map.portal.y && this.player.sprite.y < this.map.portal.y + 300 && !this.win){
					console.log('CELEBRATE');
					this.win = true;
					this.client.loadnewMap();
				}
			}
      // if client doesnt exist
      if(this.client !== null)
        this.client.update();
		},
		enemyCollisionHandler:function (player, monster) {
			if (this.player.moveMode > 0) {
			 monster.destroy();
			} else {
				this.player.respawn(0, 0);
			}
		},
		itemCollisionHandler:function (player, item) {
			item.destroy();
			this.player.moveMode = 1;
		}
	};

		window['phaser'] = window['phaser'] || {};
		window['phaser'].Game = Game;

}());
