
class mainScene {
    // The three methods currently empty
  
    preload() {
      // This method is called once at the beginning
      // It will load all the assets, like sprites and sounds  
      // Parameters: name of the sprite, path of the image
      this.load.image('bird', 'assets/bird.png');
      this.load.image('pipe', 'assets/pipe.png');
      this.load.audio('jump','assets/jump.wav');
    }
    create() {

        this.score = 0
        let style = { font: '20px Arial', fill: '#fff' };
        this.scoreText = this.add.text(20, 20, this.score, style);

        this.bird = this.physics.add.sprite(100,245,'bird');
        this.bird.setOrigin(-0.2,0.5)

        this.jumpSound = this.sound.add('jump');
        this.jumpSound.setVolume(0.2); 


        this.pipes = this.physics.add.group()

        this.bird.setGravityY(1000);

        this.spacekey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);

        this.timer = this.time.addEvent({
            delay: 2000,                
            callback: this.addRowOfPipes,
            callbackScope: this,
            loop: true
        });


        

    }
    update() {
      // This method is called 60 times per second after create() 
      // It will handle all the game's logic, like movements

    if (this.bird.y < 0 || this.bird.y > 490)
        this.scene.restart() 

    if(this.spacekey.isDown)
        this.jump()
  
    if (this.physics.overlap(this.bird,this.pipes)){

        if (this.bird.alive == false)
            return;

        this.bird.alive = false;

        this.timer.remove()


        this.pipes.children.each( function(p){
            p.body.velocity.x = 0;
        },this)

    }


    if (this.bird.angle < 20)
        this.bird.angle += 1; 

    }

    jump(){
        if (this.bird.alive == false)
            return;

        this.jumpSound.play()
        this.bird.body.velocity.y = -350;

        this.tweens.add({
            targets: this.bird, // on the bird 
            duration: 100, // for 200ms 
            angle: -20,
        });
    }

    addOnePipe(x,y){
        this.pipe = this.physics.add.sprite(x,y,'pipe');
        this.pipes.add(this.pipe);
        this.pipe.body.velocity.x = -200;

        this.pipe.checkWorldBounds = true;
        this.pipe.outOfBoundsKill = true;
    }

    addRowOfPipes(){
        this.hole = Math.floor(Math.random()*5 + 1);

        for (var i = 0; i< 8; i++){
            if (i != this.hole && i != this.hole +1){
                this.addOnePipe(400, i*60 +10);
            }
        }

        this.score += 10
        this.scoreText.text = this.score
    }


}





new Phaser.Game({
    width: 450, // Width of the game in pixels
    height: 450, // Height of the game in pixels
    backgroundColor: '#3498db', // The background color (blue)
    scene: mainScene, // The name of the scene we created
    physics: { default: 'arcade' }, // The physics engine to use
    parent: 'game', // Create the game inside the <div id="game"> 
});