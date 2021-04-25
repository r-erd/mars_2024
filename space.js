var highscore = 0;
var arcade = true //switches the acceleration / speed system and the mars-existence
var frameTime = 0;
var gameTick = 0;
var DEBUG = false;

class mainScene {


    //============== FEATURES TO IMPLEMENT =================

    //destroy plane on collision
    //boring machine skin longer
    //maybe add hyperloops to underground (with driving teslas?)
    //add smartphone mode and "screen to small" message for small screens
    //add known bugs + 0-9 controls to the website

    //ARCADE MODE
    //TODO add higher speed -> less left/right tilting for arcade mode OR no breaking!???
    //TODO improve the way it gets harder (upper limit)

    //REAL MODE
    //TODO add mars at 1000 - land there ->  success + less asteroids on approach +dont spawn stuff IN mars
    //TODO add airspace bounds for mars
    //TODO somehow display x-Axis speed
    //TODO change mars texture
    //TODO add dust emitter on mars
    //TODO real mode: maybe add limited fuel and refueling in sky (meet other starship in orbit back to back)
    //TODO real mode: make numbers fit to the real world (alt, speed)
    //TODO add buildings to mars (and a few already landed rockets + craters and the mars rover driving around easteregg)

    //================ BUGS TO FIX ================
    //TODO explosion sound too late when shot down
    //TODO explosion sound sounds twice when asteroid is hit (on respawn again)
    //TODO fix ground hitbox
    //TODO make mars texture higher
    //TODO check performance / lagg? remove clouds and planes?

    // ================= OTHER
    //TODO replace skins with selfmade skins (rocket, blackbird, spacetesla, boringmachine)
    //better ground building skins
    //change overlay (dont display "mars" in explore mode, what for?)
    //add idle sound (at ground, not starting, thrust 0 (zischen?))
    //add more plane skins (different colors)
    //add the sat skins
  




    preload() {
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
      this.load.image('cloud', 'assets/cloud1.png');
      this.load.image('cloud2', 'assets/cloud2.png');
      this.load.image('cloud3', 'assets/cloud3.png');
      this.load.image('blackbird', 'assets/blackbird.png');
      this.load.image('spacetesla', 'assets/spacetesla.png');
      this.load.image('boring', 'assets/boringmachine.png');
      this.load.image('mars', 'assets/mars.png');
      this.load.image('plane1-left', 'assets/plane1-left.png');
      this.load.image('plane2-right', 'assets/plane2-right.png');
      this.load.image('plane3-left', 'assets/plane3-left.png');

    }

