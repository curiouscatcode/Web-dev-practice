const prevBtn = document.querySelector('.js-prev-btn');
const nextBtn = document.querySelector('.js-next-btn');

const steps = [{
   check: '&#128473;',
   text: 'Start'
}, {
    check: '&#128473;',
    text: 'Step1'
}, {
    check: '&#128473;',
    text: 'Step2'
}, {
    check: '&#128473;',
    text: 'Step3'
}, {
    check: '&#128473;',
    text: 'Step4'
}, {
    check: '&#128473;',
    text: 'End'
}]

let positionCount = 0;

function renderBar() {
  let stepsHTML = "";

  steps.forEach((steps, index) => {
    stepsHTML += `
        <div class="step-container">
          <div class="step-outer-circle">
            <div class="step-inner-circle"><span class="tick">${steps.check}</span>
              <!--<div class="fa" style="font-size: 20px">&#128473;</div>-->
            </div>
          </div>
          <p class="step-text">${steps.text}</p>
        </div>

    `;
    //Only add a connecting wire if it's not the last step
    if(index !== steps.length - 1){
      stepsHTML += `<div class="connecting-wire"></div>`;
    }
  });

  const container = document.querySelector('.container');
  if (container) {
    container.innerHTML = stepsHTML;
  } else {
    console.error("Container element not found!");
  }
}

renderBar();

function updateSteps() {
  let circles = document.querySelectorAll('.step-outer-circle');
  let ticks = document.querySelectorAll('.tick');
  let texts = document.querySelectorAll('.step-text');
  let wires = document.querySelectorAll('.connecting-wire');

  circles.forEach((circle, index) => {
    if(index <= positionCount){
      circle.style.backgroundColor = 'green';
      ticks[index].innerHTML = '&#10004;';
      ticks[index].style.color = 'green';
      texts[index].style.color = 'green';
    } else {
      circle.style.backgroundColor = '';
      ticks[index].innerHTML = '&#128473;';
      ticks[index].style.color = '';
      texts[index].style.color = '';
    } 
  });

  wires.forEach((wire, index) => {
    if(index < positionCount){
      wires[index].style.backgroundColor = 'green';
    } else{
      wires[index].style.backgroundColor = '';
    }   
  });

  if (positionCount >= steps.length - 1){
    nextBtn.style.backgroundColor = 'gray';
    nextBtn.disabled = true;
  } else {
    nextBtn.style.backgroundColor = '';
    nextBtn.disabled = false;
  }

  if (positionCount <= steps.length - 6){
    prevBtn.style.backgroundColor = 'gray';
    prevBtn.disabled = true;
  } else {
    prevBtn.style.backgroundColor = '';
    prevBtn.disabled = false;
  }

}

nextBtn.addEventListener('click', () => {
  if(positionCount < steps.length - 1){
    positionCount++;
    updateSteps();
  }
});

prevBtn.addEventListener('click', () => {
  if(positionCount > 0){
    positionCount--;
    updateSteps();
  }
})