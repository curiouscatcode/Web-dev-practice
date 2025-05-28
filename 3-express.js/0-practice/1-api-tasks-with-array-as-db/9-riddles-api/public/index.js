const btn = document.querySelector('.generate-btn');
const question = document.getElementById('question-text');
const category = document.getElementById('category');
const input = document.querySelector('.input-box');
const finalText = document.getElementById('final-text');
const submit = document.querySelector('.submit-btn');

btn.addEventListener('click', () => {
  getRiddle();
});
let correctAnswer = ""; //accumulator pattern
async function getRiddle() {
  const response = await fetch('./riddle');
  const data = await response.json();
  console.log(data);
  question.innerText = `
    Question: ${data.question}
    Category: ${data.category} 
  `;
  correctAnswer = data.answer.toLowerCase();
  finalText.innerText = ""; //cleaning the answer slate 
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
    finalText.innerText = '✅ Correct !';
  } else {
    finalText.innerText = '❌ Wrong';
  }
}