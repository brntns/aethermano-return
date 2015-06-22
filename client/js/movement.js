var movement = {
  hello: function hello(x,y){
    this.greeting.x = x -32;
    this.greeting.y = y -60;
    this.status = 'hello';
  },
  decelerate: function decelerate(sign, sprite) {
    var body = sprite.body;
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
      sprite.animations.stop();
      sprite.frame = 4;
    }
  }
  jump: function jump(player,events) {
   player.bunnyKiller = true;
   player.jumpRelease = false;
    player.jumpStop = true;
    player.sprite.body.velocity.y = -250-(Math.abs( player.sprite.body.velocity.x))/7;
    if ( player.sprite.body.onFloor() || player.wallJumpL || player.wallJumpR) {
      player.jumpWindow = true;
      events.remove(player.jumpWindowTimer);
      player.jumpWindowTimer = events.add(500,player.jumpReset,player.jumpWindowTimer);
    }
    //Animation Jumping
    player.sprite.animations.stop();
    if ( player.sprite.body.velocity.x < -20) {
       player.sprite.frame = 3;
    } else if ( player.sprite.body.velocity.x > 20) {
       player.sprite.frame = 1;
    } else {
       player.sprite.frame = 4;
    }
  },
  sign: function sign(x){
    if(x < 0){
      return -1;
    } else {
      return 1;
    }
  },
  dodgeReset = function dodgeReset() {
    this.dodgeWindow = false;
  },
  jumpReset:function jumpReset(player) {
      player.jumpWindow = false;
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
  moveLR: function  moveLR(sign, sprite){
    var body = sprite.body;
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
        sprite.animations.play('left');
      } else {
        sprite.animations.play('right');
      }
    }
  }
}
