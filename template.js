
class mainScene {
    // The three methods currently empty
  
    preload() {
      // This method is called once at the beginning
      // It will load all the assets, like sprites and sounds  
      // Parameters: name of the sprite, path of the image
    }
    create() {
      // This method is called once, just after preload()
      // It will initialize our scene, like the positions of the sprites
    }
    update() {
      // This method is called 60 times per second after create() 
      // It will handle all the game's logic, like movements

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