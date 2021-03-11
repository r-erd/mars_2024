 // Create the state that will contain the whole game
 class  mainScene {  
    preload() {  
        // Here we preload the assets
        this.load.image('paddle', 'assets/paddle.png');
        this.load.image('brick', 'assets/brick.png');
        this.load.image('ball', 'assets/ball.png'); 
    }

    create() {  

        // Create the left/right arrow keys
        this.arrow = this.input.keyboard.createCursorKeys();

        // Add the paddle at the bottom of the screen
        this.paddle = this.physics.add.sprite(200, 400, 'paddle');

        // Make sure the paddle won't move when it hits the ball
        this.paddle.body.immovable = true;

        this.bricks = this.physics.add.group();  

        // Add 25 bricks to the group (5 columns and 5 lines)
        for (var i = 0; i < 5; i++) {
            for (var j = 0; j < 5; j++) {
                // Create the brick at the correct position
                var brick = this.physics.add.sprite(55+i*60, 55+j*35, 'brick');
    
                // Make sure the brick won't move when the ball hits it
                brick.body.immovable = true;
    
                // Add the brick to the group
                this.bricks.add(brick);
            }
        }

        //Add the ball
        this.ball = this.physics.add.sprite(200, 300, 'ball');  

        // Give the ball some initial speed
        this.ball.body.velocity.x = 200;
        this.ball.body.velocity.y = 200;
    
        // Make sure the ball will bounce when hitting something
        this.ball.body.bounce.setTo(1); 
        this.ball.body.collideWorldBounds = true;
    }




    update() {  
        // Here we update the game 60 times per second
        // Move the paddle left/right when an arrow key is pressed
        if (this.arrow.left.isDown) 
            this.paddle.body.velocity.x = -300;
        else if (this.arrow.right.isDown) 
            this.paddle.body.velocity.x = 300; 
        // Stop the paddle when no key is pressed
        else 
            this.paddle.body.velocity.x = 0;  

        // Call the 'hit' function when the ball hits a brick  
        this.physics.add.collider(this.ball, this.bricks, this.ballHitBrick, null, this);

        this.physics.add.collider(this.ball, this.paddle);
        // Restart the game if the ball is below the paddle
        if (this.ball.y > this.paddle.y)
            this.scene.restart() 
        
        if(this.ball.body.velocity.y > 0){
            this.ball.body.velocity.y += 0.1
        } else {
            this.ball.body.velocity.y -= 0.1
        }


        if (this.ball.body.velocity.x > 0){
            this.ball.body.velocity.x += 0.1
        } else {
            this.ball.body.velocity.x -= 0.1
        }
    }

    ballHitBrick(ball, brick){
        brick.destroy()

        if(ball.body.velocity.y > 0){
            ball.body.velocity.y += 40
        } else {
            ball.body.velocity.y -= 40
        }


        if (ball.body.velocity.x > 0){
            ball.body.velocity.x += 40
        } else {
            ball.body.velocity.x -= 40
        }
    }

}


new Phaser.Game({
    width: 400, // Width of the game in pixels
    height: 450, // Height of the game in pixels
    backgroundColor: '#3598db', // The background color (blue)
    scene: mainScene, // The name of the scene we created
    physics: { default: 'arcade' }, // The physics engine to use
    parent: 'game', // Create the game inside the <div id="game"> 
});

