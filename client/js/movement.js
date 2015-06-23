var movement = {
  hello: function hello(x,y){
    this.greeting.x = x -32;
    this.greeting.y = y -60;
    this.status = 'hello';
  },
  decelerate: function decelerate(sign) {
    var body = this.sprite.body;
    //Sliding Friction
    if(body.onFloor() && (sign*body.velocity.x > 20)) {
      body.acceleration.x = -sign*950;
    }
    //Air Resistance
    else if (!body.onFloor() && sign*body.velocity.x > 5) {
      body.acceleration.x = -sign*0;
    }
    //Stopping
    else if (body.velocity.x != 0) {
      body.velocity.x = 0;
      body.acceleration.x = 0;
    }
    //Animation Standing
    if (body.onFloor) {
      this.sprite.animations.stop();
      this.sprite.frame = 4;
    }
  },
  jump: function jump() {
    this.bunnyKiller = true;
    this.jumpRelease = false;
    this.jumpStop = true;
    this.sprite.body.velocity.y = -250-(Math.abs( this.sprite.body.velocity.x))/7;
    if ( this.sprite.body.onFloor() || this.wallJumpL || this.wallJumpR) {
      this.jumpWindow = true;
      this.game.time.events.remove(this.jumpWindowTimer);
      this.jumpWindowTimer = this.game.time.events.add(500,this.jumpReset,this);
    }
    //Animation Jumping
    this.sprite.animations.stop();
    if ( this.sprite.body.velocity.x < -20) {
       this.sprite.frame = 3;
    } else if ( this.sprite.body.velocity.x > 20) {
       this.sprite.frame = 1;
    } else {
       this.sprite.frame = 4;
    }
  },
  sign: function sign(x){
    if(x < 0){
      return -1;
    } else {
      return 1;
    }
  },
  dodgeReset: function dodgeReset() {
    this.dodgeWindow = false;
  },
  jumpReset: function jumpReset() {
    this.jumpWindow = false;
  },
  wallJumpReset: function wallJumpReset() {
    this.wallWindow = false;
  },
  wallReset: function wallReset() {
    this.wallJumpL = false;
    this.wallJumpR = false;
  },
  teleportReset: function teleportReset() {
    this.teleportcd = false;
  },
  moveLR: function moveLR(sign){
    var body = this.sprite.body;
    //Braking
    if (sign*body.velocity.x < 0) {
      if (body.onFloor()) {
        body.acceleration.x = sign*1950;
      } else {
        body.acceleration.x = sign*Math.max(950,sign*2*body.velocity.x);
      }
    //Starting
    } else if (body.onFloor && sign*body.velocity.x < 100) {
      body.velocity.x = sign*150;
    //Cruising
    } else {
      if (body.onFloor()) {
        body.acceleration.x = sign*250;
      } else if (sign*body.velocity.x < 250) {
        body.acceleration.x = sign*500;
      } else {
        body.acceleration.x = 0;
      }
    }
    //Animation
    if (body.onFloor()) {
      if (sign === -1) {
        this.sprite.animations.play('left');
      } else {
        this.sprite.animations.play('right');
      }
    }
  }
}
