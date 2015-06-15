(function() {
  'use strict';

  function Menu() {}

  Menu.prototype = {
    preload: function () {
      this.game.load.image('menu_background', 'assets/menu_background.jpg');
      this.game.load.audio('theme','assets/theme.mp3');


    },
    create: function () {

    
      // Menu background
      this.game.background = this.game.add.tileSprite(0, 0, this.game.world.width, this.game.world.height, 'menu_background');
      this.game.background.autoScroll(-20, 0);
      this.game.background.tilePosition.x = 0;
      this.game.background.tilePosition.y = 0;

      this.theme = this.game.add.audio('theme');
      //this.theme.loopFull();

    

      var text = this.add.text(this.game.width * 0.5, this.game.height * 0.3,
        'LOST ?', {font: '62px Arial', fill: '#000', align: 'center'
      });
      text.anchor.set(0.5);
      this.input.onDown.add(this.onDown, this);
    },

    update: function () {

    },

    onDown: function () {
      this.game.state.start('game');
      this.theme.stop();
    }
  };

  window['worktitle'] = window['worktitle'] || {};
  window['worktitle'].Menu = Menu;
}());
