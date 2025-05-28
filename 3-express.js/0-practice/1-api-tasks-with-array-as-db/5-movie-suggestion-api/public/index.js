const movieResult = document.getElementById('movieResult');
const generateBtn = document.querySelector('.generateMovie'); 
generateBtn.addEventListener('click', () => {
  getMovie();
});

async function getMovie() {
  const response = await fetch('./movie');
  const data = await response.json();
  console.log(data);
  movieResult.innerText = `
    Movie: ${data.title} 
    Genre: ${data.genre}
  `;
}