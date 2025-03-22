const btn = document.querySelector('.js-btn');
const joke = document.querySelector('.js-joke-text');

async function getJoke() {
  try {
    let response = await fetch('https://official-joke-api.appspot.com/random_joke');
    let data = await response.json(); //Convert to json
    joke.innerHTML = `${data.setup} <br> <strong>${data.punchline}</strong>`;
  } catch (error) {
    console.log("Error", error);
    joke.innerHTML = 'Failed to fetch joke. Try again';
  }
}

 btn.addEventListener('click', getJoke);