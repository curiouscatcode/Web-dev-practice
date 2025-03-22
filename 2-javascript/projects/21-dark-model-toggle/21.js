const circle = document.querySelector('.js-circle');
const toggle = document.querySelector('.js-toggle');

let isDarkMode = 0;
circle.addEventListener('click', () => {
  //console.log(1);
  circle.style.transition = '0.9s ease';

  if(isDarkMode === 0){
    circle.style.backgroundColor = 'black';
    circle.style.transform = 'translateX(150%)';
    toggle.style.backgroundColor = 'white';
    document.body.style.backgroundColor = 'black';
    isDarkMode = 1;
  } else{
    circle.style.backgroundColor = 'white';
    circle.style.transform = 'translateX(0%)';
    toggle.style.backgroundColor = '';
    document.body.style.backgroundColor = 'white';
    isDarkMode = 0;
  }
 
});