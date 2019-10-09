class GameState {
  constructor(CanvasX, CanvasY) {

    // Game rendering vars
    this.CanvasX = CanvasX;
    this.CanvasY = CanvasY;

    // Audio
    this.Sound_Explosion = loadSound("/Resources/Audio/Explosion.wav");
    this.Sound_Bruh = loadSound("/Resources/Audio/Bruh.wav"); 
    this.Sound_Shoot = loadSound("/Resources/Audio/Shoot.wav");
    this.Sound_Hurt = loadSound("/Resources/Audio/Player_Hurt.wav");
    this.Sound_Music = loadSound("/Resources/Audio/Music.mp3");
    this.Sound_Music.setVolume(0.1);

    // Animations
    this.Anim_ShooterEnemy = new Animation("/Resources/Sprites/ShooterEnemy00.png", "/Resources/Sprites/ShooterEnemy07.png");
    this.Anim_PlayerBullet = new Animation("/Resources/Sprites/PlayerBullet00.png", "/Resources/Sprites/PlayerBullet07.png");
    this.Anim_BasicEnemy = new Animation("/Resources/Sprites/BasicEnemy00.png", "/Resources/Sprites/BasicEnemy07.png");
    this.Anim_Player = new Animation("/Resources/Sprites/Player00.png", "/Resources/Sprites/Player07.png");
    this.Anim_Explosion = new Animation("/Resources/Sprites/Explosion00.png", "/Resources/Sprites/Explosion04.png");

    // Gameplay Vars
    this.Score = 0;
    this.FrameCount = 0;

    // Gameplay objects
    this.Player = this.player(CanvasX, CanvasY);
    this.PlayerBullets = new Group();
    this.EnemyBullets = new Group();
    this.Enemies = new Group();

    // Back to menu button
    this.Btn_backToMenu = undefined;
  }

  //
  // Game state reset
  //
  reset() {
    // Remove
    removeElements();
    allSprites.removeSprites();
    this.Sound_Music.stop();

    // Re-assign
    this.Score = 0;
    this.FrameCount = 0;
    this.Btn_backToMenu = undefined;
    this.Player = this.player(this.CanvasX, this.CanvasY);
    this.PlayerBullets = new Group();
    this.EnemyBullets = new Group();
    this.Enemies = new Group();
  }

  //
  // Main Game function, also draw func
  //
  draw() {

    // Draw em all.
    allSprites.draw();
    this.displayScore();

    // Collision detection
    this.PlayerBullets.collide(this.Enemies, this.enemyHit.bind(this));
    this.Enemies.collide(this.Player, this.playerHit.bind(this));
    this.EnemyBullets.collide(this.Player, this.playerHit.bind(this));

    // Enemies should be generated at an 80 frame interval to avoid overlapping
    if (this.FrameCount > 80) {
      this.generateEnemies();
      this.FrameCount = 0;
    }

    // Shooter enemies cant independantly decide when to shoot, so it must be iterrated in the draw function.
    for (let enemy of this.Enemies) {
      if (enemy.type == "shooterEnemy" && random(200) <= 1) this.EnemyBullets.add(this.enemyBullet(enemy.position));

      // also fast enemies need to know who to displace
      if (enemy.type == "fastEnemy") enemy.displace(this.Enemies);
    }

    // This is used to prevent loose frame calls after state change
    if (this.FrameCount > 5) {

      if (this.Btn_backToMenu == undefined) {
        this.Btn_backToMenu = createButton("Back to menu");
        this.Btn_backToMenu.position(this.CanvasX / 1.5, 30);
        this.Btn_backToMenu.mousePressed(this.backToMenu.bind(this));
      }

      // Music is played here to avoid issue of music continually playing when the game state is not active.
      if (this.Sound_Music.isPlaying() == false) this.Sound_Music.play();
    }

    this.FrameCount++;
  }


  //
  // In Game functions
  // 
  keyPressed(Key) {

    if (Key == UP_ARROW) {
      this.PlayerBullets.add(this.playerBullet(this.Player.position));
      this.Sound_Shoot.play();
    }

    if (Key == LEFT_ARROW)
      this.Player.position.x -= 50;

    if (Key == RIGHT_ARROW)
      this.Player.position.x += 50;
  }

  //
  // Ingame UI
  //
  displayScore() {
    // Top bar
    fill(100, 100);
    noStroke();
    rect(0, 0, this.CanvasX, this.CanvasY / 10);

    // Score + Lives display
    fill(255);
    textSize(30);
    textAlign(CENTER);
    text("Score   " + this.Score, this.CanvasX / 10, (this.CanvasY / 10) / 1.5);
    text("Lives   " + this.Player.Lives, this.CanvasX / 3, (this.CanvasY / 10) / 1.5);
  }

  //
  // Generates a line of enemies based on screen width
  //
  generateEnemies() {

    // Loop through every place on the X axis where an enemy could go. 
    for (let x = 100; x < this.CanvasX - 100; x += 90) {

      // 50/50 chance of enemy
      if (random(2) <= 1) {

        //1 in 5 chance of shooter
        if (random(5) <= 1)
          this.Enemies.add(this.shooterEnemy(x, 50));
        // 1 in 4 chance of fast enemy
        else if (random(4) <= 1)
          this.Enemies.add(this.fastEnemy(x, 50));
        // else just draw a normal enemy
        else
          this.Enemies.add(this.basicEnemy(x, 50));
      }
    }
  }

  //
  // Takes the user back to the splash screen
  // 
  backToMenu() {
    ChangeState(this, "Back to menu");
  }


  //
  // Collision callbacks
  //
  playerHit(Enemy, Player) {

    this.explosion(Enemy.position);
    Enemy.remove();

    Player.Lives--;

    if (Player.Lives > 0)
      this.Sound_Hurt.play();

    // player has died, notify the ChangeState function.
    else {
      this.Sound_Bruh.play();
      ChangeState(this, "End Game");
    }

  }

  enemyHit(Bullet, Enemy) {

    Bullet.remove();
    Enemy.Lives--;

    if (Enemy.Lives == 0) {
      this.Score += Enemy.Points;
      this.explosion(Enemy.position);
      this.Sound_Explosion.play();
      Enemy.remove();
    }
  }

  //
  // Sprite object creations
  //
  player(X, Y) {
    let Sprite = createSprite(X / 2, Y - 100, 50, 50);
    Sprite.addAnimation("Player", this.Anim_Player);
    Sprite.Lives = 5;

    return Sprite;
  }

  playerBullet(position) {
    let Sprite = createSprite(position.x, position.y, 0, 0);
    Sprite.addAnimation("Static", this.Anim_PlayerBullet);
    Sprite.velocity.y = -10;
    Sprite.life = 100;

    return Sprite;
  }

  basicEnemy(x, y) {
    let Sprite = createSprite(x, y, 0, 0);
    Sprite.addAnimation("Enemy", this.Anim_BasicEnemy);

    Object.assign(Sprite, {
      type: "basicEnemy",
      velocity: createVector(0, 1),
      Lives: 1,
      Points: 10,
      life: 900
    });

    return Sprite;
  }

  fastEnemy(x, y) {
    let Sprite = createSprite(x, y, 0, 0);
    Sprite.addAnimation("Enemy", this.Anim_BasicEnemy);

    Object.assign(Sprite, {
      type: "fastEnemy",
      velocity: createVector(0, 3),
      Lives: 1,
      Points: 20,
      life: 900
    });

    return Sprite;
  }

  shooterEnemy(x, y) {
    let Sprite = createSprite(x, y, 0, 0);
    Sprite.addAnimation("Enemy", this.Anim_ShooterEnemy);

    Object.assign(Sprite, {
      type: "shooterEnemy",
      velocity: createVector(0, 1),
      Lives: 3,
      Points: 30,
      life: 900
    });

    return Sprite;
  }

  enemyBullet(position) {
    let Sprite = createSprite(position.x, position.y, 0, 0);
    Sprite.addAnimation("Static", this.Anim_PlayerBullet);
    Sprite.velocity.y = 7;
    Sprite.life = 100;

    return Sprite;
  }

  explosion(position) {
    let Sprite = createSprite(position.x, position.y, 0, 0);
    Sprite.addAnimation("Explode", this.Anim_Explosion);
    Sprite.life = 20;

    return Sprite;
  }
}