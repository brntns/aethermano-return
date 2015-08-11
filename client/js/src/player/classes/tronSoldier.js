var TronSoldier = {
  playerClass: 2,
  moveMode: 0,
  classInit: function () {
    this.sprite.loadTexture('tron', 0);
    this.bullets = this.game.add.group();
    this.game.physics.enable(this.bullets, Phaser.Physics.ARCADE);
  },
  classUpdate: function classUpdate() {
  	switch (this.moveMode) {
  	case 0:
  	  //Switching to Tronmove
	    if (this.letterE.isDown) {
	      if (!this.tronWindow && this.tronCool) {
	        this.switchToTron();
	      }
	    }
    break;

    case 1:
      //Tronmove
      //Reverting to Normal Movement
      if (this.letterE.isDown 
      || this.sprite.body.blocked.up
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

    case 3:
    break;

    default:
      this.moveMode = 0;
    break;
    }
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
    this.sprite.frame = 43;
    this.status = 71;
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
    this.sprite.frame = 41;
    this.status = 72;
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
    this.sprite.frame = 42;
    this.status = 73;
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
    this.sprite.frame = 40;
    this.status = 74;
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
