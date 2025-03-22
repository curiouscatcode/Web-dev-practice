let currentPlayer = 'X';
let boxes = document.querySelectorAll('.box');
const moveSound = new Audio('play-move-audio.wav');
let gif = document.querySelector('.js-win-gif');

const changeTurn = () => {
  return turn === "X"?"0":"X"
}

const checkWin = () => {

}

Array.from(boxes).forEach((element) => {
  let boxtext = document.querySelector('.boxtext');
  boxtext.addEventListener('click', () => {
    if(element.innerText === ''){
      e.innerText = turn;
      changeTurn();
      moveSound.currentTime = 0;
      moveSound.play();
      checkWin();
    }
  })
});