const btn = document.querySelector('.js-btn');
const display = document.querySelector('.js-display');

function changeColor() {
  const letters = '0123456789ABCDEF'
  let color = '#';

  for (let i = 0; i < 6; i++){
    color += letters[Math.floor(Math.random() * 16)];
  }
  return color;
}

btn.addEventListener('click', () => {
  const randomColor = changeColor();
  display.style.backgroundColor = randomColor;
})