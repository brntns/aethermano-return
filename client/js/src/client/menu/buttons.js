module.exports = {
    pos: [0, 50, 100],
    draw: function (game) {
        this.game = game;
        this.button1 = this.addButton(1,'explorerbtn',this.game.startExplorer);
        this.button1.anchor.setTo(0.5, 0.5);
        this.button2 = this.addButton(2, 'knightbtn',this.game.startKnight);
        this.button2.anchor.setTo(0.5, 0.5);
        this.button3 = this.addButton(3,'conjurerbtn',this.game.startConjurer);
        this.button3.anchor.setTo(0.5, 0.5);
          this.game.menuGroup.add(this.button1);

          this.game.menuGroup.add(this.button2);

          this.game.menuGroup.add(this.button3);
    },

    addButton: function (weight,button, func) {
      return this.game.add.button(this.game.world.centerX,
        this.game.world.centerY + this.pos[weight - 1],
        button,
        func,
        this);
    }
};
