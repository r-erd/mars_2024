var highscore = 0;

//restart on r
//fly with arrow keys


class mainScene {


    //TODO ========== FEATURES TO IMPLEMENT =================
    //TODO add tunnel boring machine#    
    //TODO add new physics / acc settings
    //TODO add higher speed -> less left/right tilting ??
    //TODO add mars at 1000 - land there ->  success  + sky gradient to yellowish grey + less asteroids on approach
    //TODO dont allow negative acceleration, only positive thrust!

    //================ BUGS TO FIX ================
    //TODO explosion sound too late when shot down
    //TODO explosion sound sounds twice when asteroid is hit (on respawn again)
    //TODO fix hitbox of the asteroids?!
    //TODO clouds spawn mid screen (left and right spawns)
    //TODO position explosion particle origin 
    //TODO dont follow the x-axis of the floor (dust emitter)
      //add sprite that is always in the x-center but moves y-axis and follow this one instead of floor

    //TODO fix speed text display position
    //TODO fix turbolences

    //TODO make sound and particle effects dependent on thrust, not acceleration 
    //TODO rework UI to display thurst in percent, not acceleration

    // ================= OTHER
    //TODO embed in website
    //TODO add skin selection / game mode (agility vs speed)
    //TODO add crypto mode



    preload() {

      this.load.image('rocket', 'assets/rocket.png');
      this.load.image('starship', 'assets/starship.png');
      this.load.image('deathscreen', 'assets/deathscreen.png');
      this.load.image('light', 'assets/light.png');
      this.load.image('asteroid', 'assets/asteroid.png');
      this.load.image('asteroidsmall', 'assets/asteroidsmall.png');
      this.load.image('asteroidverysmall', 'assets/asteroidverysmall.png');
      this.load.image('floor', 'assets/landscape.png');
      this.load.image('buildings', 'assets/background_buildings.png');
      this.load.image('overlay', 'assets/overlay.png');
      this.load.audio('explosionSound', 'assets/explosion.wav');
      this.load.audio('spaceshipSound', 'assets/spaceship.mp3');
      this.load.audio('boosterSound', 'assets/booster.mp3');
      this.load.image('explosion_particle', 'assets/particle_red.png');
      this.load.image('propulsion_particle', 'assets/particle_blue.png');
      this.load.image('sand_particle', 'assets/particle_sand.png');
      this.load.image('grey_particle', 'assets/particle_grey.png');
      this.load.image('starlink', 'assets/starlink.png');
      this.load.image('cursor', 'assets/cursor.png');
      this.load.image('cloud', 'assets/cloud.png');
      this.load.image('blackbird', 'assets/blackbird.png');
      this.load.image('spacetesla', 'assets/spacetesla.png');

    }