    create() {
      /*
      let width = window.screen.width
      let { widthGame, heightGame } = this.sys.game.scale.gameSize;
      if (width <= 700){
        this.cameras.main.scrollX = 600 - widthGame/2 
        console.log("small")
      }
      */







     var r3 = this.add.rectangle(1200/2, 800/2, 1200, 800);

     r3.setStrokeStyle(2, 0x383838)
     r3.setDepth(6)


      this.boring = false
      this.random = Math.random()
      this.eggOne = false;
      this.eggTwo = false;
      this.i=1e6


      this.lookupTable = []
      for (this.i, this.i > 0; this.i--;) {
        this.lookupTable.push(Math.random());
      }





      this.marsExists = false
      this.fog = true
      this.running = true
      this.started = false
      this.debug = false
      this.dust = false
      this.background = this.add.tileSprite(600, 420, 1250, 850, 'light');
      this.physics.add.existing(this.background, true);
      this.background = this.add.tileSprite(600, 420, 1250, 850, 'light');

      this.floor = this.physics.add.sprite(600, 715, 'floor');
      this.overlay = this.add.sprite(600, 400, 'overlay');
      this.overlay.setDepth(4)
      
      this.cursor = this.add.sprite(600, 933, 'cursor');
      this.cursor.setOrigin(0,17);
      this.cursor.angle = -60

      this.buildings = this.physics.add.sprite(601, 565, 'buildings');   
      this.center_particle = this.physics.add.sprite(600,710)

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
      this.rocket.body.setSize(10,10,true); //hitbox
      this.rocket.setOffset(12,75)
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
      this.dust_emitter.startFollow(this.center_particle,0,-90,false)

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
      this.gdust_emitter.startFollow(this.center_particle,0,-100,false)
      


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
      //this.propulsion_emitter.startFollow(this.rocket,0,80,true)

      let style = { font: '20px Arial', fill: '#ffffff' };
      let style2 = { font: '30px Arial', fill: '#ffffff' };
      let style3 = { font: '15px Arial', fill: '#ffffff' };
      let style4 = { font: '10px Arial', fill: '#ffffff' };

      this.force = 0;
      this.distanceY = 0;
      this.distanceX = 0;
      this.angle = 0;
      this.speedX = 0;
      this.seconds = 0
      this.minutes = 0
      this.velocityX = 0;
      this.speedY = 0
      this.positionYold = 0
      this.positionXold = 0
      this.thrust = 0

      this.highscoreText = this.add.text(20, 20, 'Highscore: ' + Math.floor(highscore), style);
      this.thrustText = this.add.text(72, 700, 0, style);
      this.speedText = this.add.text(173, 700, 0, style);
      this.speedTextUnit = this.add.text(173, 720, 0, style4);
      this.altitudeTextUnit = this.add.text(273, 720, 0, style4);
      this.thrustTextUnit = this.add.text(72, 720, 0, style4);
      this.distanceYText = this.add.text(273, 700, 0, style);
      this.tplus = this.add.text(520, 750, "T+00:00:00", style2);
      this.missionText = this.add.text(550, 779, "Mission Mars", style3);
      this.deathText = this.add.text(525, 350, "Lost Signal", style2);
      this.deathText2 = this.add.text(415, 384, "", style3);
      this.deathText.alpha = 0;
      this.deathText2.alpha = 0;

      this.deathText.setDepth(6)
      this.deathText2.setDepth(6)
      this.deathscreen.setDepth(5)

      this.highscoreText.setDepth(4)
      this.thrustText.setDepth(4)
      this.speedText.setDepth(4)
      this.speedTextUnit.setDepth(4)
      this.missionText.setDepth(4)
      this.altitudeTextUnit.setDepth(4)
      this.thrustTextUnit.setDepth(4)
      this.distanceYText.setDepth(4)
      this.tplus.setDepth(4)


      this.speedTextUnit.setText("km/h")
      this.altitudeTextUnit.setText("km")
      this.thrustTextUnit.setText("%")

      if(arcade){
        this.missionText.setText("Mission Explore");
      } else {
        this.missionText.setText("Mission Mars");
      }

      if(this.lookup() <= 0.1){

        var boring_particles = this.add.particles("sand_particle");
        this.boring_emitter = boring_particles.createEmitter({
          alpha: { start: 0.5, end: 0.5 },
          scale: { start: 0.5, end: 0.2 },
          rotate: { min: -180, max: 180 },
          lifespan: 10,
          blendMode: 'ADD',
          frequency: 1 ,
          bounce: 0,
          GravityY : 10,
          active : false,
          maxParticles: 5000,
          collideBottom: true,
          x: {min: -1, max: 1 },
          y: {min: -6, max: 6 },
          });
        boring_particles.setDepth(3)

        this.boringmachine = this.physics.add.sprite(1390, 745, 'boring');  //adjust this if size changes!!
        this.boringmachine.setScale(0.5)
        this.boringmachine.body.velocity.x = -0.2
        this.boringmachine.setDepth(2)
        this.boring = true
        this.boring_emitter.startFollow(this.boringmachine,-188,0,false)   //offset ist länge/2 (aktuell 350 -> 175) plus minus bisschen
        this.boring_emitter.active = true; 
      }


      this.tplus.setDepth(4)  
      this.missionText.setDepth(4)

      this.asteroids = this.physics.add.group(); 
      this.satellites = this.physics.add.group(); 
      this.clouds = this.physics.add.group();
      this.planes = this.physics.add.group();


      let cc = Math.floor(Math.random() *3)
      for(let i = 0; i<cc; i++){
        let cloudvariant = this.lookup()
        let xp = 500 + (Math.random() * 400) -200
        let yp = 300 + (Math.random() * 150) -70
        if(cloudvariant < 0.33){
          this.cloud = this.physics.add.sprite(xp,yp, 'cloud');
        } else if (cloudvariant > 0.33 && cloudvariant < 0.66){
          this.cloud = this.physics.add.sprite(xp,yp, 'cloud2');
        } else {
          this.cloud = this.physics.add.sprite(xp,yp, 'cloud3');
        }
        this.cloud.setSize(40,80)
        this.clouds.add(this.cloud)
        this.cloud.alpha = this.lookup()
        this.cloud.body.velocity.y = this.speedY
        this.cloud.body.velocity.x = this.speedX
        this.cloud.setDepth(Math.floor(this.lookup() + 0.5))
      }



      this.arrow = this.input.keyboard.createCursorKeys();
      this.rkey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.R);
      this.mkey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.M);
      this.zeroKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.ZERO);
      this.oneKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.ONE);
      this.twoKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.TWO);
      this.threeKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.THREE);
      this.fourKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.FOUR);
      this.fiveKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.FIVE);
      this.sixKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SIX);
      this.sevenKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SEVEN);
      this.eightKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.EIGHT);
      this.nineKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.NINE);


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

    update(time, delta) {

      frameTime += delta

      if (frameTime > 16.5) {  
          frameTime = 0;
          gameTick++;
          this.updateScene()
      } 
    }


    updateScene(){
      if(this.distanceY > 0 && this.speedY > -150 && !arcade){
        if(this.distanceY < 60){
          //earth gravity
          this.speedY -= 0.2 * (1 - this.distanceY/60)
        } 
        if(this.distanceY > 60){
          this.speedY += 0.2 * 0.3 * ((this.distanceY-60)/40)
        }

        this.refreshVelocity(this.speedX,this.speedY)
      } else {
        this.force += this.thrust/1000
      }


      if(arcade){
        this.speedText.setText(Math.round(this.force*10));
      } else {
        this.speedText.setText(Math.round(this.speedY));
      }



      ///garbage collection (far away asteroids)
      this.asteroids.children.each( function(p){
        if(p.y > 1700 && p.active){
          console.log("killed asteroid")
          p.setActive(false)
          p.setVisible(false)
        }
      },this)

      
      //================== LOW HEIGHT CHECKS



      if(this.distanceY < 100){
        this.soundManager()
        this.addTurbolences()

        this.checkAirspaceBounds()
        this.setDustEmitterCheck()
        this.blackbirdEgg()

        if((this.distanceY > 0.5 && this.fog == true) || this.thrust != 0 ){
          this.o2_emitter.stop()
          this.o2_emitter2.stop()
          this.o2_emitter3.stop()
          this.fog = false
        }
      }

      //============= GENERAL CHECKS

      if( this.distanceY > 90 && this.marsExists != true && !arcade){
        this.mars = this.physics.add.sprite(0,-550, 'mars');   //equals to landing at 98.7
        this.mars.setDepth(0)
        this.marsExists = true
      }

      this.checkLanded()
      this.setPropulsionEmitterState()

      this.roadsterEgg()

      //======================================   UI-Management
      this.handleTimeText()
      this.setCursorPosition()
      this.setThrustPositions()
      this.setAltitudePositions()
      this.setSpeedPositions()

      this.distanceYText.setText(Math.round(this.distanceY*10)/10);

      if (this.distanceY > highscore){
        highscore = this.distanceY
        this.highscoreText.setText("Highscore: " + Math.floor(highscore))
      }

      //======================================   Controls
      if(this.rkey.isDown)
        this.restart()

      if(this.zeroKey.isDown)
        this.thrust = 2;
      
      if(this.oneKey.isDown)
        this.thrust = 10;

      if(this.twoKey.isDown)
        this.thrust = 20;

      if(this.threeKey.isDown)
        this.thrust = 30;

      if(this.fourKey.isDown)
        this.thrust = 40;

      if(this.fiveKey.isDown)
        this.thrust = 50;

      if(this.sixKey.isDown)
        this.thrust = 60;

      if(this.sevenKey.isDown)
        this.thrust = 70;

      if(this.eightKey.isDown)
        this.thrust = 80;

      if(this.nineKey.isDown)
        this.thrust = 90;

      this.thrustText.setText(this.thrust)
        
      /*
      if(Phaser.Input.Keyboard.JustDown(this.mkey) && this.distanceY == 0){
        arcade = !arcade

        if(arcade){
          this.missionText.setText("Mission Explore");
        } else {
          this.missionText.setText("Mission Mars");
        }
      }
      */




      if(!arcade){

        if(this.arrow.down.isDown && this.distanceY >= 0 && this.alive && this.thrust > 0){
          this.thrust -= 1
          //decrease thrust
        }

        if(this.arrow.up.isDown && this.alive && this.thrust < 100){
          this.started = true
          this.thrust += 1
          //increase thrust
        }

      } else {

        if(this.arrow.down.isDown && this.distanceY >= 0 && this.alive && this.thrust > 2){
          this.thrust -= 1
          //decrease thrust
        }

        if(this.arrow.up.isDown && this.alive && this.thrust < 100){
          this.started = true
          this.thrust += 1
          //increase thrust
        }
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

      
      if(arcade){
        if(this.physics.overlap(this.rocket, this.asteroids)){
          this.explosionSound.play()
          this.deathText2.setText("- rapid unscheduled disassembly due to a collison -")
          this.hitSpaceObstacle()
        }
  
        if(this.physics.overlap(this.rocket, this.satellites)){
          this.explosionSound.play()
          this.deathText2.setText("- rapid unscheduled disassembly due to a collison -")
          this.hitSpaceObstacle()
        }

        if(this.physics.overlap(this.rocket, this.planes)){
          this.explosionSound.play()
          this.deathText2.setText("- rapid unscheduled disassembly due to a collison -")
          this.hitSpaceObstacle()
        }
      }
    }

    //redo for real mode with no asts only sats and collision with sats enabled (not immovable) (maybe?)
    addSomeTopAsteroids(){
      var i = Math.floor(this.lookup() * 10 + this.distanceY/100) + 1
      for (i ;i > 0; i--){
        this.addObstacleTopRandLoc()
      }
    }

    //redo for real mode with no asts only sats and collision with sats enabled (not immovable)
    addSomeRightAsteroids(){
      var l = Math.floor(this.lookup() * 4 + this.distanceY/100) + 1
      for (l ;l > 0; l--){
        this.addObstacleRightRandLoc()
      }
    }

    //redo for real mode with no asts only sats and collision with sats enabled (not immovable)
    addSomeLeftAsteroids(){
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
      this.explosion_emitter.active = true;
      this.explosion_emitter.on = true;
      this.explosion_emitter.explode(100)
      this.explosion_emitter.start()

      this.propulsion_emitter.on = false;
      this.propulsion_emitter.killAll()
      this.force = 0
      this.speedY = 0;
      this.speedX = 0
      this.thrust = 0
      this.refreshVelocity(0,0)

      this.alive = false;
      console.log("hit something!")


      this.spaceshipSound.stop()
      this.boosterSound.stop()
      this.rocket.destroy()

      this.time.delayedCall(450, ()=>{
        this.tweens.add({
          targets:  this.deathscreen,
          alpha:   1,
          duration: 1000
        });
      }, null, this);

      this.time.delayedCall(1000, ()=>{
        this.deathText.alpha = 1;
        this.deathText2.alpha = 1;
        }, null, this);
      this.time.delayedCall(250, ()=>{this.explosion_emitter.on = false;}, null, this);
      this.time.delayedCall(3000, ()=>{this.restart()}, null, this);
    }

    setThrustPositions(){
      if(Math.abs(this.thrust) <= 9){
        this.thrustText.x = 72
        this.thrustText.y = 700
      }
        

      if(Math.abs(this.thrust) > 9){
        this.thrustText.x = 65
        this.thrustText.y = 700
      }

      if(Math.abs(this.thrust) > 99){
        this.thrustText.x = 60
        this.thrustText.y = 700
      }
    }

    setDustEmitterCheck(){

      if(this.dust == true){
        let grav = this.rocket.angle/-90 * 200
        this.dust_emitter.setGravityX(grav)
        console.log(this.rocket.angle)
      }

      if ((this.distanceY > 0.6 || this.thrust == 0 || Math.abs(this.rocket.angle) > 70 ) && this.dust == true ) {
        console.log("disabled dust")
        this.dust_emitter.on = false;
        this.gdust_emitter.on = false;
        this.dust = false
      }

      if((this.distanceY < 0.8 && this.thrust != 0 && Math.abs(this.rocket.angle) < 70) && this.dust == false){
        console.log("enabled dust")
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
      if(this.distanceY > 200 && this.eggTwo == false && Math.random() < 0.0001){
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
        this.distanceYText.x = 275
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

    setSpeedPositions(){
      if(Math.abs(this.speedY) < 10){
        this.speedText.x = 175
        this.speedText.y = 700
      }
        

      if(Math.abs(this.speedY) >= 10 && Math.abs(this.speedY) < 99){
        this.speedText.x = 169
        this.speedText.y = 700
      }

      if(Math.abs(this.speedY) > 99){
        this.speedText.x = 165
        this.speedText.y = 700
      }
    }

    setCursorPosition(){
      this.cursor.angle = (120 * (this.distanceY/1000)) - 60
      if (this.cursor.angle > 60 )
        this.cursor.angle = 60
    }

    setPropulsionEmitterState(){
      if(this.thrust == 0 && this.propulsion_emitter.on == true)
        this.propulsion_emitter.on = false
    
      if (this.thrust != 0 && this.propulsion_emitter.on == false)
        this.propulsion_emitter.on = true
    }

    calculateXandYSpeeds(){
      if (arcade){
        if (this.rocket.angle <= 90 && this.rocket.angle > 0){
          this.speedX =  -1 *(this.force *10 * Math.sin(this.rocket.rotation))
          this.speedY = (this.force *10 * Math.cos(this.rocket.rotation))
        } else if (this.rocket.angle > 90 && this.rocket.angle <= 180){
          this.speedX = Math.sin(2*Math.PI - this.rocket.rotation) * this.force*10
          this.speedY = Math.cos(2*Math.PI - this.rocket.rotation ) * this.force*10
        } else if (this.rocket.angle > -180 && this.rocket.angle <= -90){
          this.speedX =  (Math.sin(this.rocket.rotation - Math.PI) * this.force*10)
          this.speedY =  -1* (Math.cos(this.rocket.rotation - Math.PI) * this.force*10)
        } else if (this.rocket.angle > -90 && this.rocket.angle <= 0){
          this.speedX = -1* (Math.sin(this.rocket.rotation) * this.force*10)
          this.speedY = (Math.cos(this.rocket.rotation) * this.force*10)
        }
      } else {
        let factor = 0.4
        if (this.rocket.angle <= 90 && this.rocket.angle > 0){
          this.speedX +=  -1 *(this.thrust/100 * Math.sin(this.rocket.rotation)) * factor
          this.speedY += (this.thrust/100 * Math.cos(this.rocket.rotation))* factor
          
        } else if (this.rocket.angle > 90 && this.rocket.angle <= 180){
          this.speedX += Math.sin(2*Math.PI - this.rocket.rotation) * this.thrust/100 * factor
          this.speedY += Math.cos(2*Math.PI - this.rocket.rotation ) * this.thrust/100  * factor
        } else if (this.rocket.angle > -180 && this.rocket.angle <= -90){
          this.speedX +=  (Math.sin(this.rocket.rotation - Math.PI) * this.thrust/100) * factor
          this.speedY +=  -1* (Math.cos(this.rocket.rotation - Math.PI) * this.thrust/100)  * factor
        } else if (this.rocket.angle > -90 && this.rocket.angle <= 0){ 
          this.speedX += -1* (Math.sin(this.rocket.rotation) * this.thrust/100) * factor
          this.speedY += (Math.cos(this.rocket.rotation) * this.thrust/100) * factor
        }

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
        scale: { start: 0.8, end: 0.8 },
        rotate: { min: -180, max: 180 },
        lifespan: { min: 2600, max: 4600 },
        blendMode: 'NORMAL',
        frequency: 200 ,
        bounce: 0,
        speedX: 10,
        on: true,
        maxParticles: 5000,
        collideBottom: true,
        //x: {min: -30, max: 30 },
        //y: {min: -15, max: 130 },
        });
      o2_particles.setDepth(1)
      this.o2_emitter.startFollow(this.floor,0,-105,false)      
      
      var o2_particles2 = this.add.particles("cursor");
      this.o2_emitter2 = o2_particles2.createEmitter({
        alpha: { start: 0.5, end: 0.1 },
        scale: { start: 0.8, end: 0.8 },
        rotate: { min: -180, max: 180 },
        lifespan: { min: 2600, max: 4600 },
        blendMode: 'NORMAL',
        frequency: 200 ,
        bounce: 0,
        speedX: -10,
        on: true,
        maxParticles: 5000,
        collideBottom: true,
        x: {min: -30, max: 30 },
        y: {min: -15, max: 130},
        });
      o2_particles2.setDepth(1)
      this.o2_emitter2.startFollow(this.floor,0,-105,false)

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
      if(this.distanceY < 30){

        if(this.distanceY > 2){
          if (this.lookup() > 0.5)
            return;

          if (Math.random() < 0.5){
            console.log("spawned planes " + xCoord +" " + yCoord)
            this.plane1 = this.physics.add.sprite(xCoord,yCoord,'plane1-left');
            this.plane1.state = "left"
            this.planes.add(this.plane1)
            this.plane1.body.velocity.x =  -80 - Math.random() * 60
            this.plane1.body.velocity.y = this.speedY
            this.plane1.setScale(0.15)
            this.plane1.setDepth(1)

          } else {
            console.log("spawned planes " + xCoord +" " + yCoord)
            this.plane2 = this.physics.add.sprite(xCoord,yCoord,'plane2-right');
            this.plane2.state = "right"
            this.planes.add(this.plane2)
            this.plane2.setScale(0.25)
            this.plane2.setDepth(1)
            this.plane2.body.velocity.x = 80 + Math.random() * 40
            this.plane2.body.velocity.y = this.speedY

          }
        }

        if (this.lookup() > 0.5)
          return;
        
        if(xCoord > 0){
          xCoord += 200
        } else {
          xCoord -= 200
        }

        let cloudvariant = this.lookup()
        if(cloudvariant < 0.33){
          this.cloud = this.physics.add.sprite(xCoord,yCoord, 'cloud');
        } else if (cloudvariant > 0.33 && cloudvariant < 0.66){
          this.cloud = this.physics.add.sprite(xCoord,yCoord, 'cloud2');
        } else {
          this.cloud = this.physics.add.sprite(xCoord,yCoord, 'cloud3');
        }

        this.cloud.setSize(40,80)
        this.clouds.add(this.cloud)
        this.cloud.alpha = this.lookup()
        this.cloud.body.velocity.y = this.speedY
        this.cloud.body.velocity.x = this.speedX
        this.cloud.setDepth(Math.floor(this.lookup() + 0.5))

      } else if (this.distanceY < 120){ 
          
        this.starlink = this.physics.add.sprite(xCoord, yCoord,'starlink');
        this.satellites.add(this.starlink)
        this.starlink.body.velocity.y = this.speedY
        this.starlink.body.velocity.x = this.speedX
        //this.starlink.angle = this.lookup()*360 +1

      } else if (this.distanceY > 120) {

        let type = Math.floor(this.lookup() *3)
        switch (type){
          case 0:
            this.asteroid = this.physics.add.sprite(xCoord, yCoord,'asteroid');
            this.asteroid.body.setSize(95,85)
            break;
          case 1:
            this.asteroid = this.physics.add.sprite(xCoord, yCoord,'asteroidsmall');
            this.asteroid.body.setSize(41,44)
            break;
          case 2:
            this.asteroid = this.physics.add.sprite(xCoord, yCoord,'asteroidverysmall');
            this.asteroid.body.setSize(27,25)
            break;
        }
  
        this.asteroids.add(this.asteroid)
        this.asteroid.angle = this.lookup() * 360
        this.asteroid.body.velocity.y = this.speedY
        this.asteroid.body.velocity.x = this.speedX

      }
    }

    checkLanded(){

      //mars
      if(!arcade){
        if(Math.abs(this.speedY) > 15 && this.distanceY >= 98.7){
          this.explosionSound.play()
          this.deathText2.setText("-  the velocity on touchdown was too high -")
          this.hitSpaceObstacle()
        }
  
        if(Math.abs(this.rocket.angle) < 170 && this.distanceY >= 98.7){
          this.explosionSound.play()
          this.deathText2.setText("- the angle on touchdown was too steep -")
          this.hitSpaceObstacle()
        }

        if(this.distanceY > 98.7){
          this.force = 0
          this.speedY = 0
          this.speedX = 0
          this.distanceY = 98.7
          this.velocityX = 0
          this.refreshVelocity(this.speedX,this.speedY)
          this.speedText.setText(this.force);
        }
      }


      //earth
      if(Math.abs(this.speedY) > 15 && this.distanceY <= 0.01){
        this.explosionSound.play()
        this.deathText2.setText("- the velocity on touchdown was (way) too high -")
        this.hitSpaceObstacle()
      }

      if(Math.abs(this.rocket.angle) > 10 && this.distanceY <= 0.01){
        this.explosionSound.play()
        this.deathText2.setText("- the rocket touched the earth in an inappropriate way -")
        this.hitSpaceObstacle()
      }

      if(this.distanceY < 0){
        this.force = 0
        this.speedY = 0
        this.speedX = 0
        this.distanceY = 0
        this.velocityX = 0
        this.refreshVelocity(this.speedX,this.speedY)
        this.speedText.setText(this.force);
      }
    }

    checkAirspaceBounds(){

      if(Math.abs(this.distanceX) > 8.5 && this.distanceY < 2){
        this.explosionSound.play()
                                 
        this.deathText2.setText("- you left the assigned airspace and triggered the LAS -")
        this.hitSpaceObstacle()
      } 
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
      this.deathText.alpha = 0;
      this.deathText2.alpha = 0;
      this.scene.restart()
      this.spaceshipSound.stop()
      this.boosterSound.stop()
      this.force = 0
      this.alive = true;
      this.distanceY = 0
      this.speedY = 0
      this.propulsion_emitter.on = false;
    }

    addTurbolences(){

      if(arcade && this.distanceY > 60)
        return;

      if(this.distanceY > 60 && this.distanceY < 70)
        return;

      if(this.thrust != 0){
        let strength = (0.001 + 0.00001 * Math.abs(this.thrust))
        this.cameras.main.shake(200,strength);
      }
    }

    soundManager(){

      if (this.thrust == 0)
        this.boosterSound.volume = 0

      if(!arcade){
        if (this.thrust < 100  && (this.distanceY < 50 || this.distanceY > 70) && this.running && this.alive)
          this.boosterSound.volume = Math.abs(this.thrust)/200

        if(!this.boosterSound.isPlaying && (this.distanceY < 50 || this.distanceY > 70) && this.alive){
          this.spaceshipSound.stop()
          this.boosterSound.play()       
          this.running = true
        }

      } else {

        if (this.thrust < 100  && this.distanceY < 50 && this.running && this.alive)
          this.boosterSound.volume = Math.abs(this.thrust)/200

        if(!this.boosterSound.isPlaying && this.distanceY < 50  && this.alive){
          this.spaceshipSound.stop()
          this.boosterSound.play()       
          this.running = true
        }
      }



      if(!this.spaceshipSound.isPlaying &&  this.distanceY > 50 && this.distanceY < 70 && this.alive) {
        
        this.tweens.add({
          targets:  this.boosterSound,
          volume:   0,
          duration: 3000
        });

        this.running = false
        this.time.delayedCall(3000, ()=>{this.boosterSound.stop()}, null, this);
        this.spaceshipSound.play()
        this.spaceshipSound.setVolume = 0.5
        
      }
    }

    refreshVelocity(x, y){

      if (isNaN(x) || isNaN(y))
        return;

      this.asteroids.children.each( function(p){
        p.body.velocity.x = x;
        p.body.velocity.y = y;
    },this)

     this.satellites.children.each( function(p){
      p.body.velocity.x = x;
      p.body.velocity.y = y;
      //p.angle += 0.2 
    },this)


      this.clouds.children.each( function(p){
      p.body.velocity.x = x;
      p.body.velocity.y = y;
    },this)

    this.planes.children.each( function(p){

      if(p.state == "right"){
        //goes to the right
        p.body.velocity.x = x + 80
      } else {
        //goes to the left
        p.body.velocity.x = x - 80
      }


      p.body.velocity.y = this.speedY
    },this)



      this.center_particle.body.velocity.y = y;
      this.floor.body.velocity.x = x;
      this.floor.body.velocity.y = y;
      this.buildings.body.velocity.x = x;
      this.buildings.body.velocity.y = y;
      if (this.boring){
        this.boringmachine.body.velocity.x = x;
        this.boringmachine.body.velocity.y = y;
      }

      if(this.marsExists){
        this.mars.body.velocity.x = x;
        this.mars.body.velocity.y = y;
      }

      
      if(y != 0)
        this.background.tilePositionY += -y/100
      if(x != 0)
        this.background.tilePositionX += -x/100
    }

    refreshSkyColor(){
      if (this.distanceY < 68){
        this.blue = 0.68 - (this.distanceY/100)
      }

      if(this.distanceY < 70){
        this.skycolor = this.hslToRgb(0.54 ,1-this.random/2, this.blue) 
        this.background.setTint(this.rgbToHex(this.skycolor[0], this.skycolor[1], this.skycolor[2]))
        //ends at full black
      }

      if(!arcade){
        if(this.distanceY > 70){
          this.red = ((this.distanceY-70)/30) * 0.6
        }

        if(this.distanceY < 100 && this.distanceY > 70 ){
          //starts full black
          this.skycolor = this.hslToRgb(0.1, 0.6, this.red) 
          this.background.setTint(this.rgbToHex(this.skycolor[0], this.skycolor[1], this.skycolor[2]))
        }
      }
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

    hslToRgb(h, s, l) {
      var r, g, b;
    
      if (s == 0) {
        r = g = b = l; // achromatic
      } else {
        function hue2rgb(p, q, t) {
          if (t < 0) t += 1;
          if (t > 1) t -= 1;
          if (t < 1/6) return p + (q - p) * 6 * t;
          if (t < 1/2) return q;
          if (t < 2/3) return p + (q - p) * (2/3 - t) * 6;
          return p;
        }
    
        var q = l < 0.5 ? l * (1 + s) : l + s - l * s;
        var p = 2 * l - q;
    
        r = hue2rgb(p, q, h + 1/3);
        g = hue2rgb(p, q, h);
        b = hue2rgb(p, q, h - 1/3);
      }
    
      return [ Math.round(r * 255), Math.round(g * 255), Math.round(b * 255) ];
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
    width: 1200, // Width of the game in pixels (full width is 1200)
    height: 800, // Height of the game in pixels (full height is 800)
    backgroundColor: '#000000', // The background color
    renderer: Phaser.AUTO,
    scale: {
      mode: Phaser.Scale.FIT,
      autoCenter: Phaser.Scale.CENTER_BOTH,
      parent: 'game',
      max: {
        height: 800,
        width: 1200
        }
    },

    scene: mainScene, // The name of the scene we created
    physics: {
      default: 'arcade',
      arcade: {
          debug: DEBUG
      }
  }
});



