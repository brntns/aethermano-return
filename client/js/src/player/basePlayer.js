var basePlayer = {
  create: function () {
    // adding player sprite
    this.sprite = this.game.add.sprite(32, this.game.world.height - 150, 'explorer');
    this.hitbox1 = this.game.add.sprite(32, this.game.world.height - 150, 'monk_hitbox');
    this.hitbox2 = this.game.add.sprite(32, this.game.world.height - 150, 'monk_hitbox');
    this.climbboxUR = this.game.add.sprite(32, this.game.world.height - 150, 'climbbox');
    this.climbboxUL = this.game.add.sprite(32, this.game.world.height - 150, 'climbbox');
    this.climbboxDL = this.game.add.sprite(32, this.game.world.height - 150, 'climbbox');
    this.climbboxDR = this.game.add.sprite(32, this.game.world.height - 150, 'climbbox');
    // adding physics
    this.game.physics.arcade.enable(this.sprite);
    this.game.physics.arcade.enable(this.hitbox1);
    this.game.physics.arcade.enable(this.hitbox2);
    this.game.physics.arcade.enable(this.climbboxUR);
    this.game.physics.arcade.enable(this.climbboxUL);
    this.game.physics.arcade.enable(this.climbboxDL);
    this.game.physics.arcade.enable(this.climbboxDR);
    this.hitbox1.body.allowGravity = false;
    this.hitbox2.body.allowGravity = false;
    this.climbboxUR.body.allowGravity = false;
    this.climbboxUL.body.allowGravity = false;
    this.climbboxDL.body.allowGravity = false;
    this.climbboxDR.body.allowGravity = false;
    // clip size
    this.sprite.body.setSize(29, 29, 29, 29);
    // adding animations
    this.sprite.animations.add('right', [2,3,4], 10, true);
    this.sprite.animations.add('left', [12,13,14], 10, true);
    this.sprite.animations.add('death', [20,21,22,23,24,25,26,27], 10, true);
    this.sprite.animations.add('monk_slash_rightup', [36,35,37,38,39,36,41,40], 16, true);
    this.sprite.animations.add('monk_slash_leftup', [46,45,47,48,49,46,31,30], 16, true);
    this.sprite.animations.add('monk_slash_leftdown', [40,41,40,34,33,32,30,31], 16, true);
    this.sprite.animations.add('monk_slash_rightdown', [30,31,40,41,30,31,40,41], 16, true);

    this.sprite.animations.add('monk_slash_right', [30,31,40,41,30,31,40,41], 16, true);
    this.sprite.animations.add('monk_slash_up', [34,35,34,33,43,44,43,42], 16, true);
    this.sprite.animations.add('monk_slash_left', [40,41,40,34,33,32,30,31], 16, true);
    this.sprite.animations.add('monk_slash_down', [51,41,50,52,51,41,50,52], 16, true);
    //
    // this.hitbox2.animations.add('monk_slash_rightup', [0,1,2,3,4], 50, true);
    // this.hitbox2.animations.add('monk_slash_leftup',  [0,1,2,3,4], 50, true);
    // this.hitbox2.animations.add('monk_slash_leftdown',  [0,1,2,3,4], 50, true);
    // this.hitbox2.animations.add('monk_slash_rightdown', [0,1,2,3,4], 50, true);
    //
    // this.hitbox2.animations.add('monk_slash_right', [1,2,3,4,5], 50, true);
    // this.hitbox2.animations.add('monk_slash_up',  [1,2,3,4,5], 50, true);
    // this.hitbox2.animations.add('monk_slash_left',  [1,2,3,4,5], 50, true);
    // this.hitbox2.animations.add('monk_slash_down', [1,2,3,4,5], 50, true);

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
    this.class4 = this.game.input.keyboard.addKey(Phaser.Keyboard.FOUR);
    this.class5 = this.game.input.keyboard.addKey(Phaser.Keyboard.FIVE);
    this.ladderButton = this.game.input.keyboard.addKey(Phaser.Keyboard.L);
    this.game.scale.fullScreenScaleMode = Phaser.ScaleManager.SHOW_ALL;

    // Set Fullscreen
    this.fullscreen.onDown.add(this.gofull, this);

    //set explorer class.
    this.setPlayerClass(0);
   },
  update: function() {
    // populate bit Array TEST
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
