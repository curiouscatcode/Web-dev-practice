const step1 = document.querySelector('.js-step1');
const step2 = document.querySelector('.js-step2');
const step3 = document.querySelector('.js-step3');
const contentContainer = document.querySelector('.js-content-container');

function initialLoad() {
  step1.addEventListener('click', () => {
    step2.style.backgroundColor = 'lightblue';
    step3.style.backgroundColor = 'lightblue';
    step1.style.backgroundColor = 'lightyellow';
    step1.style.color = 'black';
    step2.addEventListener('mouseover', () => {
      step2.style.transition = '0.5s ease';
      step2.style.backgroundColor = '#e44884';
      step2.style.color = 'white';
    });
    step2.addEventListener('mouseout', () => {
      step2.style.backgroundColor = 'lightblue';
      step2.style.color = '';
    });

    step3.addEventListener('mouseover', () => {
      step3.style.transition = '0.5s ease';
      step3.style.backgroundColor = '#e44884';
      step3.style.color = 'white';
    });
    step3.addEventListener('mouseout', () => {
      step3.style.transition = '0.5s ease';
      step3.style.backgroundColor = 'lightblue';
      step3.style.color = '';
    });

    step1.addEventListener('mouseout', () => {
      step1.style.transition = '0.5s ease';
      step1.style.backgroundColor = 'lightyellow';
      step1.style.color = 'black';
    });
  });

  step1.click();
}
document.addEventListener('DOMContentLoaded', () => {
  initialLoad();
});

step2.addEventListener('click', () => {
  step1.style.backgroundColor = 'lightblue';
  step3.style.backgroundColor = 'lightblue';
  step2.style.backgroundColor = 'lightyellow';
  step2.style.color = 'black';
  step2.addEventListener('mouseover', () => {
    step2.style.backgroundColor = '';
    step2.style.color = 'black';
  });
  step2.addEventListener('mouseout', () => {
    step2.style.transition = '0.3s all ease';
    step2.style.backgroundColor = 'lightyellow';
  });

  step1.addEventListener('mouseover', () => {
    step1.style.transition = '0.5s ease';
    step1.style.backgroundColor = '#e44884';
    step1.style.color = 'white';
  });
  step1.addEventListener('mouseout', () => {
    step1.style.transition = '0.3s all ease';
    step1.style.backgroundColor = 'lightblue';
    step1.style.color = 'black';
  });

  step3.addEventListener('mouseover', () => {
    step3.style.transition = '0.5s ease';
    step3.style.backgroundColor = '#e44884';
    step3.style.color = 'white';
  });
  step3.addEventListener('mouseout', () => {
    step3.style.transition = '0.3s all ease';
    step3.style.backgroundColor = 'lightblue';
    step3.style.color = 'black';
  });
});

step3.addEventListener('click', () => {
  step3.style.backgroundColor = 'lightyellow';
  step3.style.color = 'black';
  step2.style.backgroundColor = 'lightblue';
  step1.style.backgroundColor = 'lightblue';
  step3.addEventListener('mouseout', () => {
    step3.style.backgroundColor = 'lightyellow';
  });
  step1.addEventListener('mouseover', () => {
    step1.style.backgroundColor = '#e44884';
    step1.style.color = 'white';
  });
  step1.addEventListener('mouseout', () => {
    step1.style.backgroundColor = 'lightblue';
  });
  step2.addEventListener('mouseover', () => {
    step2.style.backgroundColor = '#e44884';
    step2.style.color = 'white';
  });
  step2.addEventListener('mouseout', () => {
    step2.style.backgroundColor = 'lightblue';
  });
});

const steps = [{
  text: '1nsindijdnjdnoddndonddnodmoikhidnidjidjjdindijindjidjindjodjndojdndokiodokdindkindiokjdopiddondkdoidokdodkdondjdjodnodkidnpdkd[pkdpdj[pk'
}, {
  text: '2222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222'
}, {
  text: '3333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333'
}];

// Function to update content
function showContent(index) {
  contentContainer.innerText = steps[index].text; // Display only selected content
}

// Event listeners for each step
step1.addEventListener('click', function () {
  showContent(0);
});

step2.addEventListener('click', function () {
  showContent(1);
});

step3.addEventListener('click', function () {
  showContent(2);
});
