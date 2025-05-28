const btn = document.querySelector('.generate-btn');
const generatedText = document.getElementById('generated-text');

btn.addEventListener('click', () => {
  getBook();
});


  async function getBook() {
  const response = await fetch('./books');
  const data = await response.json();
  console.log(data);
  generatedText.innerText = `
    ID: ${data.id}
    Title: ${data.title}
    Author: ${data.author}
    Genre: ${data.genre}
  `;  
}
