const steps = [{
  question: 'Do You Accept All Major Credit Cards ?',
  answer: 'We do accept major cards from all over the world. Aur kuch puchna hai toh, puch le. Faltu sawaal puch kar kya milta hai tumhe.'
}, {
  question: 'Do You Support Local Farmers ?',
  answer: 'Yes, we do support local farmers. Aur hum kis ko support kare kis na kare usse tumhe kya be.'
},{
  question: 'Do You Use Organic Ingredients ?',
  answer: 'Yes we do use organic ingredients, natural ingredients.'
}];

let questionsHTML = '';

steps.forEach((step) => {
  questionsHTML += `
    <div class="container-1 js-container">
      <div class="question-container">
        <p class="Q-1">${step.question}</p>
        <div class="btn-div">
          <button type="button" class="question-btn">
            <span class="plus-icon">
              <i class="fa fa-plus-square js-plus" id="plus"></i>
            </span>
            <span class="minus-icon">
              <i class="fa fa-minus-square js-minus" id="minus"></i>
            </span>
          </button>
          <hr>
        </div>
        <div class="answer-container js-answer">
          <p class="answer-text">${step.answer}</p>
        </div>
      </div>
    </div>
  `;

  document.querySelector('.js-main-container')
    .innerHTML = questionsHTML;
});

let answers = document.querySelectorAll('.js-answer');
let plusIcons = document.querySelectorAll('.js-plus');
let minusIcons = document.querySelectorAll('.js-minus');
let containers = document.querySelectorAll('.js-container');

answers.forEach(answer => {
  answer.style.maxHeight = '0';
  answer.style.overflow = 'hidden';
  answer.style.transition = 'max-height 0.3s ease';
});


plusIcons.forEach((plus, index) => {
  plus.addEventListener('click', () => {
    let answerHeight = answers[index].scrollHeight;
    let containerHeight = containers[index].scrollHeight + answerHeight;

    answers[index].style.maxHeight = answerHeight + 'px';
    containers[index].style.maxHeight = containerHeight + 'px';

    plus.style.display = 'none';
    minusIcons[index].style.display = 'inline-block';
  });
});

minusIcons.forEach((minus, index) => {
  minus.addEventListener('click', () => {
    answers[index].style.maxHeight = '0';
    // Show plus, hide minus
    minus.style.display = 'none';
    plusIcons[index].style.display = 'inline-block';
  });
});