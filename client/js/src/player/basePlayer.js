var basePlayer = {
  create: function () {
    // adding player sprite
    this.sprite = this.game.add.sprite(32, this.game.world.height - 150, 'explorer');
    //this.sprite.scale.setTo(2);
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
    this.climbboxUR.visible = true;
    this.climbboxUL.visible = true;
    this.climbboxDL.visible = true;
    this.climbboxDR.visible = true;
    // clip size
    this.sprite.anchor.x = 0.5;
    this.sprite.anchor.y = 0.5;
    this.sprite.body.setSize(29,29,0,0);
    // adding animations
    this.sprite.animations.add('right', [2,3,4], 10, true);
    this.sprite.animations.add('left', [12,13,14], 10, true);
    this.sprite.animations.add('death', [20,21,22,23,24,25,26,27], 10, false);
    this.sprite.animations.add('climb_ladder', [30,31,32,30,33,34], 10, true);

    this.sprite.animations.add('monk_slash_rightup', [46,45,47,48,49,46,51,50], 12, true);
    this.sprite.animations.add('monk_slash_leftup', [56,55,57,58,59,56,41,40], 12, true);
    this.sprite.animations.add('monk_slash_leftdown', [50,51,50,44,43,42,40,41], 12, true);
    this.sprite.animations.add('monk_slash_rightdown', [40,41,40,54,53,52,50,51], 12, true);

    this.sprite.animations.add('monk_slash_right', [40,41,40,54,53,52,50,51], 12, true);
    this.sprite.animations.add('monk_slash_up', [44,45,44,43,53,54,53,52], 12, true);
    this.sprite.animations.add('monk_slash_left', [50,51,50,44,43,42,40,41], 12, true);
    this.sprite.animations.add('monk_slash_down', [40,41,50,51,40,41,50,51], 12, true);

    this.sprite.animations.add('explorer_slash_right', [40,41,42,43,44,45,46,47], 16, true);
    this.sprite.animations.add('explorer_slash_left', [50,51,52,53,54,55,56,57], 16, true);

    this.sprite.animations.add('demon_slash_right', [40,41,42,43,44], 12, true);
    this.sprite.animations.add('demon_slash_left', [50,51,52,53,54], 12, true);

    this.sprite.animations.add('wizard_fireball_right', [40,41,42,43,44], 12, false);
    this.sprite.animations.add('wizard_fireball_left', [50,51,52,53,54], 12, false);

    this.sprite.animations.add('teleport_arrival', [65,64,63,62,66,67], 12, false);
    this.sprite.animations.add('teleport_depart', [60,61,62,63,64,65], 12, false);

    this.sprite.animations.add('climb_right_wall', [60,61,62,63], 12, true);
    this.sprite.animations.add('climb_left_wall', [70,71,72,73], 12, true);

    this.sprite.animations.add('climb_right_overhang', [64,65,66], 12, true);
    this.sprite.animations.add('climb_left_overhang', [74,75,76], 12, true);

    this.sprite.animations.add('native_shoot_left', [40,41,40], 12, false);
    this.sprite.animations.add('native_shoot_right', [50,51,50], 12, false);

    this.sprite.animations.add('icemage_fly_left', [16,17,18,19], 12, true);
    this.sprite.animations.add('icemage_fly_right', [6,7,8,9], 12, true);
    this.sprite.animations.add('icemage_cast_right', [40,41,42,43,44,45], 12, false);
    this.sprite.animations.add('icemage_cast_left', [50,51,52,53,54,55], 12, false);

    this.sprite.animations.add('witchdoc_cast_right', [40,41,42,43,44,45,46], 12, false);
    this.sprite.animations.add('witchdoc_cast_left', [50,51,52,53,54,55,56], 12, false);

    this.sprite.animations.add('knight_block_right', [40,41], 12, true);
    this.sprite.animations.add('knight_block_left', [50,51], 12, true);
    this.sprite.animations.add('knight_blocked_right', [40,41], 12, true);
    this.sprite.animations.add('knight_blocked_left', [50,51], 12, true);
    this.sprite.animations.add('knight_charge_right', [40,41], 12, true);
    this.sprite.animations.add('knight_charge_left', [50,51], 12, true);
    this.sprite.animations.add('knight_charging_right', [40,41], 12, true);
    this.sprite.animations.add('knight_charging_left', [50,51], 12, true);

    this.sprite.animations.add('conjurer_cast_right', [40,41,42,43], 12, false);
    this.sprite.animations.add('conjurer_cast_left', [50,51,52,53], 12, false);
    this.sprite.animations.add('conjurer_jumpCast_right', [60,61,62], 12, false);
    this.sprite.animations.add('conjurer_jumpCast_left', [70,71,72], 12, false);
    this.sprite.animations.add('conjurer_jump_right', [63,64,65,66], 12, true);
    this.sprite.animations.add('conjurer_jump_left', [73,74,75,76], 12, true);

    this.sprite.animations.add('jester_throw_right', [40,41,42,43,44], 12, false);
    this.sprite.animations.add('jester_throw_left', [50,51,52,53,54], 12, false);
    this.sprite.animations.add('jester_fart_right', [40,41,42,43,44], 12, false);
    this.sprite.animations.add('jester_fart_left', [50,51,52,53,54], 12, false);

    // adding gravity and Player Velocity
    this.game.physics.arcade.gravity.y = this.gravity;
    this.sprite.body.maxVelocity.y = 500;
    this.sprite.body.collideWorldBounds = true;
    // make the camera follow the player
    this.game.camera.follow(this.sprite,Phaser.FOLLOW_PLATFORMER);
    // this.game.scale.fullScreenScaleMode = Phaser.ScaleManager.SHOW_ALL;

    this.setKeyboardButtons();

    //this.full.onDown.add(this.gofull, this);
    //set explorer class
    this.setPlayerClass(0);
    // this.chatting();
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
