var collision = {
  worldCollision:function(){
    // Collision
    if(this.player !== null && this.map.collisionLayer !== null ){
      this.updateShadowTexture();
      this.lightSprite.bringToTop();
      //console.log(this.player.status);
      // make player collide
      this.game.physics.arcade.collide(this.player.sprite, this.map.collisionLayer);
      //this.game.physics.arcade.collide(this.player.sprite,this.boundsGroup);
      this.game.physics.arcade.collide(this.player.sprite, this.items.item, this.itemCollisionHandler, null, this);
      this.game.physics.arcade.collide(this.monsterGroup, this.map.collisionLayer, this.enemyHandler, null, this);
      //this.game.physics.arcade.overlap(this.player.sprite,this.monsterGroup, this.enemyCollisionHandler, null, this);
      this.game.physics.arcade.overlap(this.player.hitbox1, this.monsterGroup, this.enemySlashingHandler, null, this);
      this.game.physics.arcade.overlap(this.player.hitbox2, this.monsterGroup, this.enemySlashingHandler, null, this);
      this.game.physics.arcade.overlap(this.player.bullets, this.monsterGroup, this.enemyBulletHandler, null, this);
      this.game.physics.arcade.overlap(this.player.bullets, this.map.collisionLayer, this.wallHit, null, this);
      this.game.physics.arcade.overlap(this.player.sprite, this.locationGroup, this.changeLevel, null, this);

      if (this.game.physics.arcade.overlap(this.player.sprite, this.ladders)) {
        this.player.onLadder = true;
      } else {
        this.player.onLadder = false;
      }
      this.climbCheck();
      if (this.compasses.length > 0) {
        for (var i = 0; i < this.compasses.length; i++) {
          this.compasses[i].sprite.bringToTop();
        }
      }
      if (this.locationGroup.length > 0) {
        for (var i = 0; i < this.locationGroup.length; i++) {
          this.locationGroup.children[i].bringToTop();
        }
      }
      this.player.sprite.bringToTop();

      if (this.player.text !== null) {
        this.player.text.bringToTop();
      }
      if (this.chatGroup !== null) {
        this.chatGroup.bringToTop();
      }
      // Update the player
      this.player.update();
      //update nearby Monsters
      if (this.player.spawningLadder) {
        this.player.spawningLadder = false;
        if (this.player.playerClass === 0) {
          this.ladderSpawn(this.player.sprite.x,this.player.sprite.y,this.player.ladderDirection);
          this.client.spawnLadder(this.player.sprite.x,this.player.sprite.y,this.player.ladderDirection);
        }
        if (this.player.playerClass === 4) {
          var randy = Math.floor(Math.random()+0.5);
          this.vineSpawn(this.player.sprite.x,this.player.sprite.y,randy);
          this.client.spawnVine(this.player.sprite.x,this.player.sprite.y,this.player.ladderDirection);
        }
      }
      if (this.player.detonate) {
        this.detonateFireball(this.player.bullet);
      }
      if (this.player.teleporting !== 0) {
        this.teleportPlayer();
      }
    }

  }

};

module.exports = collision;
