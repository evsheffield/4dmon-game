var game = new Phaser.Game(800, 600, Phaser.AUTO, '', { preload: preload, create: create, update: update, render: render })
  , player
  , bullets
  , emailBullets
  , currentSpeed = 0
  , maximumSpeed = 200
  , nextFire = 0
  , fireRate = 500; // Two bullets per second


function preload() {
  game.load.image('arrow', 'assets/arrow.png');
  game.load.image('emailBullet', 'assets/ball.png');
}

function create() {
  // Use Arcade physics
  game.physics.startSystem(Phaser.Physics.ARCADE);
  
  // Add the player sprite to the game, set the anchor point at its center
  player = game.add.sprite(400, 300, 'arrow');
  player.anchor.setTo(0.5, 0.5);

  // Enable physics on the player
  game.physics.enable(player, Phaser.Physics.ARCADE);

  // Bullet group
  bullets = game.add.group();
  emailBullets = game.add.group(bullets);
  bullets.enableBody = true;
  bullets.physicsBodyType = Phaser.Physics.ARCADE;
  bullets.createMultiple(30, 'emailBullet', 0, false);
  bullets.setAll('anchor.x', 0.5);
  bullets.setAll('anchor.y', 0.5);
  bullets.setAll('checkWorldBounds', true);
  bullets.setAll('outOfBoundsKill', true);
}

function update() {
  // Reset the player's velocities
  player.body.velocity.x = 0;
  player.body.velocity.y = 0;
  player.body.angularVelocity = 0;

  // Apply an angular velocity (turning the player) when pressing 'A'or 'D'
  if(game.input.keyboard.isDown(Phaser.Keyboard.A)) {
    player.body.angularVelocity = -200;
  }
  else if(game.input.keyboard.isDown(Phaser.Keyboard.D)) {
    player.body.angularVelocity = 200;
  }

  // Accelerate up to a max speed while holding down 'W', deccelerate when
  // not pressed
  if(game.input.keyboard.isDown(Phaser.Keyboard.W)) {
    if(currentSpeed < maximumSpeed) {
      currentSpeed += 5;
    }
  }
  else {
    if(currentSpeed > 0) {
      currentSpeed -= 3;
    }
    if(currentSpeed < 0) {
      currentSpeed = 0;
    }
  }

  // Apply velocity based on the current angle when moving forward
  game.physics.arcade.velocityFromAngle(player.angle, currentSpeed, player.body.velocity);

  // Make the player wrap around the screen
  if(player.body.x < 0) {
    player.body.x = 800;
  }
  else if(player.body.x > 800) {
    player.body.x = 0;
  }

  if(player.body.y < 0) {
    player.body.y = 600;
  }
  else if(player.body.y > 600) {
    player.body.y = 0;
  }

  // Fire when the player presses the spacebar
  if(game.input.keyboard.isDown(Phaser.Keyboard.SPACEBAR)) {
    fire();
  }
}

function render() {
  // Debugging info about the player sprite
  game.debug.spriteInfo(player, 30, 30);
}

// Fire a bullet
function fire () {
  if (game.time.now > nextFire){
    // Create a bunch more when we run out
    if(bullets.countDead() === 0) {
      bullets.createMultiple(30, 'emailBullet', 0, false);
    }
    // Pluck a bullet from the group, spawn it at the player location, and shoot it
    nextFire = game.time.now + fireRate;
    var bullet = bullets.getFirstExists(false);
    bullet.reset(player.x, player.y);
    game.physics.arcade.velocityFromAngle(player.angle, 500, bullet.body.velocity);
  }
}
