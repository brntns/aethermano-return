var Survivor = require('./survivor');

function Client(game) {
	this.game = game;
	this.socket = null;
	this.isActive = false;
  	this.debug = true;
};

Client.prototype = {
	create: function(){
		//connect to socket
		this.socket = io.connect('http://localhost:8000');
	  //this.socket = io.connect('https://cryptic-springs-1537.herokuapp.com');
		var game = this.game;
		var socket = this.socket;
		//add debug console
    //this.game.add.plugin(Phaser.Plugin.Debug);
		//add player
		this.game.player.create();
		this.game.player.sprite.visible = false;
		//add enemy
		//this.game.enemy.monster.visible = false;
		//socket events
		this.socket.on('playerConnected', function(data){
			game.player.id = data.id;
			game.survivors = [];
		});
		this.socket.on('playerSpawn', function(data){
      //console.log(data);
			game.player.spawn(data.x, data.y,data.level);
			game.player.sprite.visible = true;
			game.player.hitbox.visible = false;
		});
		this.socket.on('monsterSpawns', function(data){
      //console.log(data);
			game.enemy.spawn(data);
			game.enemy.monster.visible = true;
		});
    this.socket.on('playerRepawn', function(data){
      //console.log(data);
      game.player.respawn(data.x, data.y);
      game.player.sprite.visible = true;
      game.win = false;
    });
    this.socket.on('changeLevel', function(data){
      //console.log(data);
      game.player.level = data.level;
			game.map.update(data.map);
      socket.emit('mapUpdated');
    });
		this.socket.on('getMap', function(data,monster,items){
			game.map.create(data);
			game.items.create(items);
      game.enemy.create(monster);
			socket.emit('mapCreated');
		});
		this.socket.on('updateMovement', function(data){
      game.player.mouseMov(data);
		});
		this.socket.on('updatePlayers', function(data){
			_.each(data, function(updateSurvivor){
			console.log(data);
				if(updateSurvivor.id !== game.player.id){
					console.log('test');
					var survivor = _.find(game.survivors, function(s){
						return s.id === updateSurvivor.id;
					});
					if(!survivor){
						//	console.log('no survivor');
						var survivor = new Survivor(updateSurvivor.id, game);
						survivor.create(0,0);
						game.survivors.push(this.survivor);
					} else{
						//	console.log('this survivor');
						survivor.update(data.mov, survivor);
					}

				}
			})

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
  loadnewMap: function(){
    var level = this.game.player.level;
    this.socket.emit('requestLevelChange', level);
  },
	update: function(){
		if(this.game.player.isActive && this.game.player.sprite.visible){
			this.socket.emit('newPlayerPosition', {
				x: this.game.player.sprite.x,
				y: this.game.player.sprite.y,
				status: this.game.player.status,
				level: this.game.player.level
			});
		}
	},
  isInt:function(n) {
   return n % 1 === 0;
  }
};

module.exports = Client;
