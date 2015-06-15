window.addEventListener('load', function () {
  'use strict';

  var ns = window['worktitle'];
  var w = window.innerWidth;
	var h = window.innerHeight;
  var game = new Phaser.Game(w, h, Phaser.AUTO, 'worktitle');
  game.state.add('boot', ns.Boot);
  game.state.add('preloader', ns.Preloader);
  game.state.add('menu', ns.Menu);
  game.state.add('game', ns.Game);
  /* yo phaser:state new-state-files-put-here */
  game.state.start('boot');
}, false);
