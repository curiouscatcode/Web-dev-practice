const btn = document.querySelector('.generate-btn');
const finalText = document.getElementById('output-text');

btn.addEventListener('click', () => {
  generateQuote();
});

async function generateQuote() {
  const response = await fetch('./quote');
  const data = await response.json();
  console.log(data);
  finalText.innerText = `
    Quote: ${data.quote} 
    Author: ${data.author} 
  `;
}