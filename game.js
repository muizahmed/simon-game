var buttonColors = ["red", "blue", "green", "yellow"];

var gamePattern = [];

var userClickedPattern = [];

var level = 0;

var userWins = true;

startGame();

// Detect a keypress to start the game, this listens for the first keypress only
function startGame() {
  $("body").one("keypress touchend", function (event) {
    //Using "keypress" here instead of "keydown" to make sure that the user is interacting with document.
    //keypress only detects press of printable characters.
    game();
    event.preventDefault();
  });
}

// Entails the full functionality of the game
function game() {
  incrementLevel();
  nextSequence();
  showPattern();

  setTimeout(function () {
    var count = 0;
    $(".game").on("click", function (e) {
      count++;
      console.log(count);
      userShowPattern(e);
      gameLogic();
      console.log(gamePattern, userClickedPattern);

      if (count === gamePattern.length || !userWins) {
        $(".game").off("click");
        userClickedPattern.length = 0;
        if (userWins) {
          setTimeout(function () {
            game();
          }, 1500);
        } else {
          gameEnd();
          startOver();
        }
      }
    });
  }, 5);
}

// Change the heading of the page, and increase the level each time the user wins
function incrementLevel() {
  heading = $("#level-title");
  level++;
  heading.fadeOut(function () {
    heading.text(`Level ${level}`);
    heading.fadeIn();
  });
}

// Chooses the next color randomly, and adds it to the end of gamePattern array to store the sequence
function nextSequence() {
  var randomNumber = Math.floor(Math.random() * 4);
  randomChosenColor = buttonColors[randomNumber];
  gamePattern.push(randomChosenColor);
}

// Flash animation to show which color was randomly chosen
function flashPattern(patternColor) {
  $("#" + patternColor)
    .fadeOut(50)
    .fadeIn(50);
}

// Takes the name of the mp3 audiofile and plays it from the sounds directory
function playSound(name) {
  var audio = new Audio(`./sounds/${name}.mp3`);
  audio.play();
}

// Flash animation and play the sound associated with the chosen color
function showPattern() {
  playSound(randomChosenColor);
  flashPattern(randomChosenColor);
}

// Detects which color the user clicked on and adds it to userClickedPattern to store the sequence
function userPattern(event) {
  userChosenColor = event.target.id;
  userClickedPattern.push(userChosenColor);
}

// Outline animation to highlight which color the user clicked on
function animatePress(chosenId) {
  $(chosenId).addClass("pressed");
  setTimeout(function () {
    $(chosenId).removeClass("pressed");
  }, 100);
}

// Show the click animation and play the sound associated with that color
function userShowPattern(event) {
  userPattern(event);
  playSound(userChosenColor);
  animatePress(`#${userChosenColor}`);
}

// The actual logic of the Simon Game, to compare the user pattern against the game's pattern
function gameLogic() {
  for (let i = 0; i < userClickedPattern.length; i++) {
    if (userClickedPattern[i] === gamePattern[i]) {
      userWins = true;
    } else {
      userWins = false;
    }
  }
}

// When user loses, play sound and animations to indicate that the game was ended
function gameEnd() {
  heading.fadeOut(function () {
    heading.text("Game Over! Press any key to restart");
    heading.fadeIn();
  });
  playSound("wrong");
  $("body").addClass("game-over");
  setTimeout(function () {
    $("body").removeClass("game-over");
  }, 200);
}

// If the user presses a key, reset the variables and restart the game
function startOver() {
  level = 0;
  gamePattern = [];
  userWins = true;
  startGame();
}
