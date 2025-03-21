const btn = document.querySelector('.generate-btn');
const difficulty = document.getElementById('difficulty-text');
const input = document.querySelector('.input-box');
const submit = document.querySelector('.submit-btn');
const finalText = document.getElementById('final-text');
const question = document.getElementById('question-text');

btn.addEventListener('click', () => {
  getTrivia();
});

let correctAnswer = ""; //accumulator pattern

async function getTrivia() {
  const response = await fetch('./trivia');
  const data = await response.json();
  console.log(data);
  question.innerText = `
    Question: ${data.question}
    Difficulty: ${data.difficulty}
  `;  
  correctAnswer = data.answer.toLowerCase();
  finalText.innerText = ""; // clean slate
}

submit.addEventListener('click', () => {
  checkAnswer();
});

input.addEventListener('keydown', (event) => {
  if(event.key === 'Enter'){
    checkAnswer();
  }
})

function checkAnswer() {
  const userAnswer = input.value.toLowerCase();
  if(userAnswer === correctAnswer){
    finalText.innerText = `✅ Correct`;
  } else{
    finalText.innerText = '❌ Wrong';
  }
}