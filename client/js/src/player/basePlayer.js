var basePlayer = {
  create: function () {
    // adding player sprite
    this.sprite = this.game.add.sprite(32, this.game.world.height - 150, 'dude');
    // adding physics
    this.game.physics.arcade.enable(this.sprite);
    // this.phasebooties = this.game.add.sprite(480,320,'booties');
    // adding animations
    this.sprite.animations.add('left', [0, 1, 2, 3], 10, true);
    this.sprite.animations.add('right', [5, 6, 7, 8], 10, true);
    // adding gravity and Player Velocity
    this.game.physics.arcade.gravity.y = this.gravity;
    this.sprite.body.maxVelocity.y = 500;
    // Set World Boundaries and FullscreenMode
    this.game.scale.fullScreenScaleMode = Phaser.ScaleManager.SHOW_ALL;
    this.sprite.body.collideWorldBounds = true;
    // make the camera follow the player
    this.game.camera.follow(this.sprite);
    // Set Input
    this.cursors = this.game.input.keyboard.createCursorKeys();
    this.jumpButton = this.game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
    this.greetBtn = this.game.input.keyboard.addKey(Phaser.Keyboard.H);
    this.teleport = this.game.input.keyboard.addKey(Phaser.Keyboard.T);
    this.fullscreen = this.game.input.keyboard.addKey(Phaser.Keyboard.F);
    this.tron = this.game.input.keyboard.addKey(Phaser.Keyboard.R);
    // Set Fullscreen
    this.fullscreen.onDown.add(this.gofull, this);
  //  this.level = 'level1';
   },

  update: function() {

   this.mouseMov();

  },
  gofull: function () {
    // toggle fullscreen
    if (this.game.scale.isFullScreen){
      this.game.scale.stopFullScreen();
    } else {
      this.game.scale.startFullScreen(false);
    }
  },
  respawn: function(x, y) {

    // if(this.alive){
    //   return;
    // }
   // console.log(level);
    this.alive = true;
    this.sprite.x = x;
    this.sprite.y = y;
   // this.level = level;
  },
  spawn: function(x, y,level) {

    // if(this.alive){
    //   return;
    // }
   // console.log(level);
    this.alive = true;
    this.sprite.x = x;
    this.sprite.y = y;
    this.level = level;
  }
};

module.exports = basePlayer;
