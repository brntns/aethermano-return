'use strict';

var deathChat = {
  chatting:function chatting(){
    this.letterA.onDown.add(this.lettering, this);
    this.letterB.onDown.add(this.lettering, this);
    this.letterC.onDown.add(this.lettering, this);
    this.letterD.onDown.add(this.lettering, this);
    this.letterE.onDown.add(this.lettering, this);
    this.letterF.onDown.add(this.lettering, this);
    this.letterG.onDown.add(this.lettering, this);
    this.letterH.onDown.add(this.lettering, this);
    this.letterI.onDown.add(this.lettering, this);
    this.letterJ.onDown.add(this.lettering, this);
    this.letterK.onDown.add(this.lettering, this);
    this.letterL.onDown.add(this.lettering, this);
    this.letterM.onDown.add(this.lettering, this);
    this.letterN.onDown.add(this.lettering, this);
    this.letterO.onDown.add(this.lettering, this);
    this.letterP.onDown.add(this.lettering, this);
    this.letterQ.onDown.add(this.lettering, this);
    this.letterR.onDown.add(this.lettering, this);
    this.letterS.onDown.add(this.lettering, this);
    this.letterT.onDown.add(this.lettering, this);
    this.letterU.onDown.add(this.lettering, this);
    this.letterV.onDown.add(this.lettering, this);
    this.letterW.onDown.add(this.lettering, this);
    this.letterX.onDown.add(this.lettering, this);
    this.letterY.onDown.add(this.lettering, this);
    this.letterZ.onDown.add(this.lettering, this);
    this.letterSpace.onDown.add(this.lettering, this);
    this.letterBackSpace.onDown.add(this.lettering, this);
  },
  lettering: function lettering(e){
    if(this.text !== null){
      this.text.destroy();
    }
    if(this.chat.length < 41 || e.keyCode === 8){

      if(e.keyCode === 8){
        this.chat.splice(this.chat.length-1,1);
      } else{
        var value = String.fromCharCode(e.keyCode);
        this.chat.push(value);
      }
        var msg = this.chat.join('');
        var send = msg.toLowerCase();
        var style = { font: "22px PixelFraktur", fill: "#000000", align: "left",strokeThickness:4,stroke:"#ffffff"};
        this.text = this.game.add.text(150,420,send, style);
        this.text.fixedToCamera = true;

    } else{
      console.log('longer');
      console.log(this.chat);
      var msg = this.chat.join('');
      var send = msg.toLowerCase();
      var style = { font: "22px PixelFraktur", fill: "#FF0606", align: "left",strokeThickness:4,stroke:"#ffffff" };
      this.text = this.game.add.text(150,420,send, style);
      this.text.fixedToCamera = true;
    }
  }
}
module.exports = deathChat;
