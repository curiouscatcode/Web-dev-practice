let inputText = document.querySelector('.js-input');
let selectElement = document.querySelector('.js-select');
let output = document.querySelector('.js-output');
let kelBtn = document.querySelector('.js-kel-btn');
let celBtn = document.querySelector('.js-cel-btn');
let fahBtn = document.querySelector('.js-fah-btn');

function updateKel1() {
  let inputValue = parseFloat(inputText.value);
  if (isNaN(inputValue)) {
    output.value = "Please enter a valid number!";
    return; // Stop function execution if input is invalid
  }
  let finalOutput = inputValue + 273.15;
  output.value = finalOutput;
}

function updateKel2() {
  let inputValue = parseFloat(inputText.value);
  if (isNaN(inputValue)) {
    output.value = "Please enter a valid number!";
    return; // Stop function execution if input is invalid
  }
  let finalOutput = inputValue;
  output.value = finalOutput;
}

function updateKel3() {
  let inputValue = parseFloat(inputText.value);
  if (isNaN(inputValue)) {
    output.value = "Please enter a valid number!";
    return; // Stop function execution if input is invalid
  }
  let finalOutput = (inputValue - 273.15) * 1.8 + 32;
  output.value = finalOutput;
}

function updateCel2() {
  let inputValue = parseFloat(inputText.value);
  if (isNaN(inputValue)) {
    output.value = "Please enter a valid number!";
    return; // Stop function execution if input is invalid
  }
  let finalOutput = inputValue - 273.15;
  output.value = finalOutput;
}

function updateCel3() {
  let inputValue = parseFloat(inputText.value);
  if (isNaN(inputValue)) {
    output.value = "Please enter a valid number!";
    return; // Stop function execution if input is invalid
  }
  let finalOutput = (inputValue * 9/5) + 32;
  output.value = finalOutput;
}

function updateFah1() {
  let inputValue = parseFloat(inputText.value);
  if (isNaN(inputValue)) {
    output.value = "Please enter a valid number!";
    return; // Stop function execution if input is invalid
  }
  let finalOutput = (9/5) * inputValue + 32;
  output.value = finalOutput;
}


kelBtn.addEventListener('click', () => {
  let selectMetric = selectElement.value;
  if(selectMetric === 'Celsius'){
    updateKel1();
  } else if(selectMetric === 'Kelvin'){
    updateKel2();
  } else if(selectMetric === 'Fahrenheit'){
    updateKel3();
  } else {
    output.value = 'Invalid';
  }
});

celBtn.addEventListener('click', () => {
  let selectMetric = selectElement.value;
  if(selectMetric === 'Celsius'){
    updateKel2();
  } else if(selectMetric === 'Kelvin'){
    updateCel2();
  } else if(selectMetric === 'Fahrenheit'){
    updateCel3();
  } else {
    output.value = 'Invalid';
  }
  
});

fahBtn.addEventListener('click', () => {
  let selectMetric = selectElement.value;
  if(selectMetric === 'Celsius'){
    updateFah1();
  } else if(selectMetric === 'Kelvin'){
    updateKel3();
  } else if(selectMetric === 'Fahrenheit'){
    updateKel2();
  }

})