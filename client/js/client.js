'use strict';

function Client(game) {
	this.game = game;
	this.socket = null;
	this.isActive = false;
};

Client.prototype = {
	create: function(){
		
		this.socket = io.connect('http://82.119.0.43:8000');
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

		this.socket.on('getMap', function(data){
			game.map.create(data);
			socket.emit('mapCreated');
		});

		this.socket.on('updatePlayers', function(data){
			_.each(data, function(updateSurvivor){
				//dconsole.log('updatedSurvivor :', updateSurvivor);
				if(updateSurvivor.id !== game.player.id){
					var survivor = _.find(game.survivors, function(s){
						return s.id === updateSurvivor.id;
					});
					if(!survivor){
						var survivor = new Survivor(updateSurvivor.id, game) 
						survivor.create(updateSurvivor.x, updateSurvivor.y);
						game.survivors.push(survivor);
					}else{

						survivor.sprite.x = updateSurvivor.x;
						survivor.sprite.y = updateSurvivor.y;
					}
					// survivor.sprite.angle = updateSurvivor.angle;
					// survivor.speed = updateSurvivor.speed;
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
	},

	update: function(){
		if(this.game.player.speed > 0 ){
			this.isActive = true;
			this.socket.emit('newPlayerPosition', {
				x: this.game.player.sprite.x,
				y: this.game.player.sprite.y
			});
		}else if(this.isActive === true){
			this.isActive = false;
			this.socket.emit('newPlayerPosition', {
				x: this.game.player.sprite.x,
				y: this.game.player.sprite.y
			});
		}
	}	
};