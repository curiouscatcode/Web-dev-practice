// Select the paddle
const paddle = document.getElementById("paddle");

// Track the paddle's vertical position (top)
let paddleY = 200;

// Move the paddle
function movePaddle(event) {
  if (event.key === "ArrowUp") {
    // Move up (but keep it within the game area)
    if (paddleY > 0) {
      paddleY -= 10;
    }
  } else if (event.key === "ArrowDown") {
    // Move down (but keep it within the game area)
    if (paddleY < 500) { // 600px height - 100px paddle height = 500px max
      paddleY += 10;
    }
  }

  // Update the paddle's CSS position
  paddle.style.top = paddleY + "px";
}

// Add event listener for keydown
document.addEventListener("keydown", movePaddle);
