// Game Object Modules
var spaceBackground;
var splashScreen;
var gameState;

// Currently focused game state
var currentState;

var retroFont;

function preload() {

  //Initialise game states, game class constructors contain files that must be preloaded
  spaceBackground = new SpaceBackground(1080, 600, 100);
  gameState = new GameState(1080, 600);
  splashScreen = new SplashScreen(1080, 600);

  // I like this font
  retroFont = loadFont("//Resources/Fonts/ARCADECLASSIC.ttf");
}

function setup() {
  createCanvas(1080, 600);

  // Set the splash screen as the starting state
  currentState = splashScreen;

  // Set the retroFont style for the entire game.
  textFont(retroFont);
}

function keyPressed() {
  // Pass the key press events down to the currently active game state
  currentState.keyPressed(keyCode);
}


function draw() {
  background(0);

  // Draw the space background despite game states
  spaceBackground.draw();

  // By only drawing the selected state, we can navigate through different game windows.
  currentState.draw();
}

// changes the currently active state of the game.
// Function requests object sender so the main function can do what the class cannot do independantly
// Function also requests message which should explicitly state the change.
function ChangeState(sender, message) {

  // Start game state, called when the played presses any key in the splash screen.
  if (message == "Start Game") {
    currentState = gameState;
  }

  //  End game state, called when the player dies by the gameState object.
  if (message == "End Game") {
    let score = sender.Score;
    sender.reset();
    currentState = new ScoreState(1080, 600, "ScoreTable.JSON", score);
  }

  //  End game state, called when the player dies by the gameState object.
  if (message == "Back to menu") {
    sender.reset();
    splashScreen.loadVideo();
    currentState = splashScreen;
  }
}