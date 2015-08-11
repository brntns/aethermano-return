var teleport = {
  teleportPlayer: function teleportPlayer() {
    var X = 0;
    var Y = 0;
    switch (this.player.teleporting) {
      case 1:
        Y = this.player.sprite.body.y;
        X = this.player.sprite.body.x + this.player.teleportRangeX;
      break;
      case 2:
        Y = this.player.sprite.body.y - Math.floor(this.player.teleportRangeY/1.5);
        X = this.player.sprite.body.x + Math.floor(this.player.teleportRangeX/1.5);
      break;
      case 3:
        Y = this.player.sprite.body.y - Math.floor(this.player.teleportRangeY);
        X = this.player.sprite.body.x;
      break;
      case 4:
        Y = this.player.sprite.body.y - Math.floor(this.player.teleportRangeY/1.5);
        X = this.player.sprite.body.x - Math.floor(this.player.teleportRangeX/1.5);
      break;
      case 5:
        Y = this.player.sprite.body.y;
        X = this.player.sprite.body.x - Math.floor(this.player.teleportRangeX);
      break;
      case 6:
        Y = this.player.sprite.body.y + Math.floor(this.player.teleportRangeY/1.5);
        X = this.player.sprite.body.x - Math.floor(this.player.teleportRangeX/1.5);
      break;
      case 7:
        Y = this.player.sprite.body.y + Math.floor(this.player.teleportRangeY);
        X = this.player.sprite.body.x;
      break;
      case 8:
        Y = this.player.sprite.body.y + Math.floor(this.player.teleportRangeY/1.5);
        X = this.player.sprite.body.x + Math.floor(this.player.teleportRangeX/1.5);
      break;
      default:
        Y = this.player.sprite.body.y;
        X = this.player.sprite.body.x;
      break;
    }
    this.player.teleporting = 0;
    var tileX = Math.floor(X/16);
    var tileY = Math.floor(Y/16);
    var maxX = this.map.currentMap.layers[0].width*16;
    var maxY = this.map.currentMap.layers[0].height*16;
    //console.log(tileX+' '+tileY+' '+X+' '+Y+' '+maxX+' '+maxY);
    loop:
    for (var i = 0; i < 5; i++) {
      for (var j = 0; j < 5; j++) {
        console.log('Working on Teleport...');
        if (Y - 16*i + 29 < maxY && X + 16*j + 29 < maxX && Y > 0 && X > 0 && this.ladderTileCheck(tileX+j, tileY-i)) {
          Y -= 16*i;
          X += 16*j;
          this.player.sprite.body.x = X;
          this.player.sprite.body.y = Y;
          console.log('Teleported!')
          break loop;
        }
      }
    }
    this.player.sprite.animations.stop();
    var Player = this.player;
    var TeleportArrival = this.player.sprite.animations.play('teleport_arrival');
    TeleportArrival.onComplete.add(function(){Player.switchToNormal();console.log('Switched to Normal');})
  }
};

module.exports = teleport;
