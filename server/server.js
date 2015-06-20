var app = require('http').createServer()
	, io = require('socket.io').listen(app)
	, fs = require('fs')
	, _ = require('lodash')
	, gameMap = require('./map.js')

var map = new gameMap.Map();

map.create();

app.listen(process.env.PORT);

var players = [];
var x = 0;
var y = 0;
var tileSize = 32;
var debug = false;

io.sockets.on('connection', function (socket) {
	if(debug){
			var spawnPoint = {x: 400, y:0};
		}
	else{
		var spawnPoint = {x: 360, y:155, status:'spawn'};
		var player = { id: socket.id , x: spawnPoint.x, y: spawnPoint.y, status: spawnPoint.status};
		players.push(player);
	}

	socket.emit('playerConnected', player);
	socket.emit('getMap', map.mapData);
	socket.emit('updatePlayers', players);
	socket.broadcast.emit('updatePlayers', [player]);

	socket.on('mapCreated', function(){
		socket.emit('playerSpawn', spawnPoint);
	});

	console.log('Player Connected: ', player);

	socket.on('newPlayerPosition', function (data) {
		player.x = data.x;
		player.y = data.y;
		player.status = data.status;

		socket.broadcast.emit('updatePlayers', [player]);
	});

	socket.on('disconnect', function () {
		_.remove(players, function(p) { 
			return p.id == player.id; 
		});
		socket.broadcast.emit('removePlayer', player.id);
	});
});
