'use strict';

var chatWheel = {
  say:function(data){
    if(!this.talking){
      this.talking = true;
      this.chatBubble();
      console.log(data);
      this.game.time.events.add(450,function(){this.talking = false;this.chat.kill();},this);
    }else{

    }
  },
  chatBubble:function(){
    this.chat = this.game.add.sprite(this.sprite.body.x -40, this.sprite.body.y - 55 , 'hello');
  }
}

module.exports = chatWheel;
