var Survivor = require('./survivor');
var Enemy = require('./enemy');
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
		//debug plugin
    	//this.game.add.plugin(Phaser.Plugin.Debug);
		//add player
		this.game.player.create();
		this.game.player.sprite.visible = false;
		this.game.player.hitbox.visible = false;
		this.game.player.climbboxUR.visible = false;
		this.game.player.climbboxUL.visible = false;
		this.game.player.climbboxDL.visible = false;
		this.game.player.climbboxDR.visible = false;
		//socket events
		this.socket.on('playerConnected', function(data){
			game.player.id = data.id;
			//game.survivors = [];
		});
		this.socket.on('playerSpawn', function(data){
    	//console.log(data);
			game.player.spawn(data.x, data.y,data.level);
			game.player.sprite.visible = true;
		});
    this.socket.on('playerRepawn', function(data){
      //console.log(data);
      game.player.respawn(data.x, data.y);
      game.player.sprite.visible = true;
      game.win = false;
    });

		this.socket.on('updatePlayers', function(data){
			_.each(data, function(updateSurvivor){
					if(updateSurvivor.id !== game.player.id){
						var survivor = _.find(game.survivors, function(s){
							return s.id === updateSurvivor.id;
						});
						if(!survivor){
							var survivor = new Survivor(updateSurvivor.id, game);
							survivor.create(updateSurvivor.x, updateSurvivor.y);
							game.survivors.push(survivor);
						} else{
							survivor.sprite.x = updateSurvivor.x;
							survivor.sprite.y = updateSurvivor.y;
							survivor.sprite.status = updateSurvivor.status;
	            survivor.sprite.level = updateSurvivor.level;
						}
						survivor.update();
					}
				})
		});
		this.socket.on('removePlayer', function(id){
			var player = _.remove(game.survivors, function(player) {
				return player.id === id;
			});
			if(player.length > 0){
				player[0].sprite.destroy();
			}
		});
		// Map
		this.socket.on('changeLevel', function(data){
			game.player.level = data.level;
			game.map.update(data.map);
			socket.emit('mapUpdated');
		});
		this.socket.on('getMap', function(data,items){
			game.map.create(data);
			game.items.create(items);
		//	game.enemy.create(monster);
			socket.emit('mapCreated');
		});
		// Monster Events
		this.socket.on('updateMonsters', function(data){
		// console.log(data);
		// 	console.log(game.monsters);
			if(data.length === undefined){
				var monster = _.find(game.monsters, function(m){
					return m.id === data.id;
				});
				if(!monster){
					console.log('creating monster');
					var monster = new Enemy(data.id, game);
					monster.create(data);
					game.monsters.push(monster);
				} else{
				//	console.log(data);
					monster.sprite.x = data.x;
					monster.sprite.y = data.y;
					monster.sprite.body.velocity.x = data.velox;
					monster.sprite.body.velocity.y = data.veloy;
					monster.hitpoints = data.hp;
				}
			}
			else{
				_.each(data, function(monsterData){
					//console.log(monsterData);
					var monster = _.find(game.monsters, function(m){
						return m.id === monsterData.id;
					});
					if(!monster){
						console.log('creating monster');
						var monster = new Enemy(monsterData.id, game);
						monster.create(monsterData);
						game.monsters.push(monster);
					} else{
						console.log('updating monster')
						monster.sprite.x = monsterData.x;
						monster.sprite.y = monsterData.y;
						monster.sprite.body.velocity.x = monsterData.velox;
						monster.sprite.body.velocity.y = monsterData.veloy;
						monster.sprite.hitpoints = monsterData.hp;
					}
					//monster.update(monsterData);
				})
			}
		});
		this.socket.on('removeMonster', function(id){
			var monster = _.remove(game.monsters, function(m) {
				return m.id === id;
			});
			if(monster.length > 0){
				monster[0].sprite.destroy();
			}
		});

	},
  loadnewMap: function(){
		//console.log(gettingLevel);
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
	updateMonsters: function(monster){
		//console.log(monster);
		if(this.game.player.isActive && this.game.player.sprite.visible){
			this.socket.emit('monsterUpdate', {
				id: monster.id,
				x: monster.x,
				y: monster.y,
				velox: monster.body.velocity.x,
				veloy: monster.body.velocity.y,
				hp: monster.hitpoints
			});
		}
	},
	monsterKilled: function(monster){
		//console.log(monster);
		if(this.game.player.isActive && this.game.player.sprite.visible){
			this.socket.emit('monsterKill', {
				id: monster.id
			});
		}
	},
	monsterSlashed: function(monster){
		console.log(monster);
		if(this.game.player.isActive && this.game.player.sprite.visible){

			this.socket.emit('monsterSlashed', {
				id: monster.id,
				x:monster.x,
				y:monster.y,
				velox: monster.body.velocity.x,
				veloy: monster.body.velocity.y,
				hp: monster.hitpoints
			});
		}
	},
	monsterRequested: function(x,y){
		var spawn = {
			x:x + 50,
			y:y - 50
		};
		this.socket.emit('requestMonster', spawn);
	},
  isInt:function(n) {
   return n % 1 === 0;
  }
};

module.exports = Client;
