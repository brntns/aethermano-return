var climb = {

  climbCheck: function climbCheck() {

    var coordsX = Math.floor((this.player.sprite.x - 15)/16);
    var coordsY = Math.floor((this.player.sprite.y - 15)/16);
    var limitX = this.map.currentMap.layers[0].width-3;
    var limitY = this.map.currentMap.layers[0].height-3;
    //console.log(this.map.collisionLayer.layer.data[0]);
  //  console.log('x: '+coordsX+'  y: '+coordsY+'  limitX: '+limitX+'  limitY: '+limitY);
    if (coordsX < limitX && coordsY > 3) {
      this.climbCheckUR(this.map.collisionLayer, coordsX, coordsY);
    }
    if (coordsX > 3 && coordsY > 3) {
      this.climbCheckUL(this.map.collisionLayer, coordsX, coordsY);
    }
    if (coordsX > 3 && coordsY < limitY) {
      this.climbCheckDL(this.map.collisionLayer, coordsX, coordsY);
    }
    if (coordsX < limitX && coordsY < limitY) {
      this.climbCheckDR(this.map.collisionLayer, coordsX, coordsY);
    }
  },
  climbCheckUR: function climbCheckUR(layer, coordsX, coordsY) {
    this.player.climbBoxUR = false;
    loop:
    for (var i = 0; i < 3; i++) {
      for (var j = 0; j < 3; j++) {
        var mapIndex = layer.layer.data[coordsY+j-2][coordsX+i+1].index;
        if (mapIndex !== -1 && (mapIndex < 69 || mapIndex > 119)) {
          if (this.checkOverlap(this.player.climbboxUR, layer.layer.data[coordsY+j-2][coordsX+i+1])) {
            this.player.climbBoxUR = true;
            break loop;
          }
        }
      }
    }
    return this.player.climbBoxUR;
  },
  climbCheckUL: function climbCheckUL(layer, coordsX, coordsY) {
    //console.log(layer);
    this.player.climbBoxUL = false;
    loop:
    for (var i = 0; i < 3; i++) {
      for (var j = 0; j < 3; j++) {
        var mapIndex = layer.layer.data[coordsY+j-2][coordsX+i-2].index;
        if (mapIndex !== -1 && (mapIndex < 69 || mapIndex > 119)) {
          if (this.checkOverlap(this.player.climbboxUL, layer.layer.data[coordsY+j-2][coordsX+i-2])) {
            this.player.climbBoxUL = true;
            break loop;
          }
        }
      }
    }
    return this.player.climbBoxUL;
  },
  climbCheckDL: function climbCheckDL(layer, coordsX, coordsY) {
    this.player.climbBoxDL = false;
    loop:
    for (var i = 0; i < 3; i++) {
      for (var j = 0; j < 3; j++) {
        var mapIndex = layer.layer.data[coordsY+j+1][coordsX+i-2].index;
        if (mapIndex !== -1 && (mapIndex < 69 || mapIndex > 119)) {
          if (this.checkOverlap(this.player.climbboxDL, layer.layer.data[coordsY+j+1][coordsX+i-2])) {
            this.player.climbBoxDL = true;
            break loop;
          }
        }
      }
    }
    return this.player.climbBoxDL;
  },
  climbCheckDR: function climbCheckDR(layer, coordsX, coordsY) {
    this.player.climbBoxDR = false;
    loop:
    for (var i = 0; i < 3; i++) {
      for (var j = 0; j < 3; j++) {
        var mapIndex = layer.layer.data[coordsY+j+1][coordsX+i+1].index;
        if (mapIndex !== -1 && (mapIndex < 69 || mapIndex > 119)) {
          if (this.checkOverlap(this.player.climbboxDR, layer.layer.data[coordsY+j+1][coordsX+i+1])) {
            this.player.climbBoxDR = true;
            break loop;
          }
        }
      }
    }
    return this.player.climbBoxDR;
  },
  checkOverlap: function checkOverlap(sprite, tile) {
    var boundsA = new Phaser.Rectangle(sprite.x, sprite.y, sprite.width, sprite.height);
    var boundsB = new Phaser.Rectangle(tile.x*16, tile.y*16, tile.width, tile.height);
    //console.log('boundsA:'+boundsA+'  boundsB:'+boundsB);
    return Phaser.Rectangle.intersects(boundsA, boundsB);
  }
};

module.exports = climb;
