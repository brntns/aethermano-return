var Wizard = {
  playerClass: 3,
  moveMode: 0,
  classInit: function () {
    this.sprite.loadTexture('wizard', 0);
  },
  classUpdate: function classUpdate() {
    switch (this.moveMode) {
      case 0:
        if (this.teleport.isDown && !this.teleportcd) {
          this.teleportLR(this.direction);
        }
      break;
    }
  },
  teleportLR: function teleportLR(z) {
    if (z === 1) {
      this.sprite.x = this.sprite.x + this.teleportRangeX;
    } else if (z === 2){
      this.sprite.y = this.sprite.y - Math.floor(this.teleportRangeY/1.5);
      this.sprite.x = this.sprite.x + Math.floor(this.teleportRangeX/1.5);
    } else if (z === 3){
      this.sprite.y = this.sprite.y - Math.floor(this.teleportRangeY);
    } else if (z === 4){
      this.sprite.y = this.sprite.y - Math.floor(this.teleportRangeY/1.5);
      this.sprite.x = this.sprite.x - Math.floor(this.teleportRangeX/1.5);
    } else if (z === 5){
      this.sprite.x = this.sprite.x - Math.floor(this.teleportRangeX);
    } else if (z === 6){
      this.sprite.y = this.sprite.y + Math.floor(this.teleportRangeY/1.5);
      this.sprite.x = this.sprite.x - Math.floor(this.teleportRangeX/1.5);
    } else if (z === 7){
      this.sprite.y = this.sprite.y + Math.floor(this.teleportRangeY);
    } else {
      this.sprite.y = this.sprite.y + Math.floor(this.teleportRangeY/1.5);
      this.sprite.x = this.sprite.x + Math.floor(this.teleportRangeX/1.5);
    }
    this.teleportcd = true;
    this.game.time.events.add(this.teleportCd,function(){this.teleportcd = false;},this);
  }
};

module.exports = Wizard;