    create() {

      this.acceleration = 0
      this.random = Math.random()
      this.eggOne = false;
      this.eggTwo = false;
      this.i=1e6

      this.lookupTable = []
      for (this.i, this.i > 0; this.i--;) {
        this.lookupTable.push(Math.random());
      }


      this.fog = true
      this.running = true
      this.started = false
      this.debug = false
      this.dust = false
      this.background = this.add.tileSprite(600, 420, 1200, 850, 'light');
      this.physics.add.existing(this.background, true);
      this.background = this.add.tileSprite(600, 420, 1200, 850, 'light');

      this.floor = this.physics.add.sprite(600, 715, 'floor');
      this.overlay = this.add.sprite(600, 400, 'overlay');
      this.overlay.setDepth(4)
      this.cursor = this.add.sprite(600, 933, 'cursor');
      this.cursor.setOrigin(0,17);
      this.cursor.angle = -60

      this.buildings = this.physics.add.sprite(601, 565, 'buildings');  

      this.background.setTint(0x5ccbff)

      this.deathscreen = this.physics.add.sprite(600,400,'deathscreen')
      this.deathscreen.alpha = 0
      this.deathscreen.setDepth(5)


      this.alive = true
      this.oldangle = 0;
      this.force = 0;

      var audioConfig = {
        mute: false,
        rate: 1,
        detune: 0,
        seek: 0,
        loop: true,
        delay: 0
    }

      this.boosterSound = this.sound.add('boosterSound', audioConfig);
      this.spaceshipSound = this.sound.add('spaceshipSound', audioConfig);
      this.explosionSound = this.sound.add('explosionSound');
      this.explosionSound.setVolume(0.2); 
      this.spaceshipSound.stop()
      this.boosterSound.stop()



      this.rocket = this.physics.add.sprite(600, 610, 'starship');
      this.rocket.body.setSize(17,67,true); //hitbox
      this.rocket.setOrigin(0.5,1)
      this.rocket.setDepth(1)

      this.o2EmitterInit()


      var sand_particles = this.add.particles("sand_particle");
      this.dust_emitter = sand_particles.createEmitter({
        alpha: { start: 1, end: 0.5 },
        scale: { start: 3, end: 1 },
        rotate: { min: -180, max: 180 },
        angle: { min: -180, max: 0 },
        speed: {min: -100, max: 100},
        lifespan: { min: 1600, max: 1600 },
        blendMode: 'NORMAL',
        frequency: 0 ,
        gravityY: -70,
        collideBottom: true,
        on: false,
        maxParticles: 5000,
        x: {min: -50, max: 50 },
        });
      sand_particles.setDepth(2)
      this.dust_emitter.startFollow(this.floor,0,-90,false)

      var grey_particles = this.add.particles("grey_particle");
      this.gdust_emitter = grey_particles.createEmitter({
        alpha: { start: 0.7, end: 0 },
        scale: { start: 0.5, end: 0.5 },
        speed: {min: -100, max: 100},
        angle: { min: -180, max: 0 },
        rotate: { min: -180, max: 180 },
        lifespan: { min: 1300, max: 1600 },
        blendMode: 'NORMAL',
        frequency: 0 ,
        gravityY: -70,
        collideBottom: true,
        on: false,
        maxParticles: 2000,
        x: {min: -50, max: 50 },
        });
      sand_particles.setDepth(2)
      this.gdust_emitter.startFollow(this.floor,0,-100,false)
      


      var explosion_particles = this.add.particles("explosion_particle");
      this.explosion_emitter = explosion_particles.createEmitter({
        alpha: { start: 1, end: 0 },
        scale: { start: 1, end: 4.5 },
        speed: {min: -50, max: 50},
        angle: { min: 0, max: 360 },
        rotate: { min: -180, max: 180 },
        lifespan: { min: 1600, max: 2200 },
        blendMode: 'NORMAL',
        on: false,
        maxParticles: 1000,
        x: {min: 555, max: 625 },
        y: {min: 555, max: 625 },
        });
      explosion_particles.setDepth(2)

      this.propulsion_particles = this.add.particles("propulsion_particle");
      this.propulsion_emitter = this.propulsion_particles.createEmitter({
        alpha: { start: 1, end: 0 },
        scale: { start: 1, end: 1 },
        speed: {min: -40, max: -20},
        angle: 90,
        frequency: 30,
        rotate: { min: -180, max: 180 },
        lifespan: { min: 200, max: 200 },
        blendMode: 'ADD',
        on: true,
        maxParticles: 80,
        x: 600,
        y: 610
        });
      this.propulsion_particles.setDepth(2)

      let style = { font: '20px Arial', fill: '#ffffff' };
      let style2 = { font: '30px Arial', fill: '#ffffff' };

      this.force = 0;
      this.distanceY = 0;
      this.distanceX = 0;
      this.angle = 0;
      this.speedX = 0;
      this.seconds = 0
      this.minutes = 0
      this.velocityX = 0;
      this.positionYold = 0
      this.positionXold = 0

      this.highscoreText = this.add.text(20, 20, 'Highscore: ' + Math.floor(highscore), style);
      this.debugText = this.add.text(20, 40, + Math.floor(highscore), style);
      this.thrustText = this.add.text(72, 700, this.acceleration, style);
      this.speedText = this.add.text(173, 700, this.force, style);
      this.distanceYText = this.add.text(273, 700, 0, style);
      this.tplus = this.add.text(520, 750, "T+00:00:00", style2);
      this.tplus.setDepth(4)  

      this.asteroids = this.physics.add.group(); 
      this.satellites = this.physics.add.group(); 
      this.clouds = this.physics.add.group();


      this.arrow = this.input.keyboard.createCursorKeys();
      this.rkey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.R);


