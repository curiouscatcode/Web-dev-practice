const answer = document.querySelector('.js-answer-screen');
const btns = document.querySelectorAll('.js-no1, .js-no2, .js-no3, .js-no4, .js-no5, .js-no6, .js-no7, .js-no8, .js-no9');

btns.forEach(btns => {
  btns.addEventListener('click', (event) => {
    answer.textContent += event.target.textContent;
  });
});

let num1 = '';
let num2 = '';
let operator = '';

btns.forEach(btns => {
  btns.addEventListener('click', (event) => {
    if(!operator){
      num1 += event.target.textContent;
    } else {
      num2 += event.target.textContent;
    }
    answer.textContent += event.target.textContent;
  });
});

const operators = document.querySelectorAll('.js-plus, .js-minus, .js-multiply, .js-divide');

operators.forEach(op => {
  op.addEventListener('click', (event) => {
    if(num1 && !operator) {
      operator = event.target.textContent;
      answer.textContent += `${operator}`;
    }
  });
});