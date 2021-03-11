
class mainScene {
    // The three methods currently empty
  
    preload() {
      // This method is called once at the beginning
      // It will load all the assets, like sprites and sounds  
      // Parameters: name of the sprite, path of the image
      this.load.image('player', 'assets/player.png');
      this.load.image('wall', 'assets/ball.png');
      this.load.image('coin', 'assets/coin.png');
      this.load.image('enemy', 'assets/enemy.png');
    
    }
    create() {
      // This method is called once, just after preload()
      // It will initialize our scene, like the positions of the sprites

      this.arrow = this.input.keyboard.createCursorKeys();
      this.player = this.physics.add.sprite(70,100,'player');
      this.player.setGravityY(600);

      this.walls = this.physics.add.group()
      this.coins = this.physics.add.group()
      this.enemies = this.physics.add.group()


      var level = [
        'xxxxxxxxxxxxxxxxxxxxxx',
        '!         !          x',
        '!                 o  x',
        '!         o          x',
        '!                    x',
        '!     o   !    x     x',
        'xxxxxxxxxxxxxxxx!!!!!x',
    ];

    for (var i = 0; i < level.length; i++) {
        for (var j = 0; j < level[i].length; j++) {
    
            // Create a wall and add it to the 'walls' group
            if (level[i][j] == 'x') {
                var wall = this.physics.add.sprite(30+20*j, 30+20*i, 'wall');
                this.walls.add(wall);
                wall.body.immovable = true; 
            }
    
            // Create a coin and add it to the 'coins' group
            else if (level[i][j] == 'o') {
                var coin = this.physics.add.sprite(30+20*j, 30+20*i, 'coin');
                this.coins.add(coin);
            }
    
            // Create a enemy and add it to the 'enemies' group
            else if (level[i][j] == '!') {
                var enemy = this.physics.add.sprite(30+20*j, 30+20*i, 'enemy');
                this.enemies.add(enemy);
            }
        }
    }

    }
    update() {
      // This method is called 60 times per second after create() 
      // It will handle all the game's logic, like movements

      // Move the player when an arrow key is pressed
        if (this.arrow.left.isDown) 
            this.player.body.velocity.x = -200;
        else if (this.arrow.right.isDown) 
            this.player.body.velocity.x = 200;
        else 
            this.player.body.velocity.x = 0;

        if (this.arrow.up.isDown && this.player.body.touching.down) 
            this.player.body.velocity.y = -250;


        this.physics.add.collider(this.player,this.walls);

        this.physics.add.collider(this.player, this.coins, this.takeCoin, null, this);

        if(this.physics.overlap(this.player, this.enemies)){
            this.scene.restart() 
        }

    }

    takeCoin(player, coin){
        coin.destroy();
    }

}





new Phaser.Game({
    width: 500, // Width of the game in pixels
    height: 200, // Height of the game in pixels
    backgroundColor: '#3598db', // The background color (blue)
    scene: mainScene, // The name of the scene we created
    physics: { default: 'arcade' }, // The physics engine to use
    parent: 'game', // Create the game inside the <div id="game"> 
});