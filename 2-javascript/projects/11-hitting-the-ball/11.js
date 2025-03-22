const paddle = document.querySelector('.js-paddle');

let paddleX = 10;

function movePaddle(event) {
  if(event.key === 'ArrowLeft'){
    if(paddleX > 0){
      paddleX -= 10;
    } 
  } else if(event.key === 'ArrowRight'){
    if(paddleX < 543){
      paddleX += 10;
    }
  }

  paddle.style.left = paddleX + 'px';
}

document.addEventListener('keydown', movePaddle);