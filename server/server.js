var app = require('http').createServer()
	, io = require('socket.io').listen(app, { log: false })
	, fs = require('fs')
	, _ = require('lodash')
	, gameMap = require('./map.js')

//module.exports.game = game;
//module.exports.Map = Map;
var map = new gameMap.Map();

map.create();

app.listen(9005);

var players = [];
var x = 0;
var y = 00;
var tileSize = 32;
var debug = false;

io.sockets.on('connection', function (socket) {
	if(debug)
		var spawnPoint = {x: 400, y:0};
	else
		var spawnPoint = {x: 0, y:0};
	var player = { id: socket.id , x: spawnPoint.x, y: spawnPoint.y };
	var centerTile = {x:-1 , y:-1};
	players.push(player);

	socket.emit('playerConnected', player);
	socket.emit('getMap', map.mapData);
	socket.emit('updatePlayers', players);
	socket.broadcast.emit('updatePlayers', [player]);
	//updateCenterTile(player.x, player.y);


	socket.on('mapCreated', function(){
		socket.emit('playerSpawn', spawnPoint);
	});

	console.log('Player Connected: ', player);

	
	
	function updateCenterTile(x, y){
		var tile = {
			x: parseInt(x / tileSize),
			y: parseInt(y / tileSize)
		};
		if(tile.x !== centerTile.x || tile.y !== centerTile.y){
			socket.emit('updateMap', map.getNewMapUpdate(tile,centerTile));
			centerTile = tile;
			//socket.emit('updateMap', map.getNewTiles(centerTile));
		}
	}



	socket.on('newPlayerPosition', function (data) {
		player.x = data.x;
		player.y = data.y;
		//player.angle = data.angle;
		//player.speed = data.speed;
		//updateCenterTile(player.x, player.y);
		socket.broadcast.emit('updatePlayers', [player]);
	});

	socket.on('disconnect', function () {
		_.remove(players, function(p) { 
			return p.id == player.id; 
		});
		socket.broadcast.emit('removePlayer', player.id);
	});
});
