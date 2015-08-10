var vines = {
  vineSpawn: function vineSpawn(x, y, n) {
    var X = Math.floor((x-14)/16);
    var Y = Math.floor((y-15)/16);
    var maxX = this.map.maps[0].layers[0].height*16;
    var maxY = this.map.maps[0].layers[0].width*16;
    var alternate = 0;
    var ladderMaxlength = 20;
    loop:
    for (var i = 0; i < ladderMaxlength; i++) {
      if (Y+2*i+3 < maxY
      && X+1 < maxX
      && this.ladderTileCheck(X,Y-2*i)
      && this.ladderTileCheck(X,Y-2*i-2)
      && i < ladderMaxlength-1) {
        if (i === 0) {
          if (this.map.collisionLayer.layer.data[Y-2*i+2][X].index !== -1
          && this.map.collisionLayer.layer.data[Y-2*i+2][X+1].index !== -1) {
            if (n === 0) {
              var ladder = this.add.sprite(32,32, 'vine_bottom_left');
              this.addLadderPart(ladder, X, Y, -i);
              alternate = 0;
            } else {
              var ladder = this.add.sprite(32,32, 'vine_bottom_right');
              this.addLadderPart(ladder, X, Y, -i);
              alternate = 1;
            }
          } else {
            break loop;
          }
        } else if (alternate === 0) {
          var ladder = this.add.sprite(32,32, 'vine_middle_right');
          this.addLadderPart(ladder, X, Y, -i);
          alternate = 1;
        } else if (alternate === 1) {
          var ladder = this.add.sprite(32,32, 'vine_middle_left');
          this.addLadderPart(ladder, X, Y, -i);
          alternate = 0;
        }
      } else if ((Y+2*i+1 < maxY && X+1 < maxX && this.ladderTileCheck(X,Y-2*i)) || i === ladderMaxlength-1) {
        if (i > 0) {
            if (alternate === 0) {
              var ladder = this.add.sprite(32,32, 'vine_top_right');
              this.addLadderPart(ladder, X, Y, -i);
            } else {
              var ladder = this.add.sprite(32,32, 'vine_top_left');
              this.addLadderPart(ladder, X, Y, -i);
            }
        }
        break loop;
      } else {
        break loop;
      }
    }
  },
  ladderTileCheck: function ladderTileCheck(X, Y) {
    var theMap = this.map.collisionLayer.layer.data;
    var value = true;
    loop:
    for (k = 0; k < 2; k++) {
      for (l = 0; l < 2; l++) {
        if (theMap[Y+k][X+l].index !== -1 && (theMap[Y+k][X+l].index < 68 || theMap[Y+k][X+l].index > 119)) {
          value = false;
          break loop;
        }
      }
    }
    return value;
  },
  ladderSpawn: function ladderSpawn(x, y, n) {
    var X = Math.floor((x-14)/16);
    var Y = Math.floor((y-14)/16);
    var maxX = this.map.maps[0].layers[0].height*16;
    var maxY = this.map.maps[0].layers[0].width*16;
    var ladderMaxlength = 15;
    //console.log(this.map.collisionLayer.layer.data);
    loop:
    for (var i = 0; i < ladderMaxlength; i++) {
      var theMap = this.map.collisionLayer.layer.data;
      if (Y+2*i+2 < maxY
      && X+1 < maxX
      && this.ladderTileCheck(X,Y+2*i)
      && this.ladderTileCheck(X,Y+2*i+2)
      && i < ladderMaxlength-1) {
        if (i === 0) {
          if (n === 0) {
            var ladder = this.add.sprite(32,32, 'rope_ladder_top_left');
            this.addLadderPart(ladder, X, Y, i);
          } else if (n === 2) {
            var ladder = this.add.sprite(32,32, 'rope_ladder_top_right');
            this.addLadderPart(ladder, X, Y, i);
          } else if (n === 1) {
            var ladder = this.add.sprite(32,32, 'rope_ladder_top');
            this.addLadderPart(ladder, X, Y, i);
          } else {
            break loop;
          }
        } else {
          var ladder = this.add.sprite(32,32, 'rope_ladder_middle');
          this.addLadderPart(ladder, X, Y, i);
        }
      } else if ((Y+2*i+1 < maxY && X+1 < maxX && this.ladderTileCheck(X,Y+2*i)) || i === ladderMaxlength-1) {
        if (i > 0) {
          var ladder = this.add.sprite(32,32, 'rope_ladder_bottom');
          this.addLadderPart(ladder, X, Y, i);
        }
        break loop;
      } else {
        break loop;
      }
    }
  },
  addLadderPart: function addLadderPart(ladder, X, Y, i) {
    ladder.physicsType = Phaser.SPRITE;
    this.game.physics.arcade.enable(ladder);
    ladder.visible = true;
    ladder.body.allowGravity = false;
    ladder.body.immovable = true;
    //this.body.setSize();
    ladder.x = X*16;
    ladder.y = (Y+2*i)*16;
    this.ladders.add(ladder);
  }

};

module.exports = vines;
