'use strict';

var deathChat = {
  chatting:function chatting(){
    // letters
    var letters = [
      65,66,6,7,68,69,700,71,72,73,74,75,76,77,78,79,80,81,82,83,84,85,86,87,88,89,90,32
    ];
    this.game.input.keyboard.onDownCallback = function(e) {
      var value = String.fromCharCode(e.keyCode);
      var i;
      for (i = 0; i < letters.length; i++) {
        if (letters[i] === e.keyCode) {
            console.log(value);
          //  this.game.chat.push(value);
        }
      }
    }
  }
}

module.exports = deathChat;
