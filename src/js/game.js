(function() {
  'use strict';

  function Game() {

      var playerSpeed = 150;
      var bulletXSpeed = 3;
      var enemySpeed = 70;
      var player;
      var platformGroup;
      var onPlatform = false;
      var readyToFire = false;
      var ground;
      var ledge;
      var cursors;


  }


  Game.prototype = {
    preload: function () {
      this.game.load.image('menu_background', 'assets/player.png');
      this.game.load.audio('theme','assets/theme.mp3');
      this.game.load.image('platform180','assets/platform180.png');
      this.game.load.image('platform120','assets/platform120.png');
      this.game.load.spritesheet('dude', 'assets/dude.png', 32, 48);
      this.game.load.image('ground','assets/ground.png');
      this.game.load.image('bullet','assets/bullet.png');
      this.game.load.image('enemy','assets/enemy.png');

    },
    create: function () {
      this.input.onDown.add(this.onInputDown, this);
    
    


      this.theme = this.game.add.audio('theme');
     // this.theme.loopFull();
        //  We're going to be using physics, so enable the Arcade Physics system
      this.game.physics.startSystem(Phaser.Physics.ARCADE);

      //  A simple background for our game
      this.game.add.tileSprite(0, 0, this.game.world.width, this.game.world.height, 'menu_background');

      var text = this.add.text(this.game.width * 0.9, 50,
        'Menu', {font: '15px Arial', fill: '#ffffff', align: 'right'
      });
      
      var tipp = this.add.text(this.game.width * 0.5, this.game.height * 0.3,
        'Welcome Stranger, image a place…', {font: '22px Arial', fill: '#ffffff', align: 'right'
      });
     tipp.anchor.set(0.5);
    
      //  The platforms group contains the ground and the 2 ledges we can jump on
      this.platforms = this.game.add.group();

      //  We will enable physics for any object that is created in this group
      this.platforms.enableBody = true;

      // Here we create the ground.
      this.ground = this.platforms.create(0, this.game.world.height - 64, 'ground');

      //  Scale it to fit the width of the game (the original sprite is 400x32 in size)
      this.ground.scale.setTo(10, 1);

      //  This stops it from falling away when you jump on it
      this.ground.body.immovable = true;

      //  Now let's create four ledges
      this.ledge = this.platforms.create(400, 600, 'ground');

      this.ledge.body.immovable = true;

      this.ledge = this.platforms.create(0, 450, 'ground');

      this.ledge.body.immovable = true;

      this.ledge = this.platforms.create(400, 350, 'ground');

      this.ledge.body.immovable = true;

      this.ledge = this.platforms.create(0, 150, 'ground');

      this.ledge.body.immovable = true;

       // The player and its settings
      this.player = this.game.add.sprite(32, this.game.world.height - 150, 'dude');

      //  We need to enable physics on the player
       this.game.physics.arcade.enable(this.player);

      //  Player physics properties. Give the little guy a slight bounce.
       this.player.body.bounce.y = 0.3;
       this.player.body.gravity.y = 300;
       this.player.body.collideWorldBounds = true;

      //  Our two animations, walking left and right.
       this.player.animations.add('left', [0, 1, 2, 3], 10, true);
       this.player.animations.add('right', [5, 6, 7, 8], 10, true);

      
      
    },

    update: function () {
      //  Collide the player and the stars with the platforms
      
      this.game.physics.arcade.collide(this.player, this.platforms);
     
      var cursors = this.game.input.keyboard.createCursorKeys();
            //  Reset the players velocity (movement)
        this.player.body.velocity.x = 0;

        if (cursors.left.isDown)
        {
            //  Move to the left
            this.player.body.velocity.x = -150;

            this.player.animations.play('left');
        }
        else if (cursors.right.isDown)
        {
            //  Move to the right
            this.player.body.velocity.x = 150;

            this.player.animations.play('right');
        }
        else
        {
            //  Stand still
            this.player.animations.stop();

            this.player.frame = 4;
        }

        //  Allow the player to jump if they are touching the ground.
        if (cursors.up.isDown && this.player.body.touching.down)
        {
            this.player.body.velocity.y = -350;
        }


    },

    onInputDown: function () {
      this.game.state.start('menu');
       this.theme.stop();
    }
  };

  window['worktitle'] = window['worktitle'] || {};
  window['worktitle'].Game = Game;
}());