      this.timer = this.time.addEvent({
        delay: 1000,                
        callback: this.increaseTimer,
        callbackScope: this,
        loop: true
    });

      this.timer = this.time.addEvent({
        delay: 50,                
        callback: this.refreshSkyColor,
        callbackScope: this,
        loop: true
    });


    }

    update() {

      this.debugText.setText(this.boosterSound.volume)
      this.speedText.setText(Math.round(this.force));
      this.thrustText.setText(Math.round(this.acceleration * 100))

      this.force += this.acceleration/10

      ///garbage collection (far away asteroids)
      this.asteroids.children.each( function(p){
        if(p.y > 1700 && p.active){
          console.log("killed asteroid")
          p.setActive(false)
          p.setVisible(false)
        }
      },this)

      
      //================== LOW HEIGHT CHECKS

      if(this.distanceY < 20 && this.distanceY != 0){
        if(this.acceleration > -0.5){
          this.acceleration -= (20 - this.distanceY)/20 * 0.003
        }
      }

      if(this.distanceY < 100){
        this.soundManager()
        //this.addTurbolences()
        this.checkLanded()
        this.checkAirspaceBounds()
        this.setDustEmitterCheck()
        this.blackbirdEgg()

        if(this.distanceY > 0.5 && this.fog == true ){
          this.o2_emitter.stop()
          this.o2_emitter2.stop()
          this.o2_emitter3.stop()
          this.fog = false
        }
      }

      //============= GENERAL CHECKS

      this.setPropulsionEmitterState()

      this.roadsterEgg()

      //======================================   UI-Management
      this.handleTimeText()
      this.setCursorPosition()
      this.setThrustPositions()
      this.setAltitudePositions()

      this.distanceYText.setText(Math.floor(this.distanceY));

      if (this.distanceY > highscore){
        highscore = this.distanceY
        this.highscoreText.setText("Highscore: " + Math.floor(highscore))
      }

      //======================================   Controls
      if(this.rkey.isDown)
        this.restart()

      if(this.arrow.down.isDown && this.distanceY >= 0 && this.alive){
        this.acceleration -= 0.005
        //decrease thrust

      }

      if(this.arrow.up.isDown && this.alive){
        this.started = true
        this.acceleration += 0.005
        //increase thrust

      }

      if(this.arrow.right.isDown && this.distanceY > 0){
        this.rocket.angle += 1   //angle 
      }

      if(this.arrow.left.isDown && this.distanceY > 0 ){
        this.rocket.angle -= 1  //angle
      }



      //======================================   Rocket-Management



      //set rocket thrust particle angle
      if (this.rocket.angle != this.oldangle){
        this.newangle = this.rocket.angle
        this.oldangle = this.newangle
        this.propulsion_emitter.setAngle(this.rocket.angle + 90)  
        //maybe set lifetime of particles relative to force?        
      }
    

      //calculate current position
      this.calculateCurrentCoords()

      this.oldspeedX = this.speedX
      this.oldspeedY = this.speedY
      //calculate x and y speeds
      this.calculateXandYSpeeds()
      //set calculated speeds to objects
      if (this.speedX != this.oldspeedX || this.speedY != this.oldspeedY)
        this.refreshVelocity(this.speedX, this.speedY);

      //======================================   Collision-Management

      this.spawnNewObstaclesYAxis()
      this.spawnNewObstaclesXAxis()


      //maybe combine sat and ast groups?
      if(this.physics.overlap(this.rocket, this.asteroids)){
        this.hitSpaceObstacle()
      }

      if(this.physics.overlap(this.rocket, this.satellites)){
        this.hitSpaceObstacle()
      }
    }

    addSomeTopAsteroids(){
      if (this.force == 0)
        return;
      var i = Math.floor(this.lookup() * 10 + this.distanceY/100) + 1
      for (i ;i > 0; i--){
        this.addObstacleTopRandLoc()
      }
    }

    addSomeRightAsteroids(){
      if (this.force == 0)
        return;
      var l = Math.floor(this.lookup() * 4 + this.distanceY/100) + 1
      for (l ;l > 0; l--){
        this.addObstacleRightRandLoc()
      }
    }

    addSomeLeftAsteroids(){
      if (this.force == 0)
        return;
      var k = Math.floor(this.lookup() * 4 + this.distanceY/100) + 1
      for (k ;k > 0; k--){
        this.addObstacleLeftRandLoc()
      }
    }

    addObstacleTopRandLoc(){
      let xCoord = Math.floor((this.lookup() * 1600) - 200)
      let yCoord = Math.floor(this.lookup() *300 ) -350;
      this.createSpaceObstacle(yCoord, xCoord)
    }

    addObstacleLeftRandLoc(){
      let yCoord = Math.floor(this.lookup() * 900)
      let xCoord = Math.floor(this.lookup() *300 ) -350;
      this.createSpaceObstacle(yCoord, xCoord)
    }

    addObstacleRightRandLoc(){
      let yCoord = Math.floor(this.lookup() * 900)
      let xCoord = Math.floor(this.lookup() *300 ) + 1250;
      this.createSpaceObstacle(yCoord, xCoord)
    }

    hitSpaceObstacle(){
      this.explosionSound.play()
      this.propulsion_emitter.on = false;
      this.propulsion_emitter.killAll()
      this.force = 0
      this.speedY = 0;
      this.speedX = 0
      this.refreshVelocity(0,0)

      this.alive = false;
      console.log("hit asteroid!")
      this.explosion_emitter.start()
      this.spaceshipSound.stop()
      this.boosterSound.stop()
      this.rocket.destroy()
      this.explosion_emitter.active = true;
      this.explosion_emitter.on = true;
      this.explosion_emitter.explode(100)
      let timer4 = this.time.delayedCall(450, ()=>{
        this.tweens.add({
          targets:  this.deathscreen,
          alpha:   1,
          duration: 1000
        });
      }, null, this);

      var timer = this.time.delayedCall(250, ()=>{this.explosion_emitter.on = false;}, null, this);
      var timer2 = this.time.delayedCall(2000, ()=>{this.restart()}, null, this);
    }

    setThrustPositions(){
      if(Math.abs(this.force) <= 9){
        this.thrustText.x = 72
        this.thrustText.y = 700
      }
        

      if(Math.abs(this.force) > 9){
        this.thrustText.x = 65
        this.thrustText.y = 700
      }

      if(Math.abs(this.force) > 99){
        this.thrustText.x = 60
        this.thrustText.y = 700
      }
    }

    setDustEmitterCheck(){

      //rocket angle range = -90 till 90
      //map this to gravity 200 till -200
      if(this.dust == true){
        let grav = this.rocket.angle/-90 * 200
        this.dust_emitter.setGravityX(grav)
        console.log(this.rocket.angle)
      }

      if ((this.distanceY > 0.6 || Math.round(100* this.acceleration) == 0 ) && this.dust == true) {
        this.dust_emitter.on = false;
        this.gdust_emitter.on = false;
        this.dust = false
      }

      if(this.distanceY < 0.8 && Math.round(100* this.acceleration) != 0 && this.dust == false){
        this.dust_emitter.on = true;
        this.gdust_emitter.on = true;
        this.dust = true
      }

    }

    blackbirdEgg(){
      if(this.eggOne == true)
        this.blackbird.body.velocity.y = this.speedY

      if(this.distanceY > 30 && this.distanceY < 40 && this.eggOne == false && Math.random() < 0.001){
        this.blackbird = this.physics.add.sprite(1300, 0, 'blackbird');
        console.log("spawned blackbird")
        this.blackbird.body.velocity.x = -300
        this.blackbird.body.velocity.y = this.speedY
        this.eggOne = true
      }
    }


    roadsterEgg(){
      if(this.distanceY > 0 && this.eggTwo == false && Math.random() < 0.0001){
        this.spacetesla = this.physics.add.sprite(450, -250, 'spacetesla');
        this.asteroids.add(this.spacetesla)
        this.spacetesla.body.velocity.y = this.speedY 
        this.spacetesla.body.velocity.x = this.speedX
        console.log("spawned spacetesla")
        this.eggTwo = true
      }

    }

    setAltitudePositions(){
      if(Math.abs(this.distanceY) <= 9.9){
        this.distanceYText.x = 273
        this.distanceYText.y = 700
      }
        

      if(Math.abs(this.distanceY) > 9.9){
        this.distanceYText.x = 269
        this.distanceYText.y = 700
      }

      if(Math.abs(this.distanceY) > 99){
        this.distanceYText.x = 263
        this.distanceYText.y = 700
      }
    }

    setCursorPosition(){
      this.cursor.angle = (120 * (this.distanceY/1000)) - 60
      if (this.cursor.angle > 60 )
        this.cursor.angle = 60
    }

    setPropulsionEmitterState(){
      if(Math.round(this.acceleration * 100) == 0 && this.propulsion_emitter.on == true)
        this.propulsion_emitter.on = false
    
      if (Math.round(this.acceleration * 100) != 0 && this.propulsion_emitter.on == false)
        this.propulsion_emitter.on = true
    }

    calculateXandYSpeeds(){
      if (this.rocket.angle <= 90 && this.rocket.angle > 0){
        this.speedX =  -1 *(this.force * Math.sin(this.rocket.rotation))
        this.speedY = (this.force * Math.cos(this.rocket.rotation))
      } else if (this.rocket.angle > 90 && this.rocket.angle <= 180){
        this.speedX = Math.sin(2*Math.PI - this.rocket.rotation) * this.force
        this.speedY = Math.cos(2*Math.PI - this.rocket.rotation ) * this.force
      } else if (this.rocket.angle > -180 && this.rocket.angle <= -90){
        this.speedX =  (Math.sin(this.rocket.rotation - Math.PI) * this.force)
        this.speedY =  -1* (Math.cos(this.rocket.rotation - Math.PI) * this.force)
      } else if (this.rocket.angle > -90 && this.rocket.angle <= 0){
        this.speedX = -1* (Math.sin(this.rocket.rotation) * this.force)
        this.speedY = (Math.cos(this.rocket.rotation) * this.force)
      }
    }

    calculateCurrentCoords(){
    if (this.speedX > 0)
      this.distanceX += 1/60 * this.speedX/100
    if (this.speedX < 0)
      this.distanceX += 1/60 * this.speedX/100

    if (this.speedY > 0)
      this.distanceY += 1/60 * this.speedY/100
    if (this.speedY < 0)
      this.distanceY += 1/60 * this.speedY/100
    }

    o2EmitterInit(){
      var o2_particles = this.add.particles("cursor");
      this.o2_emitter = o2_particles.createEmitter({
        alpha: { start: 0.5, end: 0.1 },
        scale: { start: 0.5, end: 0.2 },
        rotate: { min: -180, max: 180 },
        lifespan: { min: 1600, max: 4600 },
        blendMode: 'NORMAL',
        frequency: 80 ,
        bounce: 0,
        speedX: 10,
        on: true,
        maxParticles: 5000,
        collideBottom: true,
        x: {min: -30, max: 30 },
        y: {min: -5, max: 10 },
        });
      o2_particles.setDepth(1)
      this.o2_emitter.startFollow(this.floor,0,-110,false)      
      
      var o2_particles2 = this.add.particles("cursor");
      this.o2_emitter2 = o2_particles2.createEmitter({
        alpha: { start: 0.5, end: 0.1 },
        scale: { start: 0.5, end: 0.2 },
        rotate: { min: -180, max: 180 },
        lifespan: { min: 1600, max: 4600 },
        blendMode: 'NORMAL',
        frequency: 80 ,
        bounce: 0,
        speedX: -10,
        on: true,
        maxParticles: 5000,
        collideBottom: true,
        x: {min: -30, max: 30 },
        y: {min: -5, max: 10 },
        });
      o2_particles2.setDepth(1)
      this.o2_emitter2.startFollow(this.floor,0,-110,false)

      var o2_particles3 = this.add.particles("cursor");
      this.o2_emitter3 = o2_particles3.createEmitter({
        alpha: { start: 0.9, end: 0.5 },
        scale: { start: 0.3, end: 0.3 },
        rotate: { min: -180, max: 180 },
        lifespan: { min: 1600, max: 5600 },
        blendMode: 'NORMAL',
        frequency: 500 ,
        speedY: 10,
        on: true,
        maxParticles: 5000,
        collideBottom: true,
        x: {min: 610, max: 613},
        y: 560
        });
      o2_particles3.setDepth(1)
    }

    createSpaceObstacle(yCoord, xCoord){
      if(this.distanceY < 50){
        if (this.lookup() > 0.3)
          return;
        this.cloud = this.physics.add.sprite(xCoord,yCoord, 'cloud');
        this.cloud.setSize(40,80)
        this.clouds.add(this.cloud)
        this.cloud.alpha = this.lookup()
        this.cloud.body.velocity.y = this.speedY
        this.cloud.body.velocity.x = this.speedX
        this.cloud.setDepth(Math.floor(this.lookup() + 0.5))

      } else if (this.distanceY < 100){
          
        this.starlink = this.physics.add.sprite(xCoord, yCoord,'starlink');
        this.satellites.add(this.starlink)
        this.starlink.body.velocity.y = this.speedY
        this.starlink.body.velocity.x = this.speedX
        this.starlink.angle = this.lookup()*360 +1

      } else if (this.distanceY > 150) {

        let type = Math.floor(this.lookup() *3)
        switch (type){
          case 0:
            this.asteroid = this.physics.add.sprite(xCoord, yCoord,'asteroid');
            this.asteroid.body.setSize(90,80)
            break;
          case 1:
            this.asteroid = this.physics.add.sprite(xCoord, yCoord,'asteroidsmall');
            this.asteroid.body.setSize(37,36)
            break;
          case 2:
            this.asteroid = this.physics.add.sprite(xCoord, yCoord,'asteroidverysmall');
            this.asteroid.body.setSize(20,20)
            break;
        }
  
        this.asteroids.add(this.asteroid)
        this.asteroid.body.velocity.y = this.speedY
        this.asteroid.body.velocity.x = this.speedX

      }
    }

    checkLanded(){
      if(Math.abs(this.rocket.angle) > 10 && this.distanceY <= 0.01){
        this.hitSpaceObstacle()
      }
      if(this.distanceY < 0){
        this.force = 0
        this.distanceY = 0
        this.acceleration = 0
        this.velocityX = 0
        this.speedText.setText(this.force);
      }
    }

    checkAirspaceBounds(){
      if(Math.abs(this.distanceX) > 8.5 && this.distanceY < 2)  //display notification, you left the assigned airspace and were shot down!
        this.hitSpaceObstacle()
    }

    spawnNewObstaclesYAxis(){
      this.positionYnew = Math.floor(this.distanceY)
      if(this.positionYnew % 5 == 0 && this.positionYnew != this.positionYold ){ 
        //better save the values already visited and check if in the list
          this.positionYold = this.positionYnew
          console.log("added top ast")
          this.addSomeTopAsteroids()        
      }
    }

    spawnNewObstaclesXAxis(){
      this.positionXnew = Math.floor(this.distanceX)
      if(this.positionXnew % 5 == 0 && this.positionXnew != this.positionXold && this.distanceY >5 ){ 
        //better save the values already visited and check if in the list
          this.positionXold = this.positionXnew
          console.log("added right ast")
          this.addSomeRightAsteroids()     
          this.addSomeLeftAsteroids()   
      }
    }

    restart(){
      this.scene.restart()
      this.spaceshipSound.stop()
      this.boosterSound.stop()
      this.force = 0
      this.acceleration = 0
      this.alive = true;
      this.distanceY = 0
      this.speedY = 0
      this.propulsion_emitter.on = false;
    }

    addTurbolences(){
      if(this.distanceY < 40 && this.distanceY != 0){
        this.force += this.lookup()

        if(this.lookup() >= 0.5){
          this.speedX -= this.lookup()*3
          this.speedY -= this.lookup()*3
          this.rocket.angle -= this.lookup()/10
        } else {
          this.rocket.angle += this.lookup()/10
          this.speedX += this.lookup()*3
          this.speedY += this.lookup()*3
        }
      }
    }

    soundManager(){

      if (this.acceleration == 0)
        this.boosterSound.volume = 0

      if (Math.round(this.acceleration*100) < 100  && this.distanceY < 50 && this.running && this.alive)
        this.boosterSound.volume = Math.abs(100* this.acceleration)/100


      if(!this.boosterSound.isPlaying && this.distanceY < 50 && this.alive){
        this.spaceshipSound.stop()
        this.boosterSound.play()       

      } else if(!this.spaceshipSound.isPlaying &&  this.distanceY > 50 && this.alive) {
        
        this.tweens.add({
          targets:  this.boosterSound,
          volume:   0,
          duration: 3000
        });

        this.running = false
        var timer3 = this.time.delayedCall(3000, ()=>{this.boosterSound.stop()}, null, this);
        this.spaceshipSound.play()
        this.spaceshipSound.setVolume = 1
        
      }
    }

    refreshVelocity(x, y){

      console.log("changed velo")
      if (isNaN(x) || isNaN(y))
        return;

      this.asteroids.children.each( function(p){
        p.body.velocity.x = x;
        p.body.velocity.y = y;
    },this)

    this.satellites.children.each( function(p){
      p.body.velocity.x = x;
      p.body.velocity.y = y;
      p.angle += 0.2 
    },this)


    this.clouds.children.each( function(p){
      p.body.velocity.x = x;
      p.body.velocity.y = y;
    },this)



      this.floor.body.velocity.x = x;
      this.floor.body.velocity.y = y;
      this.buildings.body.velocity.x = x;
      this.buildings.body.velocity.y = y;
      
      if(y != 0)
        this.background.tilePositionY += -y/100
      if(x != 0)
        this.background.tilePositionX += -x/100
    }

    refreshSkyColor(){
      if(this.distanceY > 70)
        return;

      console.log("changed skycolor")
      if (this.distanceY < 68){
        this.blue = 0.68 - (this.distanceY/100)
      }

      this.skycolor = this.hslToRgb(199/255 ,1-this.random/2, this.blue) 
      this.background.setTint(this.rgbToHex(this.skycolor[0], this.skycolor[1], this.skycolor[2]))
    }

    handleTimeText(){
      var seconds
      var minutes

      if(this.seconds < 10){
        seconds = "0" + this.seconds
      } else {
        seconds = this.seconds
      }

      if(this.minutes < 10){
        minutes = "0" + this.minutes
      } else {
        minutes = this.minutes
      }

      let timestring = "T+00:" + minutes + ":" + seconds
      this.tplus.setText(timestring)
    }

    rgbToHex(r, g, b) {
      console.log("called rgbToHex")
      r = r.toString(16);
      g = g.toString(16);
      b = b.toString(16);
    
      if (r.length == 1)
        r = "0" + r;
      if (g.length == 1)
        g = "0" + g;
      if (b.length == 1)
        b = "0" + b;
    
      return "0x" + r + g + b;
    }

    hslToRgb(h, s, l){
      console.log("called hslToRgb")
      var r, g, b;
  
      if(s == 0){
          r = g = b = l; // achromatic
      }else{
          var hue2rgb = function hue2rgb(p, q, t){
              if(t < 0) t += 1;
              if(t > 1) t -= 1;
              if(t < 1/6) return p + (q - p) * 6 * t;
              if(t < 1/2) return q;
              if(t < 2/3) return p + (q - p) * (2/3 - t) * 6;
              return p;
          }
  
          var q = l < 0.5 ? l * (1 + s) : l + s - l * s;
          var p = 2 * l - q;
          r = hue2rgb(p, q, h);
          g = hue2rgb(p, q, h + 1/3);
          b = hue2rgb(p, q, h - 1/3);
      }
  
      return [Math.round(r * 255), Math.round(g * 255), Math.round(b * 255)];
    }

    increaseTimer(){
      if(!this.started)
        return
      if (this.seconds == 60){
        this.minutes++
        this.seconds = 1
      }
      else{
        this.seconds++;
      }
    }

    lookup() {
      return ++this.i >= this.lookupTable.length ? this.lookupTable[this.i=0] : this.lookupTable[this.i];
    }
    

}


new Phaser.Game({
    width: 1200, // Width of the game in pixels
    height: 800, // Height of the game in pixels
    backgroundColor: '#000000', // The background color
    renderer: Phaser.AUTO,
    scene: mainScene, // The name of the scene we created
    physics: { default: 'arcade' }, // The physics engine to use
    parent: 'game', // Create the game inside the <div id="game"> 
});