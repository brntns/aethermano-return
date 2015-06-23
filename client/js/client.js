'use strict';

function Client(game) {
	this.game = game;
	this.socket = null;
	this.isActive = false;
  this.debug = true;
};

Client.prototype = {
	create: function(){


		this.socket = io.connect('http://localhost:8000');

		//this.socket = io.connect('https://cryptic-springs-1537.herokuapp.com');

		var game = this.game;
		var socket = this.socket;

		this.game.player.create();
		this.game.player.sprite.visible = false;

		this.socket.on('playerConnected', function(data){
			game.player.id = data.id;
			game.survivors = [];
		});

		this.socket.on('playerSpawn', function(data){
			game.player.spawn(data.x, data.y);
			game.player.sprite.visible = true;
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
						survivor.create(updateSurvivor.x, updateSurvivor.y,updateSurvivor.status);
						game.survivors.push(survivor);
					}else{

						survivor.sprite.x = updateSurvivor.x;
						survivor.sprite.y = updateSurvivor.y;
						survivor.sprite.status = updateSurvivor.status;
					}
					survivor.update();
				}
			})

		});

		this.socket.on('updateMap', function(mapData){
			game.map.update(mapData);
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
   // console.log(this.game.player);
	},

	update: function(){

		if(this.game.player.isActive && this.game.player.sprite.visible){
			//this.isActive = false;
			this.socket.emit('newPlayerPosition', {
				x: this.game.player.sprite.x,
				y: this.game.player.sprite.y,
        status: this.game.player.status
			});
		}
	},
  isInt:function(n) {
   return n % 1 === 0;
  }
};
