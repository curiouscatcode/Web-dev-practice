const numbers = [{
  number1: 'a',
  number2: 'b',
  operatorName: 'o'
}];

function generateTwoNumbers () {
  let num1 = Math.floor(Math.random() * 100) + 1;
  let num2 = Math.floor(Math.random() * 100) + 1;

  return {num1, num2};
}

function generateOperator() {
  const operators = ['+', '-', '*', '/', '%'];
}

numbers.forEach((numbers) => {
  const html = `
    <div class="container">
    <h3>Q: ${num1} ${operator} ${num2} =</h3>
    <input type="number" placeholder="answer">

    <p class="js-result">2</p>
   
  `;
});

