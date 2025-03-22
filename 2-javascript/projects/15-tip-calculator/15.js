billAmount = document.querySelector('.js-bill-amt');
tipPercentage = document.querySelector('.js-tip-per');
total = document.querySelector('.js-total');

calculateBtn = document.querySelector('.js-calculate-btn');

function calculateTotal() {
  let bill = parseFloat(billAmount.value);
  let tip = parseFloat(tipPercentage.value);
  let semifinal = bill * (tip / 100);
  final = semifinal + bill;
}

calculateBtn.addEventListener('click', () => {
  calculateTotal();
  total.innerHTML = final;
});