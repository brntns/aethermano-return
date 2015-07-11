var basePlayer = {
  create: function () {
    // adding player sprite
    this.sprite = this.game.add.sprite(32, this.game.world.height - 150, 'player');
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

    this.sprite.body.collideWorldBounds = true;
    // make the camera follow the player
    this.game.camera.follow(this.sprite,Phaser.FOLLOW_PLATFORMER);
    this.cursors = this.game.input.keyboard.createCursorKeys();
   this.jumpButton = this.game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
   this.greetBtn = this.game.input.keyboard.addKey(Phaser.Keyboard.H);
   this.teleport = this.game.input.keyboard.addKey(Phaser.Keyboard.T);
   this.fullscreen = this.game.input.keyboard.addKey(Phaser.Keyboard.F);
   this.tron = this.game.input.keyboard.addKey(Phaser.Keyboard.R);
   this.slash = this.game.input.keyboard.addKey(Phaser.Keyboard.S);
   this.game.scale.fullScreenScaleMode = Phaser.ScaleManager.SHOW_ALL;

   // Set Fullscreen
   this.fullscreen.onDown.add(this.gofull, this);
   },
  update: function() {
    // populate bit Array TEST
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
    this.alive = true;
    this.sprite.x = x;
    this.sprite.y = y;
  },
  spawn: function(x, y,level) {
    this.alive = true;
    this.sprite.x = x;
    this.sprite.y = y;
    this.level = level;
  }
};

module.exports = basePlayer;
