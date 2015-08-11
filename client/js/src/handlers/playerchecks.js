var playerchecks = {
  playerChecks:function(){
    if(this.player !== null && this.map.collisionLayer !== null){
      this.player.update();
      this.player.sprite.bringToTop();
    }
    // Vul animation
    if (this.player.vuln && !this.player.dieing) {
      this.player.sprite.tint = 0xFAA1A1;
    } else {
      this.player.sprite.tint = 0xffffff;
    }
    // Invul animation
    if (this.player.invul && !this.player.dieing){
      this.player.sprite.alpha = 0.5;
      this.player.sprite.tint = 0xffffff;
    } else {
      this.player.sprite.alpha = 1;
    }
    // Deathchat
    if(!this.player.dieing){
      if(this.chatGroup !== null){
        this.chatGroup.visible = false;
      }
      if(this.player.text !== null){
        this.player.text.visible = false;
      }
      this.incomingChat = [];
    }
    if(this.player.sendchat.isDown && !this.activeChat && this.player.dieing){
      this.activeChat = true;
      if (this.player.text !== null) {
        this.player.text.visible = true;
      }
      if (this.chatGroup !== null) {
        this.chatGroup.visible = true;
      }
      var txt =  this.player.chat.join('');
      var chat = {
        id: this.player.id,
        msg: txt
      };
      this.client.updateChat(chat);
      this.game.time.events.add(1000, function(){this.activeChat = false;}, this);
      this.player.chat = [];
      this.player.text.destroy();
    }
  }

};

module.exports = playerchecks;
