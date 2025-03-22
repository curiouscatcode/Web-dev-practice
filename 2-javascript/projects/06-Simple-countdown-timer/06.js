const start = document.querySelector('.js-btn');
const inputElement = document.querySelector('.js-input');
const resetElement = document.querySelector('.js-reset');

let time;
let interval;

//constructor
const dingSound = new Audio("audio1.wav");
// Function to play the sound
function playDing() {
  dingSound.play();
}

function update() {
  time = document.querySelector('.js-input').value;
  let display = document.querySelector('.js-display');

  if(time <= 0 || isNaN(time)) {
    display.innerHTML = 'Enter vaild time!';
    return;
  }

  interval = setInterval(() => {
    if(time > 0) {
      display.innerHTML = `${time} seconds left`;
      time--;
      inputElement.readOnly = true; 
    } else {
      clearInterval(interval);
      display.innerHTML = 'Time Up!';
      playDing();
    }
  }, 1000);
}
start.addEventListener('click', () => {
  update();
});

inputElement.addEventListener('keydown', (event) => {
  if(event.key === 'Enter'){
    update();
  }
});

resetElement.addEventListener('click', () => {
  clearInterval(interval);
  time = 0;
  document.querySelector('.js-display').innerHTML = '0';
  inputElement.readOnly = false;
  document.querySelector('.js-input').value = '';
});