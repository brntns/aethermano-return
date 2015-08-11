'use strict';

var keyMaps = {
  setKeyboardButtons:function setKeyboardButtons(){
    //special
    this.cursors = this.game.input.keyboard.createCursorKeys();
    this.full = this.game.input.keyboard.addKey(190);
    this.sendchat = this.game.input.keyboard.addKey(13);
  //  this.orderMonster = this.game.input.keyboard.addKey(189);
    this.class0 = this.game.input.keyboard.addKey(Phaser.Keyboard.ZERO);
    this.class1 = this.game.input.keyboard.addKey(Phaser.Keyboard.ONE);
    this.class2 = this.game.input.keyboard.addKey(Phaser.Keyboard.TWO);
    this.class3 = this.game.input.keyboard.addKey(Phaser.Keyboard.THREE);
    this.class4 = this.game.input.keyboard.addKey(Phaser.Keyboard.FOUR);
    this.class5 = this.game.input.keyboard.addKey(Phaser.Keyboard.FIVE);
    this.class6 = this.game.input.keyboard.addKey(Phaser.Keyboard.SIX);
    this.class7 = this.game.input.keyboard.addKey(Phaser.Keyboard.SEVEN);
    this.class8 = this.game.input.keyboard.addKey(Phaser.Keyboard.EIGHT);
    this.class9 = this.game.input.keyboard.addKey(Phaser.Keyboard.NINE);
    // letterbinding
    this.letterA = this.game.input.keyboard.addKey(Phaser.Keyboard.A);
    this.letterB = this.game.input.keyboard.addKey(Phaser.Keyboard.B);
    this.letterC = this.game.input.keyboard.addKey(Phaser.Keyboard.C);
    this.letterD = this.game.input.keyboard.addKey(Phaser.Keyboard.D);
    this.letterE = this.game.input.keyboard.addKey(Phaser.Keyboard.E);
    this.letterF = this.game.input.keyboard.addKey(Phaser.Keyboard.F);
    this.letterG = this.game.input.keyboard.addKey(Phaser.Keyboard.G);
    this.letterH = this.game.input.keyboard.addKey(Phaser.Keyboard.H);
    this.letterI = this.game.input.keyboard.addKey(Phaser.Keyboard.I);
    this.letterJ = this.game.input.keyboard.addKey(Phaser.Keyboard.J);
    this.letterK = this.game.input.keyboard.addKey(Phaser.Keyboard.K);
    this.letterL = this.game.input.keyboard.addKey(Phaser.Keyboard.L);
    this.letterM = this.game.input.keyboard.addKey(Phaser.Keyboard.M);
    this.letterN = this.game.input.keyboard.addKey(Phaser.Keyboard.N);
    this.letterO = this.game.input.keyboard.addKey(Phaser.Keyboard.O);
    this.letterP = this.game.input.keyboard.addKey(Phaser.Keyboard.P);
    this.letterQ = this.game.input.keyboard.addKey(Phaser.Keyboard.Q);
    this.letterR = this.game.input.keyboard.addKey(Phaser.Keyboard.R);
    this.letterS = this.game.input.keyboard.addKey(Phaser.Keyboard.S);
    this.letterT = this.game.input.keyboard.addKey(Phaser.Keyboard.T);
    this.letterU = this.game.input.keyboard.addKey(Phaser.Keyboard.U);
    this.letterV = this.game.input.keyboard.addKey(Phaser.Keyboard.V);
    this.letterW = this.game.input.keyboard.addKey(Phaser.Keyboard.W);
    this.letterX = this.game.input.keyboard.addKey(Phaser.Keyboard.X);
    this.letterY = this.game.input.keyboard.addKey(Phaser.Keyboard.Y);
    this.letterZ = this.game.input.keyboard.addKey(Phaser.Keyboard.Z);
    this.letterSpace = this.game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
    this.letterBackSpace = this.game.input.keyboard.addKey(8);


  },
  createChat:function createChat(){
    //  console.log(this.chat);
  }
}

module.exports = keyMaps;
