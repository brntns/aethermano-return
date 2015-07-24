var TronSoldier = {
  playerClass: 2,
  moveMode: 0,
  classInit: function () {
    this.sprite.loadTexture('tron', 0);
  },
  classUpdate: function classUpdate() {
  	switch (this.moveMode) {
  	case 0:
  	  //Switching to Tronmove
	    if (this.tron.isDown) {
	      if (!this.tronWindow && this.tronCool) {
	        this.switchToTron();
	      }
	    }
    break;
    //Tronmove
    case 1:
      //Reverting to Normal Movement
      if (this.tron.isDown  || this.sprite.body.blocked.up
                            || this.sprite.body.blocked.down
                            || this.sprite.body.blocked.left
                            || this.sprite.body.blocked.right) {
        if (!this.tronWindow) {
          this.switchToNormal();
        }
      }
      //Tronmoving
      this.tronMove();
    break;
    default:
      this.moveMode = 0;
    break;
    }
  },
  switchToNormal: function switchToNormal() {
    this.moveMode = 0;
    this.sprite.body.maxVelocity.y = 500;
    this.sprite.body.allowGravity = true;
    this.tronWindow = true;
    this.game.time.events.add(500,function(){this.tronWindow = false;},this);
  },
  switchToTron: function switchToTron() {
    this.sprite.y = this.sprite.y - 16;
    this.moveMode = 1;
    this.sprite.body.velocity.x = 0;
    this.sprite.body.velocity.y = 0;
    this.sprite.body.acceleration.x = 0;
    this.sprite.body.acceleration.y = 0;
    this.sprite.body.allowGravity = false;
    this.sprite.body.maxVelocity.y = this.tronspeed;
    this.tronWindow = true;
    this.tronCool = false;
    this.game.time.events.add(500,function(){this.tronWindow = false;},this);
    this.game.time.events.add(this.tronCd,function(){this.tronCool = true;},this);
    this.tronleft = false;
    this.tronright = false;
    this.tronup = false;
    this.trondown = false;
  },
  tronMove: function tronMove() {
    //LEFT
    if (this.cursors.left.isDown && !this.tronleft) {
      if (!this.cursors.up.isDown && !this.cursors.down.isDown) {
        this.tronMoveL();
      }
    }
    //RIGHT
    else if (this.cursors.right.isDown && !this.tronright) {
      if (!this.cursors.up.isDown && !this.cursors.down.isDown) {
        this.tronMoveR();
      }
    }
    //UP
    else if (this.cursors.up.isDown && !this.tronup) {
      if (!this.cursors.left.isDown && !this.cursors.right.isDown) {
        this.tronMoveU();
      }
    }
    //DOWN
    else if (this.cursors.down.isDown && !this.trondown) {
      if (!this.cursors.left.isDown && !this.cursors.right.isDown) {
        this.tronMoveD();
      }
    }
  },
  tronMoveL: function tronMoveL() {
    this.sprite.frame = 33;
    this.sprite.body.velocity.x = -this.tronspeed;
    this.sprite.body.velocity.y = 0;
    this.sprite.body.acceleration.x = 0;
    this.sprite.body.acceleration.y = 0;
    this.tronleft = true;
    this.tronright = false;
    this.tronup = false;
    this.trondown = false;
  },
  tronMoveR: function tronMoveR() {
    this.sprite.frame = 31;
    this.sprite.body.velocity.x = this.tronspeed;
    this.sprite.body.velocity.y = 0;
    this.sprite.body.acceleration.x = 0;
    this.sprite.body.acceleration.y = 0;
    this.tronleft = false;
    this.tronright = true;
    this.tronup = false;
    this.trondown = false;
  },
  tronMoveU: function tronMoveU() {
    this.sprite.frame = 32;
    this.sprite.body.velocity.y = -this.tronspeed;
    this.sprite.body.velocity.x = 0;
    this.sprite.body.acceleration.x = 0;
    this.sprite.body.acceleration.y = 0;
    this.tronleft = false;
    this.tronright = false;
    this.tronup = true;
    this.trondown = false;
  },
  tronMoveD: function tronMoveD() {
    this.sprite.frame = 30;
    this.sprite.body.velocity.y = this.tronspeed;
    this.sprite.body.velocity.x = 0;
    this.sprite.body.acceleration.x = 0;
    this.sprite.body.acceleration.y = 0;
    this.tronleft = false;
    this.tronright = false;
    this.tronup = false;
    this.trondown = true;
  }
};

module.exports = TronSoldier;
