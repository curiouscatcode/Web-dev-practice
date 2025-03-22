const btn = document.querySelector('.js-generate');
const input = document.querySelector('.js-input');
const output = document.querySelector('.js-output');

function generateRandomPassword(length) {
  const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()";
  let password = ""; // Start with an empty password

  for(let i = 0; i < length; i++){
    const randomIndex = Math.floor(Math.random() * characters.length);
    const randomCharacter = characters[randomIndex];

    password += randomCharacter;
  }
  return password;
}

function update() {
  const length = parseInt(input.value);

  if(isNaN(length) || length <= 0){
    output.textContent = "Please enter a valid password length !";
    return;
  }
  const password = generateRandomPassword(length);

  output.textContent = `Generated Password: ${password}`;
}

btn.addEventListener('click', () => {
  update();
});

input.addEventListener('keydown', (event) => {
  if(event.key === 'Enter'){
    update();
  }
});