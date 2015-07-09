var constants = require('./constants');
var basePlayer = require('./basePlayer');
var movement = require('./movement');
var chatWheel = require('./chatwheel');

'use strict';

function Player(game,map) {
  this.map = map;
  this.game = game;
  // input
  this.cursors = null;
  //player
  this.sprite = null;
  this.hitbox = null;
  this.status = null;
  this.level = null;
  // this.playerAction = null;
  // this.playerMovement = null;
  // this.chatWheel = null;
  this.alive = false;
  // this.jumpButton = null;
  this.jumpStop = false;
  this.jumpWindow = false;
  this.bunnyKiller = false;
  // this.greetBtn = null;
  this.jumpRelease = false;
  this.doubleJumpCondition = false;
  this.greeting = null;
  this.wallJumpL = false;
  this.wallJumpR = false;
  this.wallWindow = false;
  this.tron = null;
  this.tronWindow = false;
  this.teleport = null;
  this.blocks = null;
  this.teleportcd = false;
  this.direction = 1;
  this.slash = null;
  this.slashed = false;
  this.slashing = false;
  this.slashTimer = null;
  this.vuln = true;
  this.slashTime = 120;

  this.jumpWindowTimer = null;
  this.phasebooties = null;

  this.jumpSpeedBonus = 0;
  this.moveMode = 0;
  //All the Balance
  //General Map Data
  this.mapSizex = 640;
  this.tileSizex = 16;
  this.gravity = 750;
  //Teleport
  this.teleportCd = 15000;
  this.teleportRangeX = 320;
  this.teleportRangeY = 160;
  //Deceleration
  this.groundFriction = 950;
  this.airFriction = 0;
  this.groundCutoff = 200;
  this.airCutoff = 5;
  //Running
  this.braking = 1950;
  this.airbraking = 950;
  this.airbrakeHigh = 2;
  this.runnig = 250;
  this.boost = 150;
  this.boostWindow = 100;
  this.floating = 500;
  this.floatWindow = 250;
  //Jumping
  this.jumpSpeedBase = 250;
  this.jumpSpeedCoeff = 7;
  this.jumpAirtime = 500;
  this.wallJumpTime = 150;
  this.wallJumpBoost = 350;
  this.wallJumpBonus = 50;
  // Tron
  this.tronspeed = 1000;
  this.tronleft = false;
  this.tronright = false;
  this.tronup = false;
  this.trondown = false;
  this.tronCd = 5000;
  this.tronCool = true;
  this.bitArray = [
    0, // active
    0, // left
    0, // right
    0, // up
    0, // down
    0, // jump
    0, // attack
    0, // special
    0, // chat
    0, // start
    0, // select
    0, // L1
    0, // R1
    0, // L2
    0, // R2
    0, // Item 1
    0, //   |
    0, //   |
    0, //   |
    0, //   |
    0, // Item 2
    0, //   |
    0, //   |
    0, //   |
    0, //   |
    0, // Item 3
    0, //   |
    0, //   |
    0, //   |
    0, //   |
    0, //
    0, //
  ];
}

var player = {};
_.extend(player, movement);
_.extend(player, chatWheel);
_.extend(player, basePlayer);

Player.prototype = player;

module.exports = Player;
