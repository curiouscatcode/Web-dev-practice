const rightFirstAnswer = document.querySelector('.js-option1');
const wrongAnswer1 = document.querySelector('.js-option2');
const wrongAnswer2 = document.querySelector('.js-option3');
const wrongAnswer3 = document.querySelector('.js-option4');
let nextBtn = document.querySelector('.js-next-btn');
let question1 = document.getElementById('question-1');
let question2 = document.getElementById('question-2');
let option1b = document.querySelector('.js-option-1b');
let rightSecondAnswer = document.querySelector('.js-option-3b');
let option2b = document.querySelector('.js-option-2b');
let option4b = document.querySelector('.js-option-4b');
let nextBtn2 = document.querySelector('.js-next-btn-2');
let question3 = document.getElementById('question-3');
let rightThirdAnswer = document.querySelector('.js-option-4c');
let option1c = document.querySelector('.js-option-1c');
let option2c = document.querySelector('.js-option-2c');
let option3c = document.querySelector('.js-option-3c');
let nextBtn3 = document.querySelector('.js-next-btn-3');
let question4 = document.getElementById('question-4');
let rightFourthAnswer = document.querySelector('.js-option-4d');
let option1d = document.querySelector('.js-option-1d');
let option2d = document.querySelector('.js-option-2d');
let option3d = document.querySelector('.js-option-3d');

function update4() {
  wrongAnswer3.style.backgroundColor = 'rgb(254, 103, 103)';
  wrongAnswer3.style.opacity = '0.8';
  wrongAnswer3.innerHTML = '&#10060;';
}
function update2 () {
  wrongAnswer1.style.backgroundColor = 'rgb(254, 103, 103)';
  wrongAnswer1.style.opacity = '0.8';
  wrongAnswer1.innerHTML = '&#10060;';
}

function update1() {
  rightFirstAnswer.style.backgroundColor = 'lightgreen';
  rightFirstAnswer.style.opacity = '0.5';
  rightFirstAnswer.innerHTML = `&#x2713;`;
}
function update3() {
  wrongAnswer2.style.backgroundColor = 'rgb(254, 103, 103)';
  wrongAnswer2.style.opacity = '0.8';
  wrongAnswer2.innerHTML = '&#10060;';  
}
rightFirstAnswer.addEventListener('click', () => {
  update1();
});
wrongAnswer1.addEventListener('click', () => {
  update2();
  update1();
});
wrongAnswer2.addEventListener('click', () => {
  update3();  
  update1();
});
wrongAnswer3.addEventListener('click', () => {
  update4();
  update1();
});

nextBtn.addEventListener('click', () => {
  question1.style.display = 'none';
  question2.style.display = '';
});

function update5() {
  rightSecondAnswer.style.backgroundColor = 'lightgreen';
  rightSecondAnswer.style.opacity = '0.5';
  rightSecondAnswer.innerHTML = `&#x2713;`;
}

option1b.addEventListener('click', () => {
  option1b.style.backgroundColor = 'rgb(254, 103, 103)';
  option1b.style.opacity = '0.8';
  option1b.innerHTML = '&#10060;'; 
  update5();
});

option2b.addEventListener('click', () => {
  option2b.style.backgroundColor = 'rgb(254, 103, 103)';
  option2b.style.opacity = '0.8';
  option2b.innerHTML = '&#10060;'; 
  update5();
});

rightSecondAnswer.addEventListener('click', () => {
  update5();
});

option4b.addEventListener('click', () => {
  option4b.style.backgroundColor = 'rgb(254, 103, 103)';
  option4b.style.opacity = '0.8';
  option4b.innerHTML = '&#10060;'; 
  update5();
});

nextBtn2.addEventListener('click', () => {
  question1.style.display = 'none';
  question2.style.display = 'none';
  question3.style.display = '';
});

function update6() {
  rightThirdAnswer.style.backgroundColor = 'lightgreen';
  rightThirdAnswer.style.opacity = '0.5';
  rightThirdAnswer.innerHTML = `&#x2713;`;
}

rightThirdAnswer.addEventListener('click', () => {
  update6();
});

option1c.addEventListener('click', () => {
  option1c.style.backgroundColor = 'rgb(254, 103, 103)';
  option1c.style.opacity = '0.8';
  option1c.innerHTML = '&#10060;'; 
  update6();
});

option2c.addEventListener('click', () => {
  option2c.style.backgroundColor = 'rgb(254, 103, 103)';
  option2c.style.opacity = '0.8';
  option2c.innerHTML = '&#10060;'; 
  update6();
});

option3c.addEventListener('click', () => {
  option3c.style.backgroundColor = 'rgb(254, 103, 103)';
  option3c.style.opacity = '0.8';
  option3c.innerHTML = '&#10060;'; 
  update6();
});

nextBtn3.addEventListener('click', () => {
  question1.style.display = 'none';
  question2.style.display = 'none';
  question3.style.display = 'none';
  question4.style.display = '';
});

function update7() {
  rightFourthAnswer.style.backgroundColor = 'lightgreen';
  rightFourthAnswer.style.opacity = '0.5';
  rightFourthAnswer.innerHTML = `&#x2713;`;
}
rightFourthAnswer.addEventListener('click', () => {
  update7();
});
option1d.addEventListener('click', () => {
  option1d.style.backgroundColor = 'rgb(254, 103, 103)';
  option1d.style.opacity = '0.8';
  option1d.innerHTML = '&#10060;'; 
  update7();
});
option2d.addEventListener('click', () => {
  option2d.style.backgroundColor = 'rgb(254, 103, 103)';
  option2d.style.opacity = '0.8';
  option2d.innerHTML = '&#10060;'; 
  update7();
});
option3d.addEventListener('click', () => {
  option3d.style.backgroundColor = 'rgb(254, 103, 103)';
  option3d.style.opacity = '0.8';
  option3d.innerHTML = '&#10060;'; 
  update7();
});


