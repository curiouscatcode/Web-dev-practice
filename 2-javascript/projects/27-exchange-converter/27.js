const currencyFirst = document.getElementById('currency-first');
const currencySecond = document.getElementById('currency-second');
let initialWorth = document.getElementById('worth-first');
let finalWorth = document.getElementById('worth-second');
let lastText = document.getElementById('exchange-rate');

async function getAmount() {
  try {
    let response = await fetch(`https://v6.exchangerate-api.com/v6/3c5a3179b11e9ad0be3c133c/latest/${currencyFirst.value}`);  
    let data = await response.json();
    console.log(data);

    //Extract the conversion rate
    const rate = data.conversion_rates[currencySecond.value];

    console.log(`1 ${currencyFirst.value} = ${rate} ${currencySecond.value}`);
    lastText.innerText = `1 ${currencyFirst.value} = ${rate} ${currencySecond.value}`;
    //Convert the amount
    finalWorth.value = (initialWorth.value * rate).toFixed(2);

  } catch (error) {
    console.log("Error", error);
  }
}

currencyFirst.addEventListener('change', getAmount);
currencySecond.addEventListener('change', getAmount);
initialWorth.addEventListener('input', getAmount);

getAmount();