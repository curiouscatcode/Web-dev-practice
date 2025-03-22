const btn = document.querySelector('.js-btn');
const fact = document.querySelector('.js-fact');

async function getFact() {
  try {
    let url = `https://api.allorigins.win/raw?url=https://catfact.ninja/fact&t=${new Date().getTime()}`;
    let response = await fetch(url);
    let data = await response.json();
    //console.log(data.fact);
    fact.innerHTML = `${data.fact}`;
  } catch (error) {
    console.log("Error:", error);
    fact.innerHTML = 'Failed to fetch';
  }
}

btn.addEventListener('click', getFact);