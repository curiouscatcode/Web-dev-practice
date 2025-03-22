let num1 = Math.ceil(Math.random() * 10);
let num2 = Math.ceil(Math.random() * 10);

// Retriving the storage
let score = JSON.parse(localStorage.getItem('score')) || 0;

const container = document.querySelector('.js-container');

if (container) {
    container.innerHTML += `
        <div class="score-div js-score">
          Score: ${score}
        </div>
        <div class="question-div js-question-div">
          What is ${num1} multiply by ${num2}?
        </div>
        <input class="answer-input js-input" placeholder="Enter your answer">
        <button class="submit-btn js-btn">Submit</button>
    `;
} else {
    console.error('Element with class "js-container" not found.');
}

const question = document.querySelector('.js-question-div');

function generateQuestion() {
  num1 = Math.ceil(Math.random() * 10);
  num2 = Math.ceil(Math.random() * 10);
  question.innerText = `What is ${num1} multiply by ${num2}?`; 
}

const button = document.querySelector('.js-btn');

const updateOnScore = document.querySelector('.js-score');

const answerInput = document.querySelector('.js-input');

generateQuestion();

function box () {
  const answer = Number(answerInput.value);


  if(answer === parseInt(num1 * num2)){
    score++;
    updateLocalStorage();
  } else {
    score--;
    updateLocalStorage();
  }  

  updateOnScore.innerText = `Score: ${score}`;

  answerInput.value = '';

  generateQuestion();  
}
button.addEventListener('click', () => {
  box();
});
answerInput.addEventListener('keydown', (event) => {
  if(event.key === 'Enter'){
    box();
  }
});

function updateLocalStorage() {
  localStorage.setItem('score', JSON.stringify(score));
}