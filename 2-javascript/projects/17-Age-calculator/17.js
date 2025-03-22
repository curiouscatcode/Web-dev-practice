calculateBtn = document.getElementById('js-calculate-btn');
birthday = document.querySelector('.js-birthday');
outputText = document.querySelector('.js-output');

function calculateAge() {
  const birthdayValue = birthday.value;
  if(birthdayValue === ""){
    alert('Enter valid age!');
  } else {
    const age = getAge(birthdayValue);
    outputText.innerHTML = `You are ${age} ${age > 1 ? 'years':'year'} old`;
  }
}

function getAge(birthdayValue) {
  const currentDate = new Date();
  const birthdayDate = new Date(birthdayValue);

  let age = currentDate.getFullYear() - birthdayDate.getFullYear();
  const month = currentDate.getMonth() - birthdayDate.getMonth();

  if (
    month < 0 || 
    (month === 0 && currentDate.getDate() < birthdayDate.getDate())
  ) {
    age--;
  }

  return age;
}
calculateBtn.addEventListener('click', calculateAge);