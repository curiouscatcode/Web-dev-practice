const btn = document.querySelector('.generate-btn');
const finalText = document.getElementById('final-text');

btn.addEventListener('click', () => {
  getFact();
});

async function getFact() {
  const response = await fetch('./fact');
  const data = await response.json();
  console.log(data);
  finalText.innerText = `
    Category: ${data.category}
    Fact: ${data.fact}
  `;
}