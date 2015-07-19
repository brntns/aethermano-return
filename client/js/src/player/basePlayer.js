var basePlayer = {
  create: function () {
    // adding player sprite
    this.sprite = this.game.add.sprite(32, this.game.world.height - 150, 'player');
    this.hitbox = this.game.add.sprite(32, this.game.world.height - 150, 'hitbox');
    this.climbboxUR = this.game.add.sprite(32, this.game.world.height - 150, 'climbbox');
    this.climbboxUL = this.game.add.sprite(32, this.game.world.height - 150, 'climbbox');
    this.climbboxDL = this.game.add.sprite(32, this.game.world.height - 150, 'climbbox');
    this.climbboxDR = this.game.add.sprite(32, this.game.world.height - 150, 'climbbox');
    // adding physics
    this.game.physics.arcade.enable(this.sprite);
    this.game.physics.arcade.enable(this.hitbox);
    this.game.physics.arcade.enable(this.climbboxUR);
    this.game.physics.arcade.enable(this.climbboxUL);
    this.game.physics.arcade.enable(this.climbboxDL);
    this.game.physics.arcade.enable(this.climbboxDR);
    this.hitbox.body.allowGravity = false;
    this.climbboxUR.body.allowGravity = false;
    this.climbboxUL.body.allowGravity = false;
    this.climbboxDL.body.allowGravity = false;
    this.climbboxDR.body.allowGravity = false;
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
    this.monsterButton = this.game.input.keyboard.addKey(Phaser.Keyboard.M);
    this.jumpButton = this.game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
    this.greetBtn = this.game.input.keyboard.addKey(Phaser.Keyboard.H);
    this.teleport = this.game.input.keyboard.addKey(Phaser.Keyboard.T);
    this.fullscreen = this.game.input.keyboard.addKey(Phaser.Keyboard.F);
    this.tron = this.game.input.keyboard.addKey(Phaser.Keyboard.R);
    this.slash = this.game.input.keyboard.addKey(Phaser.Keyboard.S);    
    this.class0 = this.game.input.keyboard.addKey(Phaser.Keyboard.ZERO);
    this.class1 = this.game.input.keyboard.addKey(Phaser.Keyboard.ONE);
    this.class2 = this.game.input.keyboard.addKey(Phaser.Keyboard.TWO);
    this.class3 = this.game.input.keyboard.addKey(Phaser.Keyboard.THREE);
    this.ladderButton = this.game.input.keyboard.addKey(Phaser.Keyboard.L);
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
    this.sprite.x = 0;//x;
    this.sprite.y = 0//y;
  },
  spawn: function(x, y,level) {
    this.alive = true;
    this.sprite.x = x;
    this.sprite.y = y;
    this.level = level;
  }
};

module.exports = basePlayer;
