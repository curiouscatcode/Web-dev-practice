const btn = document.querySelector('.js-btn');
const diceElement = document.querySelector('.js-dice');

btn.addEventListener('click', () => {
  generate();
});

function generate() {
  const randomNumber = Math.floor(Math.random() * 6) + 1;

  diceElement.innerHTML = '';

    // Dot placement based on the random number
    if (randomNumber === 1) {
      createDot(50, 50); // center
    } else if (randomNumber === 2) {
      createDot(30, 30); // top-left
      createDot(70, 70); // bottom-right
    } else if (randomNumber === 3) {
      createDot(30, 30); // top-left
      createDot(50, 50); // center
      createDot(70, 70); // bottom-right
    } else if (randomNumber === 4) {
      createDot(30, 30); // top-left
      createDot(30, 70); // bottom-left
      createDot(70, 30); // top-right
      createDot(70, 70); // bottom-right
    } else if (randomNumber === 5) {
      createDot(30, 30); // top-left
      createDot(30, 70); // bottom-left
      createDot(50, 50); // center
      createDot(70, 30); // top-right
      createDot(70, 70); // bottom-right
    } else if (randomNumber === 6) {
      createDot(30, 20); // top-left
      createDot(30, 50); // middle-left
      createDot(30, 80); // bottom-left
      createDot(70, 20); // top-right
      createDot(70, 50); // middle-right
      createDot(70, 80); // bottom-right
    }
  }
  
  function createDot(topPercent, leftPercent) {
    const dot = document.createElement('div');
    dot.classList.add('dot');
    dot.style.top = `${topPercent}%`;
    dot.style.left = `${leftPercent}%`;
    diceElement.appendChild(dot);
  
}